import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { transform } from 'esbuild';

const root = fileURLToPath(new URL('..', import.meta.url));
const run = (tool, cwd, ...args) => spawnSync(process.execPath, [path.join(root, 'tools', tool), ...args], {
  cwd, encoding: 'utf8', timeout: 30_000
});

function fixture(t, source, config = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gtplweb-tooling-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'src'));
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ type: 'module', gtplweb: config }));
  fs.writeFileSync(path.join(dir, 'src/App.ts'), source);
  return dir;
}

test('AOT accepts template literals, generic classes and an existing double-quoted GTPL import', async t => {
  const dir = fixture(t, `import GTPL from "@mpeliz/gtpl";
import { Component } from '@mpeliz/gtplweb';
@Component({ tag: 'test-app', template: \`<p>Hello</p>\` })
export class App<T> { value?: T }
`);
  const result = run('aot-prebuild.js', dir, '--no-static-copy');
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const source = fs.readFileSync(path.join(dir, 'src-aot/App.ts'), 'utf8');
  assert.match(source, /__gtemplate__/);
  await transform(source, { loader: 'ts', tsconfigRaw: { compilerOptions: { experimentalDecorators: true } } });
});

test('AOT file styles use the configured public output URL', t => {
  const dir = fixture(t, `import { Component } from '@mpeliz/gtplweb';
@Component({ tag: 'test-app', template: '<p>Hello</p>', style: './App.css', styleMode: 'file' })
export class App {}`, { publicOutDir: '/assets/ui' });
  fs.writeFileSync(path.join(dir, 'src/App.css'), 'p { color: red }');
  const result = run('aot-prebuild.js', dir, '--no-static-copy');
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const source = fs.readFileSync(path.join(dir, 'src-aot/App.ts'), 'utf8');
  assert.match(source, /["']\/assets\/ui\/App\.css["']/);
  assert.equal(fs.readFileSync(path.join(dir, 'src-aot/App.css'), 'utf8'), 'p { color: red }');
});

test('AOT rejects missing templates and invalid Sass instead of reporting a successful build', t => {
  const dir = fixture(t, `import { Component } from '@mpeliz/gtplweb';
@Component({ tag: 'test-app', template: './missing.html' }) export class App {}`);
  let result = run('aot-prebuild.js', dir, '--no-static-copy');
  assert.notEqual(result.status, 0, 'missing template must fail the build');
  fs.writeFileSync(path.join(dir, 'src/App.ts'), `import { Component } from '@mpeliz/gtplweb';
@Component({ tag: 'test-app', template: '<p>Hello</p>', style: './App.scss' }) export class App {}`);
  fs.writeFileSync(path.join(dir, 'src/App.scss'), 'p { color: $undefined; }');
  result = run('aot-prebuild.js', dir, '--no-static-copy');
  assert.notEqual(result.status, 0, 'invalid Sass must fail the build');
  fs.unlinkSync(path.join(dir, 'src/App.scss'));
  result = run('aot-prebuild.js', dir, '--no-static-copy');
  assert.notEqual(result.status, 0, 'missing stylesheet must fail the build');
});

test('AOT refuses output directories that would erase its sources', t => {
  const dir = fixture(t, 'export const keep = true;');
  const result = run('aot-prebuild.js', dir, '--aot-dir', 'src', '--no-static-copy');
  assert.notEqual(result.status, 0);
  assert.equal(fs.readFileSync(path.join(dir, 'src/App.ts'), 'utf8'), 'export const keep = true;');
});

test('app build refuses to clean the AOT input directory', t => {
  const dir = fixture(t, 'export const keep = true;');
  fs.mkdirSync(path.join(dir, 'src-aot'));
  fs.writeFileSync(path.join(dir, 'src-aot/main.ts'), 'console.log("keep");');
  const result = run('app-build.js', dir, '--out-dir', 'src-aot');
  assert.notEqual(result.status, 0);
  assert.equal(fs.readFileSync(path.join(dir, 'src-aot/main.ts'), 'utf8'), 'console.log("keep");');
});

test('build output guards resolve intermediate symlinks before deleting anything', t => {
  const dir = fixture(t, 'export const keep = true;');
  fs.symlinkSync(dir, path.join(dir, 'alias'), 'dir');
  let result = run('aot-prebuild.js', dir, '--aot-dir', 'alias/src', '--no-static-copy');
  assert.notEqual(result.status, 0);
  assert.equal(fs.readFileSync(path.join(dir, 'src/App.ts'), 'utf8'), 'export const keep = true;');
  fs.mkdirSync(path.join(dir, 'src-aot'));
  fs.writeFileSync(path.join(dir, 'src-aot/main.ts'), '// keep AOT');
  result = run('app-build.js', dir, '--out-dir', 'alias/src-aot');
  assert.notEqual(result.status, 0);
  assert.equal(fs.readFileSync(path.join(dir, 'src-aot/main.ts'), 'utf8'), '// keep AOT');
});

test('AOT contains inline and shared styles within a nested output directory', t => {
  const dir = fixture(t, `import { Component } from '@mpeliz/gtplweb';
@Component({ tag: 'test-app', template: '../shared.html', style: ['../shared.scss', 'p { color: blue }'], styleMode: 'file' })
export class App {}`, { aotDir: 'build/aot', publicOutDir: '/assets' });
  fs.writeFileSync(path.join(dir, 'shared.html'), '<p>Hello</p>');
  fs.writeFileSync(path.join(dir, 'shared.scss'), 'p { color: red }');
  fs.writeFileSync(path.join(dir, 'shared.css'), 'KEEP ORIGINAL');
  const result = run('aot-prebuild.js', dir, '--no-static-copy');
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(fs.readFileSync(path.join(dir, 'shared.css'), 'utf8'), 'KEEP ORIGINAL');
  assert.equal(fs.readFileSync(path.join(dir, 'shared.html'), 'utf8'), '<p>Hello</p>');
  assert.equal(fs.existsSync(path.join(dir, 'build/build')), false);
  assert.match(fs.readFileSync(path.join(dir, 'build/aot/app-app-inline.css'), 'utf8'), /color: blue/);
  const source = fs.readFileSync(path.join(dir, 'build/aot/App.ts'), 'utf8');
  assert.match(source, /\/assets\/app-app-inline\.css/);
  assert.match(source, /\/assets\/__external__\/[a-f0-9]+\/shared\.css/);
  assert.equal(source.includes('/assets/../'), false);
});

test('runtime components emit external templates and compile their Sass assets', t => {
  const dir = fixture(t, `import { Component } from '@mpeliz/gtplweb';
@Component({ tag: 'test-app', aot: false, template: '../shared.html', style: '../shared.scss' })
export class App {}`, { publicOutDir: '/assets' });
  fs.writeFileSync(path.join(dir, 'shared.html'), '<p>Hello</p>');
  fs.writeFileSync(path.join(dir, 'shared.scss'), '$color: red; p { color: $color }');
  const result = run('aot-prebuild.js', dir, '--no-static-copy');
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const source = fs.readFileSync(path.join(dir, 'src-aot/App.ts'), 'utf8');
  const assets = [...source.matchAll(/\/assets\/([^'"\s]+)/g)].map(match => match[1]);
  assert.equal(assets.length, 2);
  for (const asset of assets) assert.ok(fs.existsSync(path.join(dir, 'src-aot', asset)), `Missing runtime asset ${asset}`);
  assert.match(fs.readFileSync(path.join(dir, 'src-aot', assets.find(asset => asset.endsWith('.css'))), 'utf8'), /color: red/);
});

test('starter preserves quoted metadata as JSON and escapes the display name in HTML', t => {
  const dir = fixture(t, '');
  const target = path.join(dir, 'app');
  const name = 'My "app" & <demo>';
  const description = 'First line\nSecond "line" \\ end';
  const result = run('init-app.js', dir, target, '--yes', '--name', name, '--description', description);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const pkg = JSON.parse(fs.readFileSync(path.join(target, 'package.json'), 'utf8'));
  assert.equal(pkg.description, description);
  const html = fs.readFileSync(path.join(target, 'src/App.html'), 'utf8');
  assert.match(html, /My &quot;app&quot; &amp; &lt;demo&gt;/);
});

test('starter checks every collision before creating any files', t => {
  const dir = fixture(t, '');
  const target = path.join(dir, 'app');
  fs.mkdirSync(path.join(target, 'src'), { recursive: true });
  fs.writeFileSync(path.join(target, 'src/App.ts'), '// existing application');
  const result = run('init-app.js', dir, target, '--yes');
  assert.notEqual(result.status, 0);
  assert.deepEqual(fs.readdirSync(target), ['src']);
  assert.deepEqual(fs.readdirSync(path.join(target, 'src')), ['App.ts']);
  assert.equal(fs.readFileSync(path.join(target, 'src/App.ts'), 'utf8'), '// existing application');
});

test('the require export loads as CommonJS and exposes the public API', t => {
  const dir = fixture(t, '');
  const jsdomPath = fileURLToPath(import.meta.resolve('jsdom'));
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const script = path.join(dir, 'consumer.cjs');
  fs.writeFileSync(script, `
const { JSDOM } = require(${JSON.stringify(jsdomPath)});
const { window } = new JSDOM('<!doctype html><body></body>', { url: 'http://localhost/' });
for (const key of ['window','document','Node','Element','HTMLElement','customElements','DocumentFragment','Event','CustomEvent','DOMParser','XMLSerializer']) globalThis[key] = window[key];
try {
  const api = require(${JSON.stringify(path.resolve(root, pkg.exports['.'].require))});
  require('node:assert/strict').equal(typeof api.Component, 'function');
  require('node:assert/strict').equal(typeof api.GBus.subscribe, 'function');
} finally { window.close(); }
`);
  const result = spawnSync(process.execPath, [script], { encoding: 'utf8', timeout: 10_000 });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
