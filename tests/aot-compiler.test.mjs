import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import test from 'node:test';
import { transform } from 'esbuild';
import { JSDOM } from 'jsdom';

const compiler = fileURLToPath(new URL('../tools/aot-prebuild.js', import.meta.url));
const dom = new JSDOM('<!doctype html><body></body>', { url: 'http://localhost/' });
for (const key of ['window', 'document', 'Node', 'Element', 'DOMParser', 'DOMTokenList', 'NodeList', 'HTMLCollection'])
  globalThis[key] = dom.window[key];
globalThis.addEventListener = dom.window.addEventListener.bind(dom.window);
globalThis.removeEventListener = dom.window.removeEventListener.bind(dom.window);
const { default: GTPL } = await import('@mpeliz/gtpl');
const template = `<section><h2>{{ title }}</h2><button onclick="{{ this.count++ }}">{{ count }}</button>
  <strong>{{ return rows.length }}</strong><span>{{ return rows[1] ? rows[1].name : 'empty' }}</span>
  <ul><li g-for="rows;index;row">{{ row.name }}</li></ul></section>`;

function fixture(t, options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gtplweb-aot-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'src'));
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ type: 'module', gtplweb: options }));
  fs.writeFileSync(path.join(root, 'src/fixture.html'), template);
  fs.writeFileSync(path.join(root, 'src/Fixture.ts'), `import { Component } from '@mpeliz/gtplweb';
    @Component({ tag: 'inline-fixture', template: ${JSON.stringify(template)} })
    export class InlineFixture {}
    @Component({ tag: 'external-fixture', template: './fixture.html' })
    export class ExternalFixture {}
  `);
  const run = (...args) => spawnSync(process.execPath, [compiler, '--no-static-copy', ...args], {
    cwd: root, encoding: 'utf8', timeout: 30_000
  });
  return { root, run, output: path.join(root, 'src-aot/Fixture.ts') };
}

async function renderCompiled(source) {
  const { code } = await transform(source, { loader: 'ts', format: 'cjs',
    tsconfigRaw: { compilerOptions: { experimentalDecorators: true } } });
  const module = { exports: {} };
  const runtime = { ...GTPL, jit: new Proxy({}, { get() { throw Error('AOT must not invoke JIT'); } }) };
  const require = name => {
    if (name === '@mpeliz/gtpl') return { __esModule: true, default: runtime };
    if (name === '@mpeliz/gtplweb') return { Component: () => Controller => Controller };
    throw Error('Unexpected dependency: ' + name);
  };
  // Load the emitted module against the same GTPL instance as the renderer.
  vm.compileFunction(code, ['module', 'exports', 'require'])(module, module.exports, require);
  const results = [];
  for (const Controller of Object.values(module.exports)) {
    assert.equal(typeof Controller.__gtemplate__, 'function', Controller.name + ': generated AOT metadata');
    const container = document.createElement('div');
    document.body.append(container);
    const root = { title: 'Initial', count: 0, rows: [{ name: 'First' }] };
    const app = new GTPL.GTpl({ root, generator: Controller.__gtemplate__ });
    try {
      app.addTo(container);
      await app.ready();
      assert.equal(container.querySelector('h2').textContent, 'Initial');
      container.querySelector('button').click();
      root.title = 'Updated';
      root.rows = [{ name: 'Second' }, { name: 'Third' }];
      await new Promise(resolve => setTimeout(resolve, 0));
      assert.equal(root.count, 1);
      assert.equal(container.querySelector('button').textContent, '1');
      assert.deepEqual([...container.querySelectorAll('li')].map(row => row.textContent), ['Second', 'Third']);
      assert.equal(container.querySelector('h2').textContent, 'Updated');
      assert.equal(container.querySelector('strong').textContent, '2');
      assert.equal(container.querySelector('span').textContent, 'Third');
      root.rows.push({ name: 'Fourth' });
      await new Promise(resolve => setTimeout(resolve, 0));
      assert.equal(container.querySelector('strong').textContent, '3');
      assert.equal(container.querySelectorAll('li').length, 3);
      root.rows.length = 1;
      await new Promise(resolve => setTimeout(resolve, 0));
      assert.equal(container.querySelector('strong').textContent, '1');
      assert.equal(container.querySelector('span').textContent, 'empty');
      assert.equal(container.querySelectorAll('li').length, 1);
      results.push(container.innerHTML);
    } finally {
      app.destroy(); container.remove();
    }
  }
  assert.equal(results.length, 2, 'Inline and external templates are both compiled');
  return results;
}

test('CLI compiles equivalent reactive AOT with reference, optimized and method aliases', async t => {
  let reference;
  for (const [compiler, methodAliases] of [['reference', false], ['optimized', false], ['optimized', true]]) {
    const f = fixture(t, { compiler, methodAliases });
    const result = f.run();
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const source = fs.readFileSync(f.output, 'utf8');
    assert.equal(source.includes('g.getDocument()'), compiler === 'optimized');
    assert.equal(source.includes('$a="appendChild"'), methodAliases);
    assert.equal(source.includes('[$a]('), methodAliases);
    const rendered = await renderCompiled(source);
    if (compiler === 'reference') reference = rendered;
    else assert.deepEqual(rendered, reference);
  }
});

test('CLI flags override package config, including explicit false, and default stays reference', async t => {
  const f = fixture(t, { compiler: 'optimized', methodAliases: true });
  for (const [args, optimized, aliases] of [
    [['--method-aliases=false'], true, false],
    [['--compiler', 'reference', '--method-aliases', 'false'], false, false],
    [['--compiler=optimized', '--method-aliases=true'], true, true]
  ]) {
    const result = f.run(...args);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const source = fs.readFileSync(f.output, 'utf8');
    assert.equal(source.includes('g.getDocument()'), optimized);
    assert.equal(source.includes('$a="appendChild"'), aliases);
  }
  fs.writeFileSync(path.join(f.root, 'package.json'), '{}');
  const result = f.run();
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert(!fs.readFileSync(f.output, 'utf8').includes('g.getDocument()'));
});

test('invalid compiler options fail before deleting prepared output', t => {
  const f = fixture(t);
  const directory = path.dirname(f.output), sentinel = path.join(directory, 'keep.txt');
  fs.mkdirSync(directory); fs.writeFileSync(sentinel, 'prepared');
  for (const [options, args, message] of [
    [{ compiler: 'unknown' }, [], /compiler debe ser/],
    [{ methodAliases: 'true' }, [], /methodAliases debe ser booleano/],
    [{ methodAliases: true }, [], /methodAliases requiere/],
    [{}, ['--compiler'], /--compiler requiere/],
    [{}, ['--compiler='], /compiler debe ser/],
    [{}, ['--method-aliases'], /--method-aliases requiere/],
    [{}, ['--method-aliases=maybe'], /--method-aliases requiere/]
  ]) {
    fs.writeFileSync(path.join(f.root, 'package.json'), JSON.stringify({ gtplweb: options }));
    const result = f.run(...args);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, message);
    assert.equal(fs.readFileSync(sentinel, 'utf8'), 'prepared');
  }
});

test.after(() => dom.window.close());
