import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
for (const name of ['window', 'document', 'HTMLElement', 'customElements']) {
  globalThis[name] = name === 'window' ? dom.window : dom.window[name];
}
const { GEvents, GRouter } = await import('../dist/gtplweb.esm.js');
const settle = () => new Promise(resolve => setImmediate(resolve));

test('global wildcard subscriptions and once listeners unregister from their origin', async () => {
  const bus = new GEvents();
  let calls = 0;
  const sub = bus.subscribe('*', () => calls++);
  sub.off();
  await bus.emit('event', {});
  assert.equal(calls, 0);
  assert.equal(bus.listenerCount(), 0);
  bus.once('*', () => calls++);
  bus.once('*', () => calls++, { namespace: 'local' });
  await bus.emit('event', {}, 'local');
  await bus.emit('event', {}, 'local');
  assert.equal(calls, 2);
  assert.equal(bus.listenerCount(), 0);
  assert.deepEqual(bus.listNamespaces(), []);
});

test('once is consumed before concurrent or reentrant emission', async () => {
  const bus = new GEvents();
  let calls = 0;
  bus.once('event', () => { calls++; });
  await Promise.all([bus.emit('event', {}), bus.emit('event', {})]);
  assert.equal(calls, 1);
  bus.once('event', async () => { calls++; await bus.emit('event', {}); });
  await bus.emit('event', {});
  assert.equal(calls, 2);
});

test('waitForComplete observes the original handlers once and waits for wildcard handlers', async () => {
  const bus = new GEvents();
  const calls = [];
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  bus.on('event', async () => { calls.push('specific'); await gate; calls.push('done'); });
  bus.on('*', async () => { await gate; calls.push('wildcard'); });
  let completed = false;
  const completion = bus.waitForComplete('event', 1000).then(value => { completed = true; return value; });
  const emission = bus.emit('event', 42);
  await settle();
  assert.deepEqual(calls, ['specific']);
  assert.equal(completed, false);
  release();
  await emission;
  assert.equal(await completion, 42);
  assert.deepEqual(calls, ['specific', 'done', 'wildcard']);
  assert.equal(bus.listenerCount(), 2);
});

test('waitForComplete resolves even when there are no ordinary listeners', async () => {
  const bus = new GEvents();
  const complete = bus.waitForComplete('empty', 1000);
  await bus.emit('empty', 7);
  assert.equal(await complete, 7);
  assert.equal(bus.listenerCount(), 0);
});

test('a slow navigation cannot replace a newer route', async () => {
  window.history.replaceState({}, '', '/');
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const seen = [];
  const router = new GRouter([
    { id: 'slow', url: '/slow', middleware: () => gate },
    { id: 'fast', url: '/fast' },
  ], { mode: 'history' });
  try {
    router.start((_, match) => seen.push(match?.id));
    await settle();
    router.navigate('slow');
    await settle();
    router.navigate('fast');
    await settle();
    release(true);
    await settle();
    assert.equal(window.location.pathname, '/fast');
    assert.equal(router.getMatch()?.id, 'fast');
    assert.deepEqual(seen, [undefined, 'fast']);
  } finally { release(true); router.destroy(); }
});

test('destroy cancels pending route work and releases navigation payloads', async () => {
  window.history.replaceState({}, '', '/');
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const router = new GRouter([{ id: 'item', url: '/item/:id', middleware: () => gate }], { mode: 'history' });
  router.start(() => {});
  router.navigateWithData('item', { large: new Array(1000).fill('payload') }, { id: 1 });
  await settle();
  router.destroy();
  release(true);
  await settle();
  assert.equal(router.getMatch(), null);
  assert.equal(router.getDataForMatch({ fullPath: '/item/1' }), null);
});

test('navigation payloads expire when another route is accepted', async () => {
  window.history.replaceState({}, '', '/');
  const router = new GRouter([{ id: 'item', url: '/item/:id' }], { mode: 'history' });
  try {
    router.start(() => {});
    await settle();
    router.navigateWithData('item', { id: 1 }, { id: 1 });
    await settle();
    const previous = router.getMatch();
    assert.deepEqual(router.getDataForCurrent(), { id: 1 });
    router.navigateWithData('item', { id: 2 }, { id: 2 });
    await settle();
    assert.equal(router.getDataForMatch(previous), null);
    assert.deepEqual(router.getDataForCurrent(), { id: 2 });
  } finally { router.destroy(); }
});

test('optional route segments match URLs produced without their parameter', async () => {
  const router = new GRouter([{ id: 'user', url: '/users/:?id' }]);
  assert.equal(router.getUrlFromParams('user'), '/users');
  assert.deepEqual((await router.matchPath('/users'))?.params, {});
  assert.deepEqual((await router.matchPath('/users/42'))?.params, { id: '42' });
  const root = new GRouter([{ id: 'root', url: '/:?section/:?page' }]);
  assert.deepEqual((await root.matchPath('/'))?.params, {});
  assert.deepEqual((await root.matchPath('/news/2'))?.params, { section: 'news', page: '2' });
});

test('custom parameter regex captures do not lose or shift route parameters', async () => {
  const router = new GRouter([{
    id: 'value', url: '/number/:id/:label', regex: { id: '\\d+', label: '(ab|cd)' },
  }]);
  const match = await router.matchPath('/number/42/ab');
  assert.deepEqual(match?.params, { id: '42', label: 'ab' });
  assert.equal(match?.fullPath, '/number/42/ab');
  assert.equal(await router.matchPath('/number/invalid/ab'), null);
});

test('named wildcard URLs use the captured path in fullPath and URL building', async () => {
  const router = new GRouter([{ id: 'files', url: '/files/*rest' }]);
  const match = await router.matchPath('/files/foo/bar');
  assert.deepEqual(match?.params, { rest: 'foo/bar' });
  assert.equal(match?.fullPath, '/files/foo/bar');
  assert.equal(router.getUrlFromParams('files', { rest: 'foo/bar' }), '/files/foo/bar');
});

test('matchPath runs middleware once and never changes the active cached route', async () => {
  window.history.replaceState({}, '', '/item?x=one');
  let calls = 0, allow = true;
  const router = new GRouter([{ id: 'item', url: '/item', middleware: () => { calls++; return allow; } }], { mode: 'history' });
  try {
    await router.matchPath('/item');
    assert.equal(calls, 1);
    router.start(() => {});
    await settle();
    calls = 0;
    const active = router.getMatch();
    const preview = await router.matchPath('/item?x=two');
    assert.equal(calls, 1);
    assert.notEqual(preview, active);
    assert.deepEqual(active.query, { x: 'one' });
    assert.deepEqual(preview.query, { x: 'two' });
    assert.equal((await router.matchPath('/item')).query, undefined);
    allow = false;
    assert.equal(await router.matchPath('/item'), null);
    assert.equal(router.getMatch(), active);
  } finally { router.destroy(); }
});
