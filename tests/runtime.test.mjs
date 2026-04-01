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

const { Component, GTplComponentBase, getControllerFromComponent, GWatcher } = await import("../dist/gtplweb.esm.js");
const { default: GTPL } = await import("@mpeliz/gtpl");

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const uniqueTag = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

async function attachAotTemplate(ControllerClass, html) {
  const compiled = await GTPL.jit.GCode(html);
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
