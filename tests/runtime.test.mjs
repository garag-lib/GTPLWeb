import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.Node = dom.window.Node;
globalThis.Element = dom.window.Element;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.ShadowRoot = dom.window.ShadowRoot;
globalThis.customElements = dom.window.customElements;
globalThis.DocumentFragment = dom.window.DocumentFragment;
globalThis.Event = dom.window.Event;
globalThis.CustomEvent = dom.window.CustomEvent;
globalThis.DOMParser = dom.window.DOMParser;
globalThis.XMLSerializer = dom.window.XMLSerializer;
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator,
  configurable: true
});
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.requestAnimationFrame =
  dom.window.requestAnimationFrame?.bind(dom.window) ??
  ((cb) => setTimeout(() => cb(Date.now()), 16));
globalThis.cancelAnimationFrame =
  dom.window.cancelAnimationFrame?.bind(dom.window) ??
  ((id) => clearTimeout(id));

const { Animations, Component, GTplComponentBase, AppGTplComponent, GBus, getControllerFromComponent, GWatcher } = await import("../dist/gtplweb.esm.js");
const { default: GTPL } = await import("@mpeliz/gtpl");

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const uniqueTag = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

async function attachAotTemplate(ControllerClass, html) {
  const compiled = await GTPL.jit.GCodeOptimized(html, { methodAliases: true });
  const factory = GTPL.jit.GCompile(compiled);
  Object.defineProperty(ControllerClass, "__gtemplate__", {
    value: factory,
    configurable: true
  });
  Object.defineProperty(ControllerClass, "__stylesInline__", {
    value: Object.freeze([]),
    configurable: true
  });
  Object.defineProperty(ControllerClass, "__styleUrls__", {
    value: Object.freeze([]),
    configurable: true
  });
}

test("g-component mounts registered component on init", async () => {
  const childTag = uniqueTag("g-child");
  const parentTag = uniqueTag("g-parent");

  class Child extends GTplComponentBase {}
  await attachAotTemplate(Child, "<span data-child='ok'>child</span>");
  Component({
    tag: childTag,
    template: "<span data-child='ok'>child</span>"
  })(Child);

  class Parent extends GTplComponentBase {}
  await attachAotTemplate(Parent, `<div id='slot' g-component='${childTag}'></div>`);

  const ParentController = Component({
    tag: parentTag,
    asWebComponent: false,
    template: `<div id='slot' g-component='${childTag}'></div>`
  })(Parent);

  const host = document.createElement("div");
  document.body.appendChild(host);
  new ParentController.__gcomponent__(host);

  await wait(20);

  assert.ok(host.querySelector(childTag), "Expected mounted child component inside g-component host");
});

test("AOT web component with light DOM defers render until connected", async () => {
  const tag = uniqueTag("g-light-aot");

  class LightDomCtr extends GTplComponentBase {}
  await attachAotTemplate(LightDomCtr, "<section data-rendered='ok'>rendered</section>");

  Component({
    tag,
    shadow: false,
    template: "<section data-rendered='ok'>rendered</section>"
  })(LightDomCtr);

  let host;
  assert.doesNotThrow(() => {
    host = document.createElement(tag);
  }, "Expected custom element construction without light DOM children");

  assert.equal(host.querySelector("[data-rendered='ok']"), null, "Expected no render before connect");

  document.body.appendChild(host);
  await wait(20);

  assert.ok(host.querySelector("[data-rendered='ok']"), "Expected rendered content after connect");
});

test("g-class owns applied classes across replaced arrays and batched updates", async () => {
  const tag = uniqueTag('g-class-aot');
  class ClassState extends GTplComponentBase {
    classes = ['status', 'ready'];
  }
  await attachAotTemplate(ClassState, '<p g-class="{{ classes }}">Status</p>');
  Component({ tag, template: '<p g-class="{{ classes }}">Status</p>' })(ClassState);
  const host = document.createElement(tag);
  document.body.appendChild(host);
  try {
    await wait(20);
    const controller = getControllerFromComponent(host), paragraph = host.querySelector('p');
    assert.equal(paragraph.className, 'status ready');
    controller.classes = ['status', 'paused'];
    controller.classes = ['status', 'final'];
    await wait();
    assert.equal(paragraph.className, 'status final');
    controller.classes.push('extra');
    await wait();
    assert.equal(paragraph.className, 'status final extra');
    controller.classes = [];
    await wait();
    assert.equal(paragraph.getAttribute('class'), null);
    controller.classes = 'single';
    await wait();
    assert.equal(paragraph.className, 'single');
  } finally {
    host.remove();
  }
});

test("GWatcher calls onDisconnect for injected controller on detach", async () => {
  const calls = { connect: 0, disconnect: 0 };
  const ctrl = {
    onConnect() {
      calls.connect += 1;
    },
    onDisconnect() {
      calls.disconnect += 1;
    }
  };

  const watcher = new GWatcher(ctrl);
  document.body.appendChild(watcher);
  await wait(10);
  watcher.remove();
  await wait(10);

  assert.equal(calls.connect, 1, "Expected one connect callback");
  assert.equal(calls.disconnect, 1, "Expected one disconnect callback");
});

test("destroy() clears provided host HTML for non-web components", async () => {
  const tag = uniqueTag("g-destroy");

  class DestroyCtr extends GTplComponentBase {}
  await attachAotTemplate(DestroyCtr, "<section><strong>rendered</strong></section>");

  const CmpController = Component({
    tag,
    asWebComponent: false,
    template: "<section><strong>rendered</strong></section>"
  })(DestroyCtr);

  const host = document.createElement("div");
  document.body.appendChild(host);
  new CmpController.__gcomponent__(host);

  await wait(20);
  assert.notEqual(host.innerHTML, "", "Expected rendered content before destroy");

  const ctrl = getControllerFromComponent(host);
  ctrl.destroy();

  await wait(10);
  assert.equal(host.innerHTML, "", "Expected host HTML to be cleared after destroy");
});

test("Animations resolves immediately and keeps pointer events with reduced motion", async () => {
  const previousMatchMedia = window.matchMedia;
  window.matchMedia = () => ({ matches: true });
  const element = document.createElement("div");
  element.style.pointerEvents = "all";

  try {
    await Animations.slideFadeInY(element, "16px", 1000);
    assert.equal(element.style.opacity, "1");
    assert.equal(element.style.transform, "translateY(0)");
    assert.equal(element.style.pointerEvents, "all");
  } finally {
    window.matchMedia = previousMatchMedia;
  }
});

test("Animations restores original pointer events on transitionend", async () => {
  const element = document.createElement("div");
  element.style.pointerEvents = "all";
  const animation = Animations.fadeIn(element, 1000);
  await wait(40);
  element.dispatchEvent(new Event("transitionend"));
  await animation;

  assert.equal(element.style.pointerEvents, "all");
});

test("Animations resolves and unlocks on transitioncancel", async () => {
  const element = document.createElement("div");
  const animation = Animations.fadeIn(element, 1000);
  await wait(40);
  element.dispatchEvent(new Event("transitioncancel"));
  await animation;

  assert.equal(element.style.pointerEvents, "");
});

test("Animations timeout prevents permanent pointer lock", async () => {
  const element = document.createElement("div");
  await Animations.fadeIn(element, 1);

  assert.equal(element.style.pointerEvents, "");
});

test("Animations timeout also unlocks when animation frames never run", async () => {
  const previousRequestAnimationFrame = globalThis.requestAnimationFrame;
  globalThis.requestAnimationFrame = () => 0;
  const element = document.createElement("div");

  try {
    await Animations.fadeIn(element, 1);
    assert.equal(element.style.pointerEvents, "");
  } finally {
    globalThis.requestAnimationFrame = previousRequestAnimationFrame;
  }
});

test("Animations keeps pointer lock when an older overlapping transition ends", async () => {
  const element = document.createElement("div");
  element.style.pointerEvents = "all";
  const first = Animations.fadeIn(element, 1000);
  await wait(40);

  const second = Animations.fadeIn(element, 1000);
  element.dispatchEvent(new Event("transitioncancel"));
  await first;
  assert.equal(element.style.pointerEvents, "none");

  await wait(40);
  element.dispatchEvent(new Event("transitionend"));
  await second;
  assert.equal(element.style.pointerEvents, "all");
});

test('non-web component forwards connect/disconnect hooks to its controller', async () => {
  const calls = [];
  class Plain extends GTplComponentBase {
    onConnect() { calls.push('connect'); }
    onDisconnect() { calls.push('disconnect'); }
  }
  await attachAotTemplate(Plain, '<p>plain</p>');
  Component({ tag: uniqueTag('g-plain-hooks'), asWebComponent: false })(Plain);
  const host = new Plain.__gcomponent__();
  const controller = getControllerFromComponent(host);
  document.body.append(host);
  host.remove();
  assert.deepEqual(calls, ['connect', 'disconnect']);
  controller.destroy();
});

test('g-component can replace non-web components on its existing host', async () => {
  const firstTag = uniqueTag('g-first-plain'), secondTag = uniqueTag('g-second-plain');
  let destroyed = 0;
  class First extends GTplComponentBase { onDestroy() { destroyed++; } }
  class Second extends GTplComponentBase {}
  await attachAotTemplate(First, '<span>first</span>');
  await attachAotTemplate(Second, '<span>second</span>');
  Component({ tag: firstTag, asWebComponent: false })(First);
  Component({ tag: secondTag, asWebComponent: false })(Second);
  class Parent extends GTplComponentBase { selected = firstTag; }
  await attachAotTemplate(Parent, '<section g-component="{{selected}}"></section>');
  Component({ tag: uniqueTag('g-plain-switch') })(Parent);
  const host = new Parent.__gcomponent__();
  document.body.append(host);
  const controller = getControllerFromComponent(host);
  try {
    await wait();
    assert.equal(host.querySelector('span')?.textContent, 'first');
    controller.selected = secondTag;
    await wait();
    assert.equal(host.querySelector('span')?.textContent, 'second');
    assert.equal(destroyed, 1);
  } finally { controller.destroy(); }
});

test('destroy releases app route subscriptions and is idempotent', async () => {
  const baseline = GBus.listenerCount('router');
  let changes = 0;
  class App extends AppGTplComponent { onRouteChange() { changes++; } }
  await attachAotTemplate(App, '<p>app</p>');
  Component({ tag: uniqueTag('g-app-cleanup') })(App);
  for (let i = 0; i < 10; i++) {
    const host = new App.__gcomponent__();
    document.body.append(host);
    const controller = getControllerFromComponent(host);
    controller.destroy();
    controller.destroy();
    assert.equal(getControllerFromComponent(host), null);
  }
  assert.equal(GBus.listenerCount('router'), baseline);
  await GBus.emit('urlChanged', { state: 'new', current: null, prev: null }, 'router');
  assert.equal(changes, 0);
});

test('parent destruction runs nested component cleanup, including shadow roots', async () => {
  let destroyed = 0;
  class Child extends GTplComponentBase { onDestroy() { destroyed++; } }
  const childTag = uniqueTag('g-owned-child');
  await attachAotTemplate(Child, '<span>child</span>');
  Component({ tag: childTag })(Child);
  class Parent extends GTplComponentBase {}
  await attachAotTemplate(Parent, `<section><${childTag}></${childTag}></section>`);
  Component({ tag: uniqueTag('g-owned-parent'), shadow: true })(Parent);
  const host = new Parent.__gcomponent__();
  document.body.append(host);
  const controller = getControllerFromComponent(host);
  controller.destroy();
  controller.destroy();
  assert.equal(destroyed, 1);
});

test('throwing child cleanup does not prevent siblings or parent from being destroyed', async () => {
  let siblingDestroyed = 0;
  class Broken extends GTplComponentBase { onDestroy() { throw new Error('expected child cleanup error'); } }
  class Sibling extends GTplComponentBase { onDestroy() { siblingDestroyed++; } }
  const brokenTag = uniqueTag('g-broken-child'), siblingTag = uniqueTag('g-sibling-child');
  await attachAotTemplate(Broken, '<b>broken</b>');
  await attachAotTemplate(Sibling, '<b>sibling</b>');
  Component({ tag: brokenTag })(Broken);
  Component({ tag: siblingTag })(Sibling);
  class Parent extends GTplComponentBase {}
  await attachAotTemplate(Parent, `<${brokenTag}></${brokenTag}><${siblingTag}></${siblingTag}>`);
  Component({ tag: uniqueTag('g-parent-cleanup-error') })(Parent);
  const host = new Parent.__gcomponent__();
  document.body.append(host);
  const controller = getControllerFromComponent(host);
  const error = console.error;
  const logged = [];
  console.error = value => logged.push(value);
  try { controller.destroy(); } finally { console.error = error; }
  assert.equal(siblingDestroyed, 1);
  assert.equal(host.isConnected, false);
  assert.equal(getControllerFromComponent(host), null);
  assert.equal(logged.length, 1);
  assert.match(logged[0].message, /expected child cleanup error/);
});

test('destroying a non-web component in onInit does not append a watcher afterwards', async () => {
  let connected = 0;
  class SelfDestroying extends GTplComponentBase {
    onInit() { this.destroy(); }
    onConnect() { connected++; }
  }
  await attachAotTemplate(SelfDestroying, '<b>unused</b>');
  Component({ tag: uniqueTag('g-self-destroy'), asWebComponent: false })(SelfDestroying);
  const host = document.createElement('div');
  document.body.append(host);
  new SelfDestroying.__gcomponent__(host);
  await wait();
  assert.equal(host.children.length, 0);
  assert.equal(connected, 0);
  host.remove();
});
