import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const root = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(import.meta.url);
const run = (script, cwd, ...args) => {
  const result = spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8', timeout: 30_000 });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return result;
};

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gtplweb-runtime-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'node_modules/@mpeliz'), { recursive: true });
  fs.symlinkSync(root, path.join(dir, 'node_modules/@mpeliz/gtplweb'), 'dir');
  fs.symlinkSync(path.dirname(require.resolve('@mpeliz/gtpl/package.json')), path.join(dir, 'node_modules/@mpeliz/gtpl'), 'dir');
  return dir;
}

test('runtime entry renders AOT, rejects missing generators and shares ESM/CJS APIs with the full entry', t => {
  const dir = fixture(t);
  for (const format of ['esm', 'cjs']) {
    const script = path.join(dir, `consumer.${format === 'esm' ? 'mjs' : 'cjs'}`);
    fs.writeFileSync(script, `
      ${format === 'esm' ? 'import { createRequire } from "node:module"; const require = createRequire(import.meta.url);' : ''}
      const assert = require('node:assert/strict');
      const { JSDOM } = require(${JSON.stringify(require.resolve('jsdom'))});
      const { window } = new JSDOM('<!doctype html><body></body>');
      for (const key of ['window','document','Node','Element','HTMLElement','customElements','DocumentFragment','Event','CustomEvent']) globalThis[key] = window[key];
      globalThis.DOMParser = class { constructor() { throw Error('JIT parser forbidden'); } };
      (async () => {
        const api = ${format === 'esm' ? 'await import' : 'require'}('@mpeliz/gtplweb/runtime');
        const GTPL = ${format === 'esm' ? "(await import('@mpeliz/gtpl/runtime')).default" : "require('@mpeliz/gtpl/runtime')"};
        assert.equal('jit' in GTPL, false);
        class Counter extends api.GTplComponentBase {
          count = 1;
          static __gtemplate__ = context => {
            const text = document.createTextNode('');
            context.addBind({ type: 0, ele: text, link: { vorc: { va: ['count'] } } });
            return [text];
          };
        }
        api.Component({ tag: 'runtime-counter', asWebComponent: false, template: '<unused>' })(Counter);
        const host = new Counter.__gcomponent__(); document.body.append(host);
        await api.getGTPL(host).ready();
        assert.equal(host.textContent, '1');
        const component = api.getCtrl(host);
        component.count = 2;
        await new Promise(resolve => setTimeout(resolve, 20));
        assert.equal(host.textContent, '2');
        class Missing extends api.GTplComponentBase {}
        api.Component({ tag: 'missing-aot', asWebComponent: false, template: '<p>JIT</p>' })(Missing);
        assert.throws(() => new Missing.__gcomponent__(), /requires an AOT template/);
        ${format === 'cjs' ? `for (const file of Object.keys(require.cache).filter(file => /(?:gtpl|gtplweb)[/\\\\]dist[/\\\\]/.test(file))) {
          assert.doesNotMatch(require('node:fs').readFileSync(file, 'utf8'), /DOMParser|new Function/);
        }` : ''}
        const full = ${format === 'esm' ? 'await import' : 'require'}('@mpeliz/gtplweb');
        assert.deepEqual(Object.keys(full).sort(), Object.keys(api).sort());
        for (const key of Object.keys(api)) assert.equal(full[key], api[key], key + ' must be shared');
        assert.equal(full.getCtrl(host), component);
        component.destroy(); window.close();
      })().catch(error => { console.error(error); process.exitCode = 1; });
    `);
    run(script, dir);
  }
  fs.writeFileSync(path.join(dir, 'consumer.mts'), `
    import * as full from '@mpeliz/gtplweb';
    import * as runtime from '@mpeliz/gtplweb/runtime';
    const component: typeof full.Component = runtime.Component;
    const controller: full.GTplComponentBase = {} as runtime.GTplComponentBase;
  `);
  run(require.resolve('typescript/bin/tsc'), dir, 'consumer.mts', '--noEmit', '--strict', '--skipLibCheck',
    '--target', 'ES2020', '--module', 'Node16', '--moduleResolution', 'Node16');
});

test('runtime-only app builds exclude JIT in all modes, preserve assets and allow opting back into JIT', async t => {
  const dir = fixture(t);
  fs.mkdirSync(path.join(dir, 'src/i18n'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({ compilerOptions: {
    target: 'ES2020', module: 'ESNext', experimentalDecorators: true, useDefineForClassFields: false
  } }));
  fs.writeFileSync(path.join(dir, 'src/i18n/es.json'), '{"title":"Prueba"}');
  fs.writeFileSync(path.join(dir, 'src/App.css'), 'button { color: red }');
  fs.writeFileSync(path.join(dir, 'src/App.ts'), `
    import { Component, GTplComponentBase } from '@mpeliz/gtplweb';
    @Component({ tag: 'aot-counter', asWebComponent: false, style: './App.css', styleMode: 'file',
      template: '<button onclick="{{ this.count++ }}">{{ count }}</button><p g-if="count">{{ count }}</p>' })
    export class App extends GTplComponentBase { count = 0; }
  `);
  fs.writeFileSync(path.join(dir, 'src/main.ts'), `
    import { App } from './App';
    import GTPL from '@mpeliz/gtpl';
    import runtime from '@mpeliz/gtpl/runtime';
    import * as api from '@mpeliz/gtplweb';
    import * as runtimeApi from '@mpeliz/gtplweb/runtime';
    globalThis.fixture = { api, runtimeApi, GTPL, runtime, host: new App.__gcomponent__() };
    document.body.append(globalThis.fixture.host);
    globalThis.loadLazy = () => import('./lazy');
  `);
  fs.writeFileSync(path.join(dir, 'src/lazy.ts'), `export { GBus } from '@mpeliz/gtplweb';`);
  for (const mode of ['dev', 'bundle', 'bundle-split']) {
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ type: 'module', gtplweb: { runtimeOnly: mode !== 'dev' } }));
    run(path.join(root, 'tools/aot-prebuild.js'), dir, '--no-static-copy');
    assert.match(fs.readFileSync(path.join(dir, 'src-aot/App.ts'), 'utf8'), /from '@mpeliz\/gtpl\/runtime'/);
    const result = run(path.join(root, 'tools/app-build.js'), dir, '--mode', mode, '--verify-dedupe', ...(mode === 'dev' ? ['--runtime-only'] : []));
    assert.match(result.stdout, /runtime-only/);
    const output = path.join(dir, 'www/dist');
    const jsFiles = fs.readdirSync(output, { recursive: true }).filter(file => file.endsWith('.js'));
    assert(jsFiles.length >= (mode === 'bundle-split' ? 2 : 1));
    for (const file of jsFiles) assert.doesNotMatch(fs.readFileSync(path.join(output, file), 'utf8'), /DOMParser|new Function/);
    assert.equal(fs.readFileSync(path.join(output, 'App.css'), 'utf8'), 'button { color: red }');
    assert.equal(fs.readFileSync(path.join(output, 'i18n/es.json'), 'utf8'), '{"title":"Prueba"}');
    assert.equal(fs.existsSync(path.join(output, 'main.js.map')), mode === 'dev');
    if (mode !== 'bundle-split') {
      const dom = new JSDOM('<!doctype html><body></body>', { url: 'http://localhost/', runScripts: 'outside-only' });
      try {
        dom.window.DOMParser = dom.window.Function = class { constructor() { throw Error('JIT forbidden'); } };
        dom.window.eval(fs.readFileSync(path.join(output, 'main.js'), 'utf8'));
        const { api, runtimeApi, GTPL, runtime, host } = dom.window.fixture;
        assert.equal('jit' in GTPL, false);
        assert.equal(GTPL, runtime);
        assert.equal(api.Component, runtimeApi.Component);
        await api.getGTPL(host).ready();
        assert.equal(host.getElementsByTagName('button')[0].textContent, '0');
        host.getElementsByTagName('button')[0].click();
        await new Promise(resolve => setTimeout(resolve, 20));
        assert.equal(host.getElementsByTagName('button')[0].textContent, '1');
        assert.equal(host.getElementsByTagName('p')[0].textContent, '1');
        api.getCtrl(host).destroy();
      } finally { dom.window.close(); }
    }
  }
  run(path.join(root, 'tools/app-build.js'), dir, '--mode', 'bundle', '--no-runtime-only', '--verify-dedupe');
  assert.match(fs.readFileSync(path.join(dir, 'www/dist/main.js'), 'utf8'), /DOMParser/);
});
