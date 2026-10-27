import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM, VirtualConsole } from 'jsdom';

const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8');
const bundle = await readFile(new URL('../docs/gtplweb-docs.js', import.meta.url), 'utf8');
const wait = () => new Promise(resolve => setTimeout(resolve, 30));

async function playground() {
    const errors = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('jsdomError', error => errors.push(error.message));
    virtualConsole.on('error', (...args) => errors.push(args.map(String).join(' ')));
    const dom = new JSDOM(html, {
        url: 'https://example.test/GTPLWeb/',
        runScripts: 'outside-only',
        pretendToBeVisual: true,
        virtualConsole
    });
    dom.window.eval(bundle);
    await wait();
    assert.equal(dom.window.document.documentElement.dataset.playground, 'ready');
    assert.deepEqual(errors, []);
    return { dom, document: dom.window.document, errors };
}

function click(host, text) {
    const button = [...host.querySelectorAll('button')].find(node => node.textContent.trim() === text);
    assert.ok(button, `Missing button: ${text}`);
    button.click();
}

function input(dom, node, value) {
    node.value = value;
    node.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
}

test('documentation mounts eight real component examples with local source panels', async () => {
    const { dom, document, errors } = await playground();
    assert.equal(document.querySelectorAll('.demo').length, 8);
    assert.equal(document.querySelectorAll('#example-links a').length, 8);
    assert.equal(document.querySelectorAll('.source').length, 8);
    const controllerSnippets = [...document.querySelectorAll('.source pre code')]
        .map(code => code.textContent).filter(code => code.startsWith('const '));
    assert.ok(controllerSnippets.length >= 8);
    for (const code of controllerSnippets) assert.doesNotThrow(() => new Function(code), 'Controller source must be valid copyable JavaScript');
    assert.ok(document.querySelector('#components docs-counter-card button'));
    assert.ok(document.querySelector('#inputs docs-profile-card [data-profile-name]'));
    assert.ok(document.querySelector('#shadow docs-shadow-card').shadowRoot.querySelector('button'));
    assert.deepEqual(errors, []);
    dom.window.close();
});

test('counter and nested g-set inputs stay reactive across parent and child', async () => {
    const { dom, document, errors } = await playground();
    const counter = document.querySelector('docs-counter-card');
    click(counter, 'Increment');
    await wait();
    assert.equal(counter.querySelector('.metric').textContent, '1');
    input(dom, counter.querySelector('input'), 'Renamed card');
    await wait();
    assert.equal(counter.querySelector('h3').textContent, 'Renamed card');
    click(counter, 'Reset');
    await wait();
    assert.equal(counter.querySelector('.metric').textContent, '0');

    const parent = document.querySelector('docs-parent-profile');
    const child = parent.querySelector('docs-profile-card');
    assert.equal(child.querySelector('[data-profile-name]').textContent, 'Ada Lovelace');
    input(dom, parent.querySelector('input'), 'Margaret Hamilton');
    await wait();
    assert.equal(child.querySelector('[data-profile-name]').textContent, 'Margaret Hamilton');
    click(parent, 'Change person');
    await wait();
    assert.equal(child.querySelector('[data-profile-name]').textContent, 'Ada Lovelace');
    assert.match(child.textContent, /Template engineer/);
    assert.deepEqual(errors, []);
    dom.window.close();
});

test('dynamic component replacement destroys old state and renders nested list', async () => {
    const { dom, document, errors } = await playground();
    const host = document.querySelector('docs-dynamic-dashboard');
    click(host, 'Warm up');
    await wait();
    assert.match(host.textContent, /22/);
    click(host, 'Tasks');
    await wait();
    assert.equal(host.querySelector('docs-weather-widget'), null);
    assert.equal(host.querySelectorAll('docs-tasks-widget li').length, 2);
    click(host, 'Add task');
    await wait();
    assert.equal(host.querySelectorAll('docs-tasks-widget li').length, 3);
    click(host, 'Clear');
    await wait();
    assert.equal(host.querySelector('docs-tasks-widget'), null);
    click(host, 'Weather');
    await wait();
    assert.equal(host.querySelector('docs-weather-widget strong').textContent, '21');
    assert.deepEqual(errors, []);
    dom.window.close();
});

test('g-class, namespaced bus and shadow counter use framework bindings', async () => {
    const { dom, document, errors } = await playground();
    const classes = document.querySelector('docs-class-badge');
    click(classes, 'Toggle status');
    await wait();
    assert.ok(classes.querySelector('.status-paused'));
    const sender = document.querySelector('docs-bus-sender');
    input(dom, sender.querySelector('input'), 'Message from test');
    click(sender, 'Publish message');
    await wait();
    assert.equal(document.querySelector('[data-message-count]').textContent, '1');
    assert.match(document.querySelector('docs-bus-receiver li').textContent, /Message from test/);
    const shadow = document.querySelector('docs-shadow-card').shadowRoot;
    click(shadow, 'Shadow counter +1');
    await wait();
    assert.equal(shadow.querySelector('strong').textContent, '1');
    assert.ok(shadow.querySelector('style'));
    assert.equal(shadow.querySelector('slot').assignedNodes().length, 1);
    assert.deepEqual(errors, []);
    dom.window.close();
});

test('route resolver validates parameters without changing documentation anchors', async () => {
    const { dom, document, errors } = await playground();
    const host = document.querySelector('docs-route-explorer');
    click(host, 'Resolve route');
    await wait();
    assert.deepEqual(JSON.parse(host.querySelector('.route-result').textContent), { id: 'project', params: { id: '42' } });
    click(host, 'Guide');
    await wait();
    assert.deepEqual(JSON.parse(host.querySelector('.route-result').textContent), { id: 'guide', params: { topic: 'components' } });
    click(host, 'Invalid ID');
    await wait();
    assert.equal(host.querySelector('.route-result').textContent, 'No matching route');
    click(host, 'Build project URL');
    await wait();
    assert.equal(host.querySelector('output').textContent, '/projects/7');
    assert.equal(dom.window.location.hash, '');
    assert.deepEqual(errors, []);
    dom.window.close();
});

test('lifecycle example logs real destruction and can mount a fresh child', async () => {
    const { dom, document, errors } = await playground();
    const host = document.querySelector('docs-lifecycle-playground');
    click(host, 'Mount child');
    await wait();
    assert.ok(host.querySelector('docs-lifecycle-child'));
    const events = () => [...host.querySelectorAll('li')].map(li => li.textContent);
    for (const event of ['onConstruct', 'onInit', 'onConnect', 'onTemplateReady']) assert.ok(events().includes(event), event);
    click(host, 'Destroy child');
    await wait();
    assert.equal(host.querySelector('docs-lifecycle-child'), null);
    assert.ok(events().includes('onDestroy'));
    assert.ok(events().includes('onDisconnect'));
    click(host, 'Mount child');
    await wait();
    assert.ok(host.querySelector('docs-lifecycle-child'));
    assert.equal(events().filter(event => event === 'onConstruct').length, 2);
    click(host, 'Destroy child');
    await wait();
    assert.deepEqual(errors, []);
    dom.window.close();
});
