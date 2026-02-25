#!/usr/bin/env node

/**
 * GTPL AOT Compiler (TypeScript AST version)
 *
 * 1️⃣ Crea entorno DOM virtual
 * 2️⃣ Carga GTPL (desde npm link gtpl)
 * 3️⃣ Escanea los .ts con el parser de TypeScript
 * 4️⃣ Detecta @Component() con AST (no regex)
 * 5️⃣ Compila HTML con GTPL.jit.GCode()
 * 6️⃣ Compila CSS/SCSS/SASS según styleMode
 * 7️⃣ Inyecta código AOT en src-aot/
 */

import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import ts from 'typescript';
import { glob } from 'glob';
import * as sass from 'sass'

// -----------------------------------------------------
// 🧭 Inicialización de rutas
// -----------------------------------------------------
const SRC_DIR = path.resolve(process.cwd(), 'src');
const OUT_DIR = path.resolve(process.cwd(), 'src-aot');

let GTPL;
let GLOBAL_STYLES = []; // 🧩 acumulador para styleMode: 'global'

// -----------------------------------------------------
// 🧱 1️⃣ Inicializar entorno DOM virtual
// -----------------------------------------------------
async function setupDOM() {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
        url: 'http://localhost',
        pretendToBeVisual: true
    });
    global.window = dom.window;
    global.document = dom.window.document;
    global.Node = dom.window.Node;
    global.Element = dom.window.Element;
    global.HTMLElement = dom.window.HTMLElement;
    global.customElements = dom.window.customElements;
    global.DocumentFragment = dom.window.DocumentFragment;
    global.Text = dom.window.Text;
    global.Comment = dom.window.Comment;
    global.DOMParser = dom.window.DOMParser;
    global.XMLSerializer = dom.window.XMLSerializer;
    global.Event = dom.window.Event;
    global.CustomEvent = dom.window.CustomEvent;
}

// -----------------------------------------------------
// 🧩 2️⃣ Cargar GTPL (desde npm link gtpl)
// -----------------------------------------------------
async function loadGTPL() {
    const mod = await import('@mpeliz/gtpl');
    GTPL = mod.default || mod;
    if (!GTPL?.jit?.GCode) {
        throw new Error('❌ No se pudo cargar GTPL. Asegúrate de hacer `npm link gtpl`.');
    }
    console.log('✓ GTPL cargado correctamente');
}

// -----------------------------------------------------
// 🧠 3️⃣ Analizar decoradores con AST de TypeScript
// -----------------------------------------------------
function extractComponentInfo(filePath, code) {
    const source = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const result = [];

    const looksLikeHtml = (text) => /^\s*</.test(text) && text.includes('>');
    const isComponentDecorator = (expr) => {
        if (!ts.isCallExpression(expr)) return false;
        const callee = expr.expression;
        if (ts.isIdentifier(callee)) return callee.text === 'Component';
        if (ts.isPropertyAccessExpression(callee)) return callee.name.text === 'Component';
        return false;
    };

    function visit(node) {
        if (ts.isClassDeclaration(node) && node.modifiers) {
            const decorators = node.modifiers.filter(m => m.kind === ts.SyntaxKind.Decorator);
            for (const decorator of decorators) {
                const expr = decorator.expression;
                if (isComponentDecorator(expr)) {
                    const arg = expr.arguments[0];
                    let templatePath = null;
                    let templateHtml = null;
                    let styleUrls = [];
                    let inlineStyles = [];
                    let styleMode = 'global'; // valor por defecto
                    if (arg && ts.isObjectLiteralExpression(arg)) {
                        for (const prop of arg.properties) {
                            const name = prop.name?.getText(source);
                            const value = prop.initializer;
                            if (name === 'styleMode' && ts.isStringLiteral(value))
                                styleMode = value.text;
                            if ((name === 'template' || name === 'templateUrl') && ts.isStringLiteral(value)) {
                                if (name === 'template' && looksLikeHtml(value.text))
                                    templateHtml = value.text;
                                else
                                    templatePath = value.text;
                            }
                            if ((name === 'style') && (ts.isStringLiteral(value) || ts.isArrayLiteralExpression(value))) {
                                if (ts.isStringLiteral(value)) {
                                    if (value.text.trim().endsWith('.css') || value.text.trim().endsWith('.scss') || value.text.trim().endsWith('.sass')) {
                                        styleUrls.push(value.text);
                                    } else {
                                        inlineStyles.push(value.text);
                                    }
                                } else {
                                    value.elements.forEach(e => {
                                        if (ts.isStringLiteral(e)) {
                                            if (e.text.trim().endsWith('.css') || e.text.trim().endsWith('.scss') || e.text.trim().endsWith('.sass')) {
                                                styleUrls.push(e.text);
                                            } else {
                                                inlineStyles.push(e.text);
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                    if (templatePath || styleUrls.length || inlineStyles.length) {
                        const className = node.name?.text || 'UnnamedComponent';
                        result.push({
                            className,
                            filePath,
                            templatePath,
                            templateHtml,
                            styleUrls,
                            inlineStyles,
                            styleMode
                        });
                    }
                }
            }
        }
        ts.forEachChild(node, visit);
    }
    visit(source);
    return result;
}

// -----------------------------------------------------
// 🧰 Inyectar el código compilado dentro de la clase
// -----------------------------------------------------
function injectCompiledAssets(code, className, compiledTemplate, compiledStyles, urlStyles) {
    let output = code;

    // Asegura import de GTPL:
    if (!code.includes("import GTPL from '@mpeliz/gtpl'")) {
        const importBlock = /import[^;]+;/g;
        const matches = code.match(importBlock);
        output = matches && matches.length
            ? code.replace(matches[matches.length - 1], `${matches[matches.length - 1]}\nimport GTPL from '@mpeliz/gtpl';`)
            : `import GTPL from '@mpeliz/gtpl';\n` + code;
    }

    // La expr del template compilado (igual que antes)
    const wrappedTemplate = `((GTPL) => {
      const g = GTPL.GGenerator;
      // @ts-ignore
      return ${compiledTemplate};
    })(GTPL)`;

    // Construye definiciones con defineProperty (no-writable, no-configurable, no-enumerable)
    const defs = [];

    // __gtemplate__
    defs.push(`
      if (!Object.prototype.hasOwnProperty.call(this, "__gtemplate__")) {
        Object.defineProperty(this, "__gtemplate__", {
          value: ${wrappedTemplate},
          writable: false,
          configurable: false,
          enumerable: false
        });
      }
    `);

    // __stylesInline__
    if (compiledStyles && compiledStyles.length) {
        // Si prefieres mantenerlo como string[], usa [compiledStyles] en vez de compiledStyles
        const inlineValue = JSON.stringify([compiledStyles]); // o JSON.stringify(compiledStyles) si ya es array
        defs.push(`
        if (!Object.prototype.hasOwnProperty.call(this, "__stylesInline__")) {
          Object.defineProperty(this, "__stylesInline__", {
            value: Object.freeze(${inlineValue}),
            writable: false,
            configurable: false,
            enumerable: false
          });
        }
      `);
    }

    // __styleUrls__
    if (urlStyles && urlStyles.length) {
        defs.push(`
        if (!Object.prototype.hasOwnProperty.call(this, "__styleUrls__")) {
          Object.defineProperty(this, "__styleUrls__", {
            value: Object.freeze(${JSON.stringify(urlStyles)}),
            writable: false,
            configurable: false,
            enumerable: false
          });
        }
      `);
    }

    // Inyecta un bloque estático con las defineProperty
    const propertyBlock = `
      static {
        ${defs.join('\n')}
      }
    `;

    // Inserta tras la llave de apertura de la clase
    const classRegex = new RegExp(
        `((?:export\\s+(?:default\\s+)?)?class\\s+${className}` +
        `(?:\\s+extends\\s+[\\w$.]+(?:\\s*<[^>]*>)?)?` +
        `(?:\\s+implements\\s+[\\w$,\\s]+)?` +
        `\\s*\\{)`,
        'm'
    );

    let injected = false;
    output = output.replace(classRegex, (_m, p1) => {
        injected = true;
        return `${p1}\n${propertyBlock}\n`;
    });

    if (!injected) {
        throw new Error(`No se pudo inyectar AOT en la clase "${className}". Verifica que la clase exista en el archivo.`);
    }

    return output;
}


// -----------------------------------------------------
// 🧶 Compila archivos de estilo (CSS, SCSS, SASS)
// -----------------------------------------------------
function compileStyleFile(absPath) {
    const ext = path.extname(absPath).toLowerCase();
    if (ext === '.scss' || ext === '.sass') {
        try {
            const result = sass.compile(absPath, { style: 'expanded' });
            return result.css;
        } catch (err) {
            console.error(`❌ Error compilando ${path.relative(SRC_DIR, absPath)}: ${err.message}`);
            return '';
        }
    }
    try {
        return fs.readFileSync(absPath, 'utf8');
    } catch (err) {
        console.error(`⚠️  No se pudo leer ${absPath}: ${err.message}`);
        return '';
    }
}

// -----------------------------------------------------
// 🔨 Procesar archivo TypeScript (seguro y completo)
// -----------------------------------------------------
async function processFile(filePath) {

    const code = fs.readFileSync(filePath, 'utf8');
    const components = extractComponentInfo(filePath, code);

    if (!components.length) {
        copyFilePreservingStructure(filePath);
        return false;
    }

    let modifiedCode = code;
    for (const info of components) {
        console.log(`✨ Compilando componente: ${path.relative(SRC_DIR, filePath)} [styleMode=${info.styleMode}]`);
        //---
        const absTemplate = info.templatePath ? path.resolve(path.dirname(filePath), info.templatePath) : null;
        let compiledTemplate = 'null';
        // 🧱 Compilar template (HTML → GCode)
        if (info.templateHtml != null) {
            compiledTemplate = await GTPL.jit.GCode(info.templateHtml);
        } else if (absTemplate && fs.existsSync(absTemplate)) {
            const html = fs.readFileSync(absTemplate, 'utf8');
            compiledTemplate = await GTPL.jit.GCode(html);
            // 🚫 No borrar el template original en src
            // ✅ Pero sí borrar la copia en src-aot si existe
            const aotTemplate = absTemplate.replace(SRC_DIR, OUT_DIR);
            if (fs.existsSync(aotTemplate)) {
                try {
                    fs.unlinkSync(aotTemplate);
                    console.log(`🗑️  Eliminado template inyectado (AOT): ${path.relative(OUT_DIR, aotTemplate)}`);
                } catch (err) {
                    console.warn(`⚠️  No se pudo eliminar ${aotTemplate}: ${err.message}`);
                }
            } else {
                console.warn(`⚠️  No he encontrado el template para eliminar: ${aotTemplate}`);
            }
        } else if (info.templatePath) {
            console.warn(`⚠️  Template no encontrado para ${info.className}: ${info.templatePath}`);
        }
        //---
        // 🎨 Compilar estilos (CSS / SCSS / SASS)
        const allInlineStyles = [];
        let compiledStyles = '';

        for (const s of info.styleUrls || []) {

            const abs = path.resolve(path.dirname(filePath), s);

            if (!fs.existsSync(abs)) continue;

            const css = compileStyleFile(abs);

            const temp = [];

            switch (info.styleMode) {
                case 'global':
                    GLOBAL_STYLES.push(css);
                    break;
                case 'inline':
                    allInlineStyles.push(css);
                    break;
                case 'file':
                case 'lazy':
                    const cssPath = emitCssFile(abs, css);
                    info.styleUrlsGenerated ??= [];
                    info.styleUrlsGenerated.push(cssPath);
                    if (abs.indexOf('.scss') >= 0 || abs.indexOf('.sass') >= 0) {
                        temp.push(info.styleMode);
                    }
                    break;
            }

            if (['global', 'inline', ...temp].indexOf(info.styleMode) >= 0) {
                const aotStyle = abs.replace(SRC_DIR, OUT_DIR);
                if (fs.existsSync(aotStyle)) {
                    try {
                        fs.unlinkSync(aotStyle);
                        console.log(`🗑️  Eliminado estilo (AOT): ${path.relative(OUT_DIR, aotStyle)}`);
                    } catch (err) {
                        console.warn(`⚠️  No se pudo eliminar ${aotStyle}: ${err.message}`);
                    }
                }
            }

        }

        for (const css of info.inlineStyles || []) {

            const rel = path.relative(SRC_DIR, filePath);
            const relDir = path.dirname(rel);
            const base = path.basename(rel, '.ts').toLowerCase();
            const cname = String(info.className || 'component').toLowerCase();
            const abs = path.join(OUT_DIR, relDir, `${base}-${cname}-inline.css`);

            switch (info.styleMode) {
                case 'global':
                    GLOBAL_STYLES.push(css);
                    break;
                case 'inline':
                    allInlineStyles.push(css);
                    break;
                case 'file':
                case 'lazy':
                    const cssPath = emitCssFile(abs, css);
                    info.styleUrlsGenerated ??= [];
                    info.styleUrlsGenerated.push(cssPath);
                    break;
            }

        }

        if (allInlineStyles.length) {
            compiledStyles = allInlineStyles.filter(Boolean).join('\n');
        }

        if (info.styleUrlsGenerated) {
            info.styleUrlsGenerated = [...new Set(info.styleUrlsGenerated)];
            // 🧭 Ajustar rutas a ser relativas al raíz del código fuente (SRC_DIR)
            info.styleUrlsGenerated = info.styleUrlsGenerated.map(cssPath => {
                let clean = cssPath;
                if (path.isAbsolute(cssPath)) {
                    const rel = path.relative(SRC_DIR, cssPath);
                    clean = rel.replace(/\\/g, '/');
                } else {
                    clean = cssPath.replace(/^(\.\/|\/)+/, '');
                }
                return './' + clean.replace(/\\/g, '/');
            });
        }

        modifiedCode = injectCompiledAssets(
            modifiedCode,
            info.className,
            compiledTemplate,
            compiledStyles,
            info.styleUrlsGenerated
        );

    }

    // 🧱 Escribir el archivo en src-aot (nunca modificar src)
    const destPath = filePath.replace(SRC_DIR, OUT_DIR);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, modifiedCode, 'utf8');
    return true;
}

function emitCssFile(absInput, compiledCss) {
    const rel = path.relative(SRC_DIR, absInput);
    const outPath = path.join(OUT_DIR, rel.replace(/\.(scss|sass)$/i, '.css'));
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, compiledCss, 'utf8');
    return outPath.replace(OUT_DIR, '').replace(/\\/g, '/');
}

// -----------------------------------------------------
// 📁 Copiar archivos manteniendo estructura
// -----------------------------------------------------
function copyFilePreservingStructure(srcFile) {
    const relPath = path.relative(SRC_DIR, srcFile);
    const destPath = path.join(OUT_DIR, relPath);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcFile, destPath);
}

// -----------------------------------------------------
// 🚀 Ejecutar compilador AOT
// -----------------------------------------------------
async function main() {
    console.log('🚀 GTPL AOT Compiler (AST)');
    await setupDOM();
    await loadGTPL();

    if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true, force: true });
    fs.mkdirSync(OUT_DIR, { recursive: true });

    const entries = await glob(`${SRC_DIR}/**/*`, {
        dot: true,
        nodir: false,
        ignore: ['**/node_modules/**', '**/dist/**']
    });

    let processed = 0, copied = 0, tsFiles = [];

    for (const entry of entries) {
        const stat = fs.statSync(entry);
        if (stat.isDirectory()) {
            const rel = path.relative(SRC_DIR, entry);
            const dest = path.join(OUT_DIR, rel);
            fs.mkdirSync(dest, { recursive: true });
            continue;
        }
        if (entry.endsWith('.ts')) {
            const code = fs.readFileSync(entry, 'utf8');
            if (/@[\w.]*Component\b/.test(code)) {
                tsFiles.push(entry);
                continue;
            }
            copyFilePreservingStructure(entry);
            copied++;
            continue;
        }
        copyFilePreservingStructure(entry);
        copied++;
    }

    for (const tsFile of tsFiles) {
        const ok = await processFile(tsFile);
        if (ok) processed++;
    }

    if (GLOBAL_STYLES.length) {
        const globalPath = path.join(OUT_DIR, 'global-styles.css');
        // 🔧 Crear el directorio recursivamente si no existe
        fs.mkdirSync(path.dirname(globalPath), { recursive: true });
        fs.writeFileSync(globalPath, GLOBAL_STYLES.join('\n'), 'utf8');
        console.log(`🌐 Estilos globales combinados → ${path.relative(process.cwd(), globalPath)}`);
    }

    console.log('');
    console.log(`✅ AOT completo: ${processed} componentes compilados.`);
    console.log(`📁 ${copied} archivos copiados sin cambios.`);
    console.log(`📦 Estructura replicada correctamente en: ${OUT_DIR}`);

    // -----------------------------------------------------
    // 📦 Copiar CSS y HTML generados a outDir configurado
    // -----------------------------------------------------

    let DIST_DIR;
    try {
        const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');
        const { config, error } = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
        if (error) throw error;
        const parsed = ts.parseJsonConfigFileContent(config, ts.sys, process.cwd());
        DIST_DIR = path.resolve(process.cwd(), parsed.options.outDir || 'dist');

        if (!fs.existsSync(DIST_DIR)) {
            fs.mkdirSync(DIST_DIR, { recursive: true });
        }

        const cssAndHtml = await glob(`${OUT_DIR}/**/*.{css,html}`, {
            dot: false,
            nodir: true,
        });

        for (const file of cssAndHtml) {
            const rel = path.relative(OUT_DIR, file);
            const dest = path.join(DIST_DIR, rel);
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.copyFileSync(file, dest);
        }

        console.log(`📤 Copiados ${cssAndHtml.length} archivos CSS/HTML → ${path.relative(process.cwd(), DIST_DIR)}`);
    } catch (e) {
        console.warn('⚠️  No se pudo leer tsconfig.json, usando ./dist por defecto.');
    }

}

main().catch(err => {
    console.error('❌ Error fatal en AOT:', err);
    process.exit(1);
});
