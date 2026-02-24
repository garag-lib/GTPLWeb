import GTPL from '@mpeliz/gtpl';
import { ComponentMeta, HostElement } from '../component.types';

// ---- 

/*
const __globalStyleIds = new Set<string>();
*/

/*
function hash(s: string): string {
    let h = 0;
    for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
    return Math.abs(h).toString(36);
}
*/

/*
function ensureGlobalStyle(cssText: string, keyHint: string) {
    const id = `gtpl-global-${hash(keyHint + '|' + cssText)}`;
    if (__globalStyleIds.has(id)) return;
    const style = document.createElement('style');
    style.setAttribute('data-gtpl', id);
    style.textContent = cssText;
    document.head.appendChild(style);
    __globalStyleIds.add(id);
}
*/

/*
function ensureGlobalLink(href: string) {
    const id = `gtpl-global-link-${hash(href)}`;
    if (document.head.querySelector(`link[data-gtpl="${id}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-gtpl', id);
    document.head.appendChild(link);
}
*/

// runtime-helpers.ts (arriba del archivo)
const SHEET_CACHE = new WeakMap<object, CSSStyleSheet>();

export function applyComponentStyles(cmp: HostElement, meta: ComponentMeta, mode?: ComponentMeta['styleMode']) {
    const styleMode = mode ?? meta.styleMode;
    // Solo ShadowRoot + API disponible + hay CSS inline
    const sr = (cmp.$host as ShadowRoot);
    const canAdopt = !!(sr && 'adoptedStyleSheets' in sr) && meta.stylesInline.length > 0;
    if (styleMode !== 'lazy' && canAdopt) {
        const key = (cmp.constructor as object);
        let sheet = SHEET_CACHE.get(key);
        if (!sheet) {
            sheet = new CSSStyleSheet();
            sheet.replaceSync(meta.stylesInline.join('\n'));
            SHEET_CACHE.set(key, sheet);
        }
        // añade si no está ya
        const current = [...sr.adoptedStyleSheets];
        if (!current.includes(sheet)) {
            sr.adoptedStyleSheets = [...current, sheet];
        }
    } else {
        // fallback actual
        switch (styleMode) {
            case 'inline':
            case 'file': {
                for (const css of meta.stylesInline) {
                    const style = document.createElement('style');
                    style.textContent = css;
                    (cmp.$host as Element | ShadowRoot).appendChild(style);
                }
                for (const href of meta.styleUrls) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = href;
                    (cmp.$host as Element | ShadowRoot).appendChild(link);
                }
                break;
            }
            case 'lazy': break;
            // ‘global’ si lo reactivas
        }
    }
}


export function applyLazyStyles(cmp: HostElement, meta: ComponentMeta) {
    applyComponentStyles(cmp, meta, 'file');
}

export async function ensureCompiledTemplate(classMeta: ComponentMeta): Promise<void> {
    if (classMeta.templateFactory) return;
    if (classMeta.compilePromise) { await classMeta.compilePromise; return; }
    classMeta.compilePromise = (async () => {
        try {
            const html = classMeta.templateHtml ?? (await (await fetch(classMeta.templateUrl!)).text());
            const compiled = (GTPL as any).jit.GCode(html);
            classMeta.templateFactory = (GTPL as any).jit.GCompile(compiled);
        } catch (err) {
            console.error('[GTPL compile error]', { url: classMeta.templateUrl, err });
            throw err;
        } finally {
            classMeta.compilePromise = null;
        }
    })();
    await classMeta.compilePromise;
}

export function instantiateTemplate(controller: any, generator: any) {
    const options: any = { root: controller, generator };
    const gtplobj = new (GTPL as any).GTpl(options);
    return gtplobj;
}
