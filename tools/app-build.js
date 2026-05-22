#!/usr/bin/env node

import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { globSync } from 'glob';

const rootDir = process.cwd();
const require = createRequire(import.meta.url);
const packageRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || 'structured';
const config = readConfig();
const outDir = path.resolve(rootDir, args.outDir || config.outDir || 'www/dist');
const srcAotDir = path.resolve(rootDir, args.srcAotDir || args.aotDir || config.aotDir || config.srcAotDir || 'src-aot');
const srcDir = path.resolve(rootDir, args.srcDir || config.srcDir || 'src');
const entry = path.resolve(rootDir, args.entry || config.entry || path.join(path.relative(rootDir, srcAotDir), 'main.ts'));
const vendorFile = args.vendorFile || config.vendorFile || 'vendor.js';
const vendorPath = path.join(outDir, vendorFile);
const importMapPath = path.join(outDir, 'importmap.json');
const tempVendorEntry = path.join(rootDir, '.gtplweb-vendor-entry.js');
const publicOutDir = args.publicOutDir || config.publicOutDir || `./${path.basename(outDir)}`;
const importPrefix = publicOutDir.endsWith('/') ? publicOutDir : `${publicOutDir}/`;
const clean = args.clean ?? config.clean ?? true;
const i18nDir = args.i18nDir === false
  ? null
  : path.resolve(rootDir, args.i18nDir || config.i18nDir || path.join(path.relative(rootDir, srcDir), 'i18n'));

const defaultExclude = [
  '@mpeliz/gtpl',
  '@mpeliz/gtplweb',
  '@capacitor/cli',
  '@capacitor/android',
  '@capacitor/ios',
  '@capacitor/windows'
];
const exclude = new Set([...(config.excludeVendorDependencies || []), ...defaultExclude]);
const vendorExtraSpecifiers = {
  OrbitControls: { spec: 'three/addons/controls/OrbitControls.js', kind: 'named', whenDependency: 'three' },
  earcut: { spec: 'earcut', kind: 'default', whenDependency: 'earcut' },
  Delaunator: { spec: 'delaunator', kind: 'default', whenDependency: 'delaunator' },
  ...(config.vendorExtraSpecifiers || {})
};

await main();

async function main() {
  validateMode(mode);
  ensureAotInput();
  cleanOutDir();

  const deps = getWebDependencies();
  const importMap = { imports: {} };

  await buildVendor(deps, importMap);
  copyFrameworkDist('@mpeliz/gtpl', 'dist/gtpl.esm.js', 'gtpl.esm.js', importMap, true);
  copyFrameworkDist('@mpeliz/gtplweb', 'dist/gtplweb.esm.js', 'gtplweb.esm.js', importMap, true);
  copyPackageFile('tslib', 'tslib.es6.js', 'tslib.es6.js', importMap, true);
  fs.writeFileSync(importMapPath, JSON.stringify(importMap, null, 2), 'utf8');
  console.log(`Import map -> ${path.relative(rootDir, importMapPath)}`);

  await buildApp(deps);
  copyStaticFiles();
  copyI18nFiles();

  console.log(`GTPL app build ${mode} OK -> ${path.relative(rootDir, outDir)}`);
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--mode') parsed.mode = argv[++i];
    else if (arg.startsWith('--mode=')) parsed.mode = arg.slice('--mode='.length);
    else if (arg === '--out-dir') parsed.outDir = argv[++i];
    else if (arg.startsWith('--out-dir=')) parsed.outDir = arg.slice('--out-dir='.length);
    else if (arg === '--public-out-dir') parsed.publicOutDir = argv[++i];
    else if (arg.startsWith('--public-out-dir=')) parsed.publicOutDir = arg.slice('--public-out-dir='.length);
    else if (arg === '--entry') parsed.entry = argv[++i];
    else if (arg.startsWith('--entry=')) parsed.entry = arg.slice('--entry='.length);
    else if (arg === '--src-dir') parsed.srcDir = argv[++i];
    else if (arg.startsWith('--src-dir=')) parsed.srcDir = arg.slice('--src-dir='.length);
    else if (arg === '--aot-dir' || arg === '--src-aot-dir') parsed.srcAotDir = argv[++i];
    else if (arg.startsWith('--aot-dir=')) parsed.aotDir = arg.slice('--aot-dir='.length);
    else if (arg.startsWith('--src-aot-dir=')) parsed.srcAotDir = arg.slice('--src-aot-dir='.length);
    else if (arg === '--vendor-file') parsed.vendorFile = argv[++i];
    else if (arg.startsWith('--vendor-file=')) parsed.vendorFile = arg.slice('--vendor-file='.length);
    else if (arg === '--i18n-dir') parsed.i18nDir = argv[++i];
    else if (arg.startsWith('--i18n-dir=')) parsed.i18nDir = arg.slice('--i18n-dir='.length);
    else if (arg === '--no-i18n') parsed.i18nDir = false;
    else if (arg === '--no-clean') parsed.clean = false;
  }
  return parsed;
}

function validateMode(value) {
  if (value === 'structured' || value === 'bundle' || value === 'bundle-split') return;
  throw new Error(`Invalid mode "${value}". Use --mode structured, --mode bundle or --mode bundle-split.`);
}

function readConfig() {
  const pkgPath = path.join(rootDir, 'package.json');
  if (!fs.existsSync(pkgPath)) return {};
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return pkg.gtplweb || {};
}

function ensureAotInput() {
  if (!fs.existsSync(srcAotDir)) {
    throw new Error(`Missing ${path.relative(rootDir, srcAotDir)}. Run: npx gtpl-aot`);
  }
  if (!fs.existsSync(entry)) {
    throw new Error(`Missing app entry ${path.relative(rootDir, entry)}.`);
  }
}

function cleanOutDir() {
  if (!clean) {
    fs.mkdirSync(outDir, { recursive: true });
    return;
  }
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
}

function getWebDependencies() {
  const pkgPath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const deps = Object.keys(pkg.dependencies || {}).filter(dep => !exclude.has(dep));
  console.log(`Vendor deps: ${deps.length ? deps.join(', ') : '(none)'}`);
  return deps;
}

async function buildVendor(deps, importMap) {
  if (!deps.length) return;

  const depsSet = new Set(deps);
  const extraExports = Object.entries(vendorExtraSpecifiers)
    .filter(([, extra]) => shouldIncludeExtra(extra, depsSet))
    .map(([name, { spec, kind }]) =>
      kind === 'default'
        ? `export { default as ${name} } from '${spec}';`
        : `export { ${name} } from '${spec}';`
    );

  fs.writeFileSync(
    tempVendorEntry,
    [...deps.map(dep => `export * from '${dep}';`), ...extraExports].join('\n'),
    'utf8'
  );

  await build({
    entryPoints: [tempVendorEntry],
    bundle: true,
    format: 'esm',
    outfile: vendorPath,
    platform: 'browser',
    minify: mode !== 'structured',
    sourcemap: mode === 'structured',
    logLevel: 'info',
    external: ['@mpeliz/gtpl', '@mpeliz/gtplweb']
  });

  fs.rmSync(tempVendorEntry, { force: true });

  for (const dep of deps) importMap.imports[dep] = `${importPrefix}${vendorFile}`;
  for (const extra of Object.values(vendorExtraSpecifiers)) {
    if (shouldIncludeExtra(extra, depsSet)) {
      importMap.imports[extra.spec] = `${importPrefix}${vendorFile}`;
    }
  }
}

function shouldIncludeExtra(extra, depsSet) {
  if (extra.whenDependency) return depsSet.has(extra.whenDependency);
  if (depsSet.has(extra.spec)) return extra.kind === 'default';
  return true;
}

function copyFrameworkDist(pkgName, relDist, fileName, importMap, required = false) {
  try {
    const pkgPath = require.resolve(`${pkgName}/package.json`, { paths: [rootDir, packageRoot] });
    const pkgDir = path.dirname(pkgPath);
    const source = path.join(pkgDir, relDist);
    const dest = path.join(outDir, fileName);
    fs.copyFileSync(source, dest);
    if (fs.existsSync(`${source}.map`)) fs.copyFileSync(`${source}.map`, `${dest}.map`);
    importMap.imports[pkgName] = `${importPrefix}${fileName}`;
    importMap.imports[`${pkgName}/`] = `${importPrefix}${fileName}/`;
    console.log(`${pkgName} -> ${path.relative(rootDir, dest)}`);
  } catch (error) {
    if (required) throw new Error(`Cannot copy ${pkgName}: ${error.message}`);
    console.warn(`Cannot copy ${pkgName}: ${error.message}`);
  }
}

function copyPackageFile(pkgName, relFile, fileName, importMap, required = false) {
  try {
    const pkgPath = require.resolve(`${pkgName}/package.json`, { paths: [rootDir, packageRoot] });
    const pkgDir = path.dirname(pkgPath);
    const source = path.join(pkgDir, relFile);
    const dest = path.join(outDir, fileName);
    fs.copyFileSync(source, dest);
    importMap.imports[pkgName] = `${importPrefix}${fileName}`;
    console.log(`${pkgName} -> ${path.relative(rootDir, dest)}`);
  } catch (error) {
    if (required) throw new Error(`Cannot copy ${pkgName}: ${error.message}`);
    console.warn(`Cannot copy ${pkgName}: ${error.message}`);
  }
}

async function buildApp(deps) {
  if (mode === 'bundle') {
    await build({
      entryPoints: [entry],
      outfile: path.join(outDir, 'main.js'),
      format: 'esm',
      bundle: true,
      minify: true,
      sourcemap: false,
      platform: 'browser',
      target: 'es2020',
      logLevel: 'info',
      external: ['@mpeliz/gtpl', '@mpeliz/gtplweb', ...deps]
    });
    return;
  }

  if (mode === 'bundle-split') {
    await build({
      entryPoints: [entry],
      outdir: outDir,
      format: 'esm',
      bundle: true,
      splitting: true,
      chunkNames: 'chunks/[name]-[hash]',
      minify: true,
      sourcemap: false,
      platform: 'browser',
      target: 'es2020',
      logLevel: 'info',
      external: ['@mpeliz/gtpl', '@mpeliz/gtplweb', ...deps]
    });
    return;
  }

  await build({
    entryPoints: globSync(path.join(srcAotDir, '**/*.ts')),
    outdir: outDir,
    format: 'esm',
    bundle: false,
    platform: 'browser',
    sourcemap: true,
    target: 'es2020',
    logLevel: 'info'
  });
}

function copyStaticFiles() {
  for (const file of globSync(path.join(srcAotDir, '**/*.{html,css}'))) {
    const relPath = path.relative(srcAotDir, file);
    const destPath = path.join(outDir, relPath);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(file, destPath);
  }
}

function copyI18nFiles() {
  if (!i18nDir) return;
  if (!fs.existsSync(i18nDir)) return;

  for (const file of globSync(path.join(i18nDir, '**/*.json'))) {
    const relPath = path.relative(i18nDir, file);
    const destPath = path.join(outDir, 'i18n', relPath);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(file, destPath);
  }
}
