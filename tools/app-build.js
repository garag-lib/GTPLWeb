#!/usr/bin/env node

import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { createRequire } from 'module';
import { containsPath } from './build-paths.js';

const rootDir = process.cwd();
const requireFromRoot = createRequire(path.join(rootDir, 'package.json'));

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || 'dev';
const config = readConfig();
const runtimeOnly = args.runtimeOnly ?? config.runtimeOnly ?? false;
if (typeof runtimeOnly !== 'boolean') throw new Error('gtplweb.runtimeOnly must be a boolean.');
const gtplAliases = runtimeOnly ? resolveRuntimeAliases() : resolveGtplAliases();
const outDir = path.resolve(rootDir, args.outDir || config.outDir || 'www/dist');
const srcAotDir = path.resolve(rootDir, args.srcAotDir || args.aotDir || config.aotDir || config.srcAotDir || 'src-aot');
const srcDir = path.resolve(rootDir, args.srcDir || config.srcDir || 'src');
const entry = path.resolve(rootDir, args.entry || config.entry || path.join(path.relative(rootDir, srcAotDir), 'main.ts'));
const clean = args.clean ?? config.clean ?? true;
const i18nDir = args.i18nDir === false
  ? null
  : path.resolve(rootDir, args.i18nDir || config.i18nDir || path.join(path.relative(rootDir, srcDir), 'i18n'));

await main();

async function main() {
  validateMode(mode);
  ensureAotInput();
  cleanOutDir();
  await buildApp();
  copyStaticFiles();
  copyI18nFiles();

  console.log(`GTPL app build ${mode}${runtimeOnly ? ' (runtime-only)' : ''} OK -> ${path.relative(rootDir, outDir)}`);
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--mode') parsed.mode = argv[++i];
    else if (arg.startsWith('--mode=')) parsed.mode = arg.slice('--mode='.length);
    else if (arg === '--out-dir') parsed.outDir = argv[++i];
    else if (arg.startsWith('--out-dir=')) parsed.outDir = arg.slice('--out-dir='.length);
    else if (arg === '--entry') parsed.entry = argv[++i];
    else if (arg.startsWith('--entry=')) parsed.entry = arg.slice('--entry='.length);
    else if (arg === '--src-dir') parsed.srcDir = argv[++i];
    else if (arg.startsWith('--src-dir=')) parsed.srcDir = arg.slice('--src-dir='.length);
    else if (arg === '--aot-dir' || arg === '--src-aot-dir') parsed.srcAotDir = argv[++i];
    else if (arg.startsWith('--aot-dir=')) parsed.aotDir = arg.slice('--aot-dir='.length);
    else if (arg.startsWith('--src-aot-dir=')) parsed.srcAotDir = arg.slice('--src-aot-dir='.length);
    else if (arg === '--i18n-dir') parsed.i18nDir = argv[++i];
    else if (arg.startsWith('--i18n-dir=')) parsed.i18nDir = arg.slice('--i18n-dir='.length);
    else if (arg === '--no-i18n') parsed.i18nDir = false;
    else if (arg === '--no-clean') parsed.clean = false;
    else if (arg === '--verify-dedupe') parsed.verifyDedupe = true;
    else if (arg === '--runtime-only') parsed.runtimeOnly = true;
    else if (arg === '--no-runtime-only') parsed.runtimeOnly = false;
  }
  return parsed;
}

function validateMode(value) {
  if (value === 'dev' || value === 'bundle' || value === 'bundle-split') return;
  throw new Error(`Invalid mode "${value}". Use --mode dev, --mode bundle or --mode bundle-split.`);
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
  if (containsPath(outDir, rootDir) || containsPath(outDir, srcDir) || containsPath(outDir, srcAotDir)
      || containsPath(srcAotDir, outDir) || containsPath(outDir, entry)
      || (i18nDir && containsPath(outDir, i18nDir))) {
    throw new Error('The output directory must not overlap application sources or AOT input.');
  }
  if (!clean) {
    fs.mkdirSync(outDir, { recursive: true });
    return;
  }
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
}

async function buildApp() {
  const commonBuildOptions = {
    platform: 'browser',
    target: 'es2020',
    logLevel: 'info',
    external: [],
    alias: gtplAliases
  };

  if (mode === 'bundle') {
    const result = await build({
      entryPoints: [entry],
      outfile: path.join(outDir, 'main.js'),
      format: 'esm',
      bundle: true,
      minify: true,
      sourcemap: false,
      metafile: !!args.verifyDedupe,
      ...commonBuildOptions
    });
    verifyGtplDedupe(result.metafile);
    return;
  }

  if (mode === 'dev') {
    const result = await build({
      entryPoints: [entry],
      outfile: path.join(outDir, 'main.js'),
      format: 'esm',
      bundle: true,
      minify: false,
      sourcemap: true,
      metafile: !!args.verifyDedupe,
      ...commonBuildOptions
    });
    verifyGtplDedupe(result.metafile);
    return;
  }

  if (mode === 'bundle-split') {
    const result = await build({
      entryPoints: [entry],
      outdir: outDir,
      format: 'esm',
      bundle: true,
      splitting: true,
      chunkNames: 'chunks/[name]-[hash]',
      minify: true,
      sourcemap: false,
      metafile: !!args.verifyDedupe,
      ...commonBuildOptions
    });
    verifyGtplDedupe(result.metafile);
    return;
  }
}

function resolveGtplAliases() {
  try {
    const gtplPkgPath = requireFromRoot.resolve('@mpeliz/gtpl/package.json');
    const pkg = JSON.parse(fs.readFileSync(gtplPkgPath, 'utf8'));
    return {
      '@mpeliz/gtpl': path.resolve(path.dirname(gtplPkgPath), pkg.exports['.'].import),
      '@mpeliz/gtpl/runtime': path.resolve(path.dirname(gtplPkgPath), pkg.exports['./runtime'].import)
    };
  } catch {
    return undefined;
  }
}

function resolveRuntimeAliases() {
  const aliases = {};
  for (const name of ['@mpeliz/gtpl', '@mpeliz/gtplweb']) {
    const pkgFile = requireFromRoot.resolve(`${name}/package.json`);
    const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
    const entry = pkg.exports?.['./runtime']?.import;
    if (!entry) throw new Error(`${name} does not provide a runtime entry. Update the dependency.`);
    aliases[name] = aliases[`${name}/runtime`] = path.resolve(path.dirname(pkgFile), entry);
  }
  return aliases;
}

function verifyGtplDedupe(metafile) {
  if (!args.verifyDedupe) return;
  if (!metafile?.inputs) {
    throw new Error('Dedupe verification failed: esbuild metafile not available.');
  }
  const gtplRoots = new Set(Object.keys(metafile.inputs).flatMap(input => {
    const match = /^(.*@mpeliz\/gtpl)\/dist\//.exec(input.replaceAll('\\', '/'));
    return match ? [match[1]] : [];
  }));
  if (gtplRoots.size > 1) {
    throw new Error(
      `Dedupe verification failed: @mpeliz/gtpl is bundled from multiple paths:\n${[...gtplRoots].join('\n')}`
    );
  }
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
