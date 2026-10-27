"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
      if (decorator = decorators[i2])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result) __defProp(target, key, result);
    return result;
  };

  // node_modules/@mpeliz/gtpl/dist/gtpl.esm.js
  function e(e2) {
    const t2 = {};
    let n2 = "", i2 = null, s2 = 0;
    const r2 = (e3) => {
      if (!(e3 = e3.trim())) return;
      const n3 = e3.indexOf(":");
      if (-1 === n3) return;
      const i3 = e3.slice(0, n3).trim(), s3 = e3.slice(n3 + 1).trim();
      if (!i3) return;
      const r3 = i3.startsWith("--") ? i3 : i3.replace(/-([a-z])/g, (e4, t3) => t3.toUpperCase());
      t2[r3] = s3;
    };
    for (let t3 = 0; t3 < e2.length; t3++) {
      const o2 = e2[t3];
      '"' !== o2 && "'" !== o2 || (i2 === o2 ? i2 = null : i2 || (i2 = o2)), i2 || ("(" === o2 && s2++, ")" === o2 && s2--), i2 || 0 !== s2 || ";" !== o2 ? n2 += o2 : (r2(n2), n2 = "");
    }
    return r2(n2), t2;
  }
  function t(e2) {
    return e2.startsWith("--") ? e2 : e2.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
  var n = /* @__PURE__ */ new Set(["symbol", "bigint", "undefined", "boolean", "string", "number"]);
  function i(e2) {
    return null === e2 || n.has(typeof e2);
  }
  function s(...e2) {
    console.log("%c----------", "font-weight:bold"), console.log(...e2), console.log("%c----------", "font-weight:bold");
  }
  function r(e2, ...t2) {
    const n2 = new Error(e2);
    console.error("%cSTACK ERROR:", "color:red;font-weight:bold", e2), s(n2.stack, ...t2);
  }
  var o = /* @__PURE__ */ Symbol("is proxy");
  var l = /* @__PURE__ */ Symbol("proxy target");
  var a = /* @__PURE__ */ new WeakMap();
  var c = /* @__PURE__ */ new WeakMap();
  function h(e2) {
    return !!e2 && "object" == typeof e2 && true === e2[o];
  }
  function f(e2, t2, n2, s2 = []) {
    if (i(e2) || (null === (r2 = e2) || "function" == typeof r2 || "undefined" != typeof Window && r2 instanceof Window || "undefined" != typeof Node && r2 instanceof Node || "undefined" != typeof DOMTokenList && r2 instanceof DOMTokenList || "undefined" != typeof NodeList && r2 instanceof NodeList || "undefined" != typeof HTMLCollection && r2 instanceof HTMLCollection || r2 instanceof Date || r2 instanceof RegExp || r2 instanceof Map || r2 instanceof Set || r2 instanceof WeakMap || r2 instanceof WeakSet || r2 instanceof ArrayBuffer || ArrayBuffer.isView(r2) || !Object.isExtensible(r2))) return e2;
    var r2;
    const u2 = a.get(e2);
    if (u2) return c.get(e2).add(t2), u2.proxy;
    const d2 = /* @__PURE__ */ (function(e3, t3, n3 = [], s3) {
      return { get(r3, a2, c2) {
        if (a2 === o) return true;
        if (a2 === l) return e3;
        if (a2 === Symbol.iterator) {
          const e4 = r3[Symbol.iterator];
          return "function" != typeof e4 ? e4 : function* () {
            for (const o2 of e4.call(r3)) yield i(o2) || h(o2) ? o2 : f(o2, s3, t3, [...n3, Symbol.iterator]);
          };
        }
        const u3 = Reflect.get(r3, a2, c2);
        return i(u3) || h(u3) ? u3 : f(u3, s3, t3, [...n3, a2]);
      }, set(s4, r3, o2, a2) {
        h(o2) && (o2 = o2[l]);
        const f2 = Reflect.get(s4, r3, a2);
        if (i(f2) && f2 === o2) return true;
        const u3 = Reflect.set(s4, r3, o2, a2);
        if (u3) {
          const i2 = c.get(e3);
          i2?.forEach((e4) => e4(0, [...n3, r3], o2, t3));
        }
        return u3;
      }, deleteProperty(i2, s4) {
        const r3 = Reflect.deleteProperty(i2, s4);
        if (r3) {
          const i3 = c.get(e3);
          i3?.forEach((e4) => e4(1, [...n3, s4], void 0, t3));
        }
        return r3;
      }, has: (e4, t4) => Reflect.has(e4, t4), ownKeys: (e4) => Reflect.ownKeys(e4), getOwnPropertyDescriptor: (e4, t4) => Reflect.getOwnPropertyDescriptor(e4, t4) };
    })(e2, n2, s2, t2), { proxy: p2, revoke: g2 } = Proxy.revocable(e2, d2);
    return a.set(e2, { proxy: p2, revoke: g2 }), c.set(e2, /* @__PURE__ */ new Set([t2])), p2;
  }
  function u(e2, t2) {
    const n2 = d(e2);
    return (function(e3, t3) {
      h(e3) && (e3 = e3[l]);
      const n3 = c.get(e3);
      if (n3 && (n3.delete(t3), 0 === n3.size)) {
        c.delete(e3);
        const t4 = a.get(e3);
        if (t4) {
          try {
            t4.revoke();
          } catch (e4) {
            console.error("[GProxy] Error revoking proxy:", e4);
          }
          a.delete(e3);
        }
      }
    })(n2, t2), n2;
  }
  function d(e2) {
    let t2 = e2;
    for (; h(t2); ) t2 = t2[l];
    return t2;
  }
  var p = null;
  function g(e2) {
    return e2 && e2.Math === Math && e2;
  }
  try {
    p = g("object" == typeof globalThis && globalThis) || g("object" == typeof window && window) || g("object" == typeof self && self) || g("object" == typeof global && global) || /* @__PURE__ */ (function() {
      return this;
    })() || Function("return this")();
  } catch (e2) {
  }
  var m = p;
  var y = null;
  try {
    const e2 = { get passive() {
      return y = true, false;
    } };
    m.addEventListener("test", null, e2), m.removeEventListener("test", null, e2);
  } catch (e2) {
    y = false;
  }
  var v = y;
  var k = /* @__PURE__ */ new Map();
  var E = /* @__PURE__ */ new WeakMap();
  function w(e2, t2, n2, i2, s2) {
    const r2 = k.get(t2);
    if (!r2) return false;
    const o2 = new r2(e2, n2, i2, s2);
    let l2 = E.get(e2);
    return l2 || (l2 = [], E.set(e2, l2)), l2.push(o2), o2;
  }
  function b(e2, t2, n2) {
    return n2 && (e2.mark = n2), t2 && (e2.ele = t2), e2;
  }
  function C(e2, t2, n2, i2) {
    Array.isArray(t2) ? t2.forEach((t3) => C(e2, t3, n2, i2)) : "function" != typeof t2 ? null != t2 && (Array.isArray(e2) ? e2.push(t2) : i2(e2, t2)) : C(e2, t2(n2), n2, i2);
  }
  function x(e2, t2, n2) {
    C(e2, t2, n2, (e3, t3) => e3.appendChild(t3));
  }
  function A(e2, t2, n2, i2) {
    let s2 = null;
    switch (e2) {
      case "#text":
        null == s2 && (s2 = m.document.createTextNode("")), "string" == typeof t2 && (s2.textContent = t2);
      case "#comment":
        return null == s2 && (s2 = m.document.createComment("")), "string" == typeof t2 ? s2.textContent = t2 : t2.forEach((e3) => {
          "string" != typeof e3 ? Array.isArray(e3) ? console.error(s2, e3) : 0 == e3.type ? i2.addBind(b(e3, s2)) : i2.addBind(b(e3, void 0, s2)) : s2.textContent = e3;
        }), s2;
      default:
        const r2 = m.document.createElement(e2);
        return x(r2, n2, i2), N(t2, r2, i2), r2;
    }
  }
  function R(e2) {
    if (k.has(e2)) return { dirName: e2, arg: null };
    const [t2, n2] = e2.split(":");
    return k.has(t2) ? { dirName: t2, arg: n2 } : null;
  }
  function N(e2, t2, n2) {
    if (!Array.isArray(e2)) return;
    const i2 = [];
    e2.forEach((e3) => {
      if (Array.isArray(e3)) {
        const n3 = R(e3[0]);
        n3 ? i2.push([e3, n3]) : t2.setAttribute(e3[0], e3[1]);
      } else {
        const s2 = e3;
        let r2 = null;
        s2.prop && (r2 = R(s2.prop), r2 && i2.push([s2, r2])), r2 || n2.addBind(b(s2, t2));
      }
    }), i2.forEach((e3) => {
      const i3 = e3[0], s2 = e3[1];
      if (Array.isArray(i3)) {
        const [e4, r2] = i3;
        w(t2, s2.dirName, r2, n2, s2.arg);
      } else {
        const e4 = i3, r2 = w(t2, s2.dirName, "", n2, s2.arg);
        n2.addBind(b(e4, r2));
      }
    });
  }
  var P = A;
  var S = x;
  var B = function(e2, t2, n2) {
    C(e2, t2, n2, (e3, t3) => {
      const n3 = e3.parentNode;
      n3 && n3.insertBefore(t3, e3);
    });
  };
  var O = function(e2, t2, n2) {
    C(e2, t2, n2, (e3, t3) => {
      const n3 = e3.parentNode;
      if (!n3) return;
      const i2 = e3.nextSibling;
      i2 ? n3.insertBefore(t3, i2) : n3.appendChild(t3);
    });
  };
  var T = function(e2, t2) {
    return new Function("g", `return ${e2};`)(t2 || A);
  };
  var j = function(e2) {
    if ("function" != typeof e2) throw new Error("GCompileSafe expects a precompiled generator function");
    return e2;
  };
  var M = function(e2, t2) {
    return !k.has(e2) && (k.set(e2, t2), true);
  };
  var G = N;
  var L = /* @__PURE__ */ Symbol("ElementReferenceIndex");
  var V = { binitChangeEvents: false, changeEventsCount: 0, changeEventsHandler: null };
  var D = class _D {
    static globalVar = /* @__PURE__ */ new WeakMap();
    static init(e2) {
      _D.globalVar.has(e2) || _D.globalVar.set(e2, { GenerationFinish: false, MarkEle: /* @__PURE__ */ new WeakMap(), memValues: /* @__PURE__ */ new WeakMap(), renderElements: /* @__PURE__ */ new Set() });
    }
    static getProperty(e2, t2) {
      _D.init(e2);
      return _D.globalVar.get(e2)[t2];
    }
    static setProperty(e2, t2, n2) {
      _D.init(e2);
      _D.globalVar.get(e2)[t2] = n2;
    }
  };
  var $ = /* @__PURE__ */ new WeakMap();
  var F = /* @__PURE__ */ new WeakMap();
  function W() {
    !(function() {
      if (V.binitChangeEvents) return;
      V.binitChangeEvents = true, V.changeEventsHandler = function(e2) {
        const t2 = e2.target, n2 = $.get(t2);
        if (n2 && n2.size) for (const e3 of n2) {
          const n3 = e3.prop || "value";
          let i2;
          i2 = n3 in t2 ? t2[n3] : t2.getAttribute(n3), H(e3.va, e3.ctx, i2);
        }
      };
    })(), V.changeEventsCount++, V.changeEventsCount > 1 || m && "function" == typeof m.addEventListener && (m.addEventListener("input", V.changeEventsHandler), m.addEventListener("change", V.changeEventsHandler), m.addEventListener("toggle", V.changeEventsHandler));
  }
  function _(e2, t2) {
    const n2 = D.getProperty(e2, "renderElements");
    n2.has(t2) || n2.add(t2);
  }
  function H(e2, t2, n2, i2 = false) {
    if (e2.length) if (e2.length > 1) {
      const s2 = (t3, n3, i3) => n3 === i3 ? t3[e2[n3]] : s2(t3[e2[n3]], ++n3, i3), r2 = s2(t2.Root, 0, e2.length - 2), o2 = e2[e2.length - 1];
      (i2 || r2[o2] !== n2) && (r2[o2] = n2);
    } else {
      const s2 = e2[0];
      (i2 || t2.Root[s2] !== n2) && (t2.Root[s2] = n2);
    }
  }
  function J(e2, t2, n2, i2, s2) {
    null == i2 && (i2 = 0);
    const r2 = null == n2 ? e2.getValue(t2[i2++]) : n2[t2[i2++]];
    return i2 >= t2.length ? r2 : J(e2, t2, r2, i2);
  }
  async function I(e2, t2, n2, i2) {
    null == n2 && (n2 = 0);
    const s2 = t2[n2], o2 = e2.getContext(s2.name[0]), l2 = J(o2, s2.name);
    if (l2) {
      const t3 = [];
      s2.params && s2.params.forEach((n3) => {
        null != n3.ct ? t3.push(n3.ct) : null != n3.va && t3.push(J(e2, n3.va));
      }), null != i2 && t3.push(i2), i2 = await l2.apply(o2.Root, t3);
    } else r("fnc undefined", n2, t2);
    return ++n2 >= t2.length ? i2 : await I(e2, t2, n2, i2);
  }
  async function z(e2, t2, n2, i2) {
    let s2;
    const r2 = t2.gtpl ? t2.gtpl : e2;
    if (t2.link.formula && t2.link.formula.fnc) {
      const e3 = t2.link.formula.fnc, n3 = [];
      if (t2.link.formula.vars) {
        t2.link.formula.vars.forEach((e4) => {
          n3.push(r2.getValue(e4[0]));
        });
      }
      i2 && n3.push(i2), s2 = await e3.apply(r2.Root, n3);
    } else {
      if (t2.link.vorc) {
        if (null != t2.link.vorc.va) {
          const e3 = t2.link.vorc.va;
          s2 = 1 === e3.length && "this" === e3[0] ? r2.Root : void 0 !== n2 ? n2 : J(r2, e3), s2 = null != n2 ? n2 : J(r2, t2.link.vorc.va);
        }
        null != t2.link.vorc.ct && (s2 = t2.link.vorc.ct);
      }
      t2.link.functions && (s2 = await I(r2, t2.link.functions, 0, s2));
    }
    return s2;
  }
  function U(e2, t2) {
    let n2 = e2;
    if (t2.link.vorc && t2.link.vorc.va) n2 = e2.getContext(t2.link.vorc.va[0]);
    else if (t2.link.functions) {
      const i2 = t2.link.functions[0];
      n2 = e2.getContext(i2.name[0]);
    }
    return n2;
  }
  function K(e2, t2, n2) {
    const s2 = t2[0];
    if (null != e2.BindTree[s2]) return;
    const o2 = { key: s2, val: e2.getValue(s2), pro: void 0 };
    e2.BindDef.add(o2);
    try {
      e2.Root.hasOwnProperty(s2) || (e2.Root[s2] = null), Object.defineProperty(e2.Root, s2, { get: function() {
        return void 0 !== o2.pro ? o2.pro : i(o2.val) ? o2.val : (o2.val = d(o2.val), o2.pro = f(o2.val, e2.BoundEventProxy, o2, [o2.key]), o2.pro);
      }, set: function(t3) {
        o2.val = t3;
        const n3 = i(t3) ? (delete o2.pro, o2.val) : (o2.val = d(o2.val), o2.pro = f(o2.val, e2.BoundEventProxy, o2, [o2.key]), o2.pro);
        return e2.eventPRoxy(0, [o2.key], t3, o2), n3;
      } });
    } catch (t3) {
      r(t3.message, s2, e2.Root);
    }
  }
  function X(e2, t2, n2) {
    if (0 == t2.length || 1 == t2.length && "this" == t2[0]) return;
    let i2 = e2.BindTree;
    for (let s2 = 0, r2 = t2.length; s2 < r2; s2++) {
      const o2 = t2[s2];
      if (0 == s2) {
        const i3 = e2.getContext(o2);
        if (K(i3, t2), i3 != e2) return n2.gtpl = e2, e2.BindMap || (e2.BindMap = /* @__PURE__ */ new Map()), e2.BindMap.set(n2, i3), void X(i3, t2, n2);
      }
      null == i2[o2] && (i2[o2] = {}), s2 < r2 - 1 ? (i2 = i2[o2], null == i2.tree && (i2.tree = {}), i2 = i2.tree) : i2 = i2[o2];
    }
    null == i2.me && (i2.me = /* @__PURE__ */ new Set()), i2.me.add(n2);
  }
  function Y(e2, t2, n2) {
    if (0 == t2.length || 1 == t2.length && "this" == t2[0]) return null;
    let i2 = e2.BindTree;
    for (let e3 = 0, n3 = t2.length; e3 < n3; e3++) {
      const s2 = t2[e3];
      e3 < n3 - 1 ? (i2 = i2[s2], i2 = i2.tree) : i2 = i2[s2];
    }
    return i2.me;
  }
  function Z(e2, t2) {
    if (t2.link.vorc && t2.link.vorc.va && Y(e2, t2.link.vorc.va)?.delete(t2), t2.link.formula?.vars && t2.link.formula.vars.forEach((n2) => {
      Y(e2, n2)?.delete(t2);
    }), t2.simetric && t2.ele) {
      const n2 = $.get(t2.ele);
      if (n2) {
        const i2 = t2._simetricEntry;
        if (i2 && n2.has(i2)) n2.delete(i2), n2.size || $.delete(t2.ele);
        else {
          const i3 = new Set(Array.from(n2).filter((t3) => t3.ctx !== e2));
          i3.size ? $.set(t2.ele, i3) : $.delete(t2.ele);
        }
      }
      t2._simetricRefTracked && (V.changeEventsCount && (V.changeEventsCount--, V.changeEventsCount > 0 || m && "function" == typeof m.removeEventListener && V.changeEventsHandler && (m.removeEventListener("input", V.changeEventsHandler), m.removeEventListener("change", V.changeEventsHandler), m.removeEventListener("toggle", V.changeEventsHandler))), delete t2._simetricRefTracked), (function(e3) {
        if (!e3.ele) return;
        const t3 = e3._simetricPatchProp;
        if (!t3) return;
        const n3 = F.get(e3.ele);
        if (!n3) return void delete e3._simetricPatchProp;
        const i2 = n3.get(t3);
        i2 ? (i2.count--, i2.count <= 0 && (i2.restore(), n3.delete(t3), n3.size || F.delete(e3.ele)), delete e3._simetricPatchProp) : delete e3._simetricPatchProp;
      })(t2), delete t2._simetricEntry;
    }
  }
  function q(e2, t2) {
    let n2 = false;
    if (t2.link.vorc && t2.link.vorc.va && Y(e2, t2.link.vorc.va)?.has(t2) && (n2 = true), t2.link.formula?.vars && t2.link.formula.vars.forEach((i2) => {
      Y(e2, i2)?.has(t2) && (n2 = true);
    }), !n2) {
      const n3 = D.getProperty(e2, "renderElements");
      n3.has(t2) && n3.delete(t2);
    }
    return n2;
  }
  function Q(e2, t2) {
    if (7 == t2.type && t2.prop && t2.link && t2.link.vorc && t2.link.vorc.va) {
      const { prop: n2 } = t2;
      if (n2.startsWith("[") && n2.endsWith("]")) {
        t2._simetricRefTracked || (W(), t2._simetricRefTracked = true), t2.simetric = true, t2.prop = n2.slice(1, -1);
        const i2 = t2.link.vorc.va, s2 = e2.getContext(i2[0]);
        $.has(t2.ele) || $.set(t2.ele, /* @__PURE__ */ new Set());
        const r2 = { va: i2, ctx: s2, prop: t2.prop };
        $.get(t2.ele)?.add(r2), t2._simetricEntry = r2, (function(e3, t3, n3) {
          if (!e3.ele || !e3.prop) return;
          const i3 = e3.ele, s3 = e3.prop;
          let r3 = F.get(i3);
          r3 || (r3 = /* @__PURE__ */ new Map(), F.set(i3, r3));
          const o2 = r3.get(s3);
          if (o2) return o2.count++, void (e3._simetricPatchProp = s3);
          const l2 = i3.constructor?.prototype;
          if (!l2 || !(s3 in l2)) return;
          const a2 = Object.getOwnPropertyDescriptor(l2, s3);
          if (!a2 || "function" != typeof a2.get || "function" != typeof a2.set) return;
          const c2 = Object.prototype.hasOwnProperty.call(i3, s3), h2 = c2 ? Object.getOwnPropertyDescriptor(i3, s3) : void 0;
          Object.defineProperty(i3, s3, { configurable: true, enumerable: a2.enumerable, get: function() {
            return a2.get.call(this);
          }, set: function(e4) {
            if ("value" === s3 && "select" === i3.nodeName?.toLowerCase?.()) {
              const i4 = a2.set.call(this, e4);
              return a2.get.call(this) == e4 ? H(t3, n3, e4) : console.error("select value not valid", e4 + " not in options"), i4;
            }
            return H(t3, n3, e4), a2.set.call(this, e4);
          } }), r3.set(s3, { count: 1, restore: () => {
            c2 && h2 ? Object.defineProperty(i3, s3, h2) : delete i3[s3];
          } }), e3._simetricPatchProp = s3;
        })(t2, i2, s2);
      }
    }
  }
  function ee(e2, t2) {
    e2 && (e2.me && e2.me.forEach((e3) => t2.add(e3)), e2.tree && Object.keys(e2.tree).forEach((n2) => {
      ee(e2.tree[n2], t2);
    }));
  }
  function te(e2) {
    if (Array.isArray(e2)) e2.forEach((e3) => {
      te(e3);
    });
    else {
      if (e2[L]) {
        for (const { type: t2, handler: n2, options: i2 } of e2[L]) e2.removeEventListener(t2, n2, i2);
        delete e2[L];
      }
      if ("undefined" != typeof Element && e2 instanceof Element) for (; e2.attributes.length > 0; ) e2.removeAttribute(e2.attributes[0].name);
      e2.destroy ? e2.destroy(true) : e2.parentNode?.removeChild(e2);
    }
  }
  function ne(e2, t2, n2, i2, s2 = [], r2 = 0) {
    if (!e2) return s2;
    if (e2.me && e2.me.forEach((e3) => {
      const o2 = 0 === r2 ? i2 : void 0, l2 = n2.slice(r2);
      s2.push([t2, e3, l2, o2]);
    }), e2.tree) {
      const o2 = n2[r2];
      for (const l2 in e2.tree) if (void 0 === o2 || o2 === l2) {
        const a2 = void 0 !== i2 ? void 0 === o2 ? i2 : i2[l2] : void 0;
        ne(e2.tree[l2], t2, n2, a2, s2, r2 + 1);
      }
    }
    return s2;
  }
  function ie(e2, t2, n2) {
    if (n2) {
      const n3 = D.getProperty(e2, "MarkEle"), i2 = D.getProperty(e2, "memValues");
      t2.ele ? n3.has(t2.mark) && t2.ele != n3.get(t2.mark) && (t2.ele = n3.get(t2.mark), i2.delete(t2)) : t2.mark && (t2.gen ? (n3.has(t2.mark) ? t2.ele = n3.get(t2.mark) : ("function" == typeof t2.gen ? t2.ele = t2.gen(t2.gtpl ? t2.gtpl : e2) : (t2.ele = [], S(t2.ele, t2.gen, t2.gtpl ? t2.gtpl : e2)), n3.set(t2.mark, t2.ele)), delete t2.gen) : n3.has(t2.mark) && (t2.ele = n3.get(t2.mark), i2.delete(t2)));
    }
  }
  function se(e2, t2 = true) {
    e2.ele && (Array.isArray(e2.ele) ? e2.ele.forEach((t3) => {
      e2.mark.parentNode.insertBefore(t3, e2.mark);
    }) : e2.mark.parentNode.insertBefore(e2.ele, e2.mark), t2 && e2.mark.remove());
  }
  function re(e2, t2 = true) {
    e2.ele && (Array.isArray(e2.ele) ? (t2 && e2.ele[0].parentNode.insertBefore(e2.mark, e2.ele[0]), e2.ele.forEach((e3) => {
      e3.remove();
    })) : (t2 && e2.ele.parentNode.insertBefore(e2.mark, e2.ele), e2.ele.remove()));
  }
  function oe(e2, t2, n2) {
    const i2 = ae(e2, t2), s2 = (function(e3) {
      let t3 = true;
      if (e3.mark.checks) {
        for (let n3 in e3.mark.checks) if (!e3.mark.checks[n3]) {
          t3 = false;
          break;
        }
      }
      return t3;
    })(t2);
    return n2 && s2 ? (i2 >= 0 && (e2.RenderElements[i2] = t2), t2.mark.parentNode ? se(t2) : i2 >= 0 && q(e2, t2) && _(e2, t2)) : (i2 >= 0 && delete e2.RenderElements[i2], t2.ele.parentNode ? re(t2) : i2 >= 0 && q(e2, t2) && _(e2, t2)), !(n2 && !s2);
  }
  function le(e2, t2) {
    if (!e2) return;
    if (Array.isArray(e2)) return void e2.forEach((e3) => le(e3, t2));
    if (8 === e2.nodeType && 6 == e2.textContent?.length) return void (t2[e2.textContent] = e2);
    const n2 = e2.content?.childNodes || e2.childNodes;
    if (n2) for (let e3 = 0, i2 = n2.length; e3 < i2; e3++) le(n2[e3], t2);
  }
  function ae(e2, t2) {
    const n2 = e2.Elements.indexOf(t2.mark);
    return n2 >= 0 && (e2.RenderElements || (e2.RenderElements = {})), n2;
  }
  function ce(e2, t2, n2, i2, s2, r2) {
    const o2 = { parent: t2.gtpl ? t2.gtpl : e2, generator: t2.gen };
    if (n2 && i2 && s2) {
      const e3 = {};
      e3[n2.index] = i2.length, e3[n2.target] = s2, o2.context = [n2.index, n2.target], o2.root = e3;
    }
    return void 0 !== r2 && (o2.refresh = r2), new fe(o2);
  }
  async function he(e2, t2, n2, i2, s2) {
    t2 = U(t2, n2);
    const r2 = null != i2;
    if (n2.mark.checks || (n2.mark.checks = {}), n2.mark.checks[n2.type] = r2, ie(t2, n2, r2), n2.mark.checks || (n2.mark.checks = {}), n2.mark.checks[n2.type] = null != i2, !n2.ele) return t2;
    const o2 = D.getProperty(t2, "memValues");
    if (o2.has(n2) && o2.get(n2) === i2) return t2;
    if (o2.set(n2, i2), n2.case && n2.case.length) {
      if (n2.eles && n2.eles.length && (n2.eles.forEach((e3) => {
        re(e3.refCase), e3.destroy(), t2.GtplChilds.delete(e3);
      }), delete n2.eles), !q(t2, n2)) return t2;
      if (r2) {
        if (!n2.case[0].mark) {
          const e3 = {};
          le(n2.ele, e3);
          for (let t3 = 0, i3 = n2.case.length; t3 < i3; t3++) {
            const i4 = n2.case[t3];
            !i4.mark && i4.uid && (i4.mark = e3[i4.uid]);
          }
        }
        for (let e3 = 0, s3 = n2.case.length; e3 < s3; e3++) {
          const s4 = n2.case[e3];
          if (await z(t2, s4) == i2) {
            const e4 = ce(t2, s4, void 0, void 0, void 0, false);
            s4.ele = e4.Elements, s4.eles = [e4], e4.refCase = s4, t2.GtplChilds.add(e4), n2.eles = s4.eles;
            break;
          }
        }
      }
    }
    return oe(t2, n2, r2) && r2 && (n2.eles[0].refresh(), se(n2.eles[0].refCase)), t2;
  }
  var fe = class {
    ID;
    FncElements;
    Elements;
    RenderElements;
    BindTree;
    BindConst;
    BindMap;
    BindDef;
    GtplChilds;
    Parent;
    Context;
    Root;
    BoundEventProxy;
    cleanupCallbacks;
    watchers;
    isDestroyed = false;
    constructor(e2) {
      this.ID = Math.random().toString(16).slice(2), this.BindTree = {}, this.BindConst = /* @__PURE__ */ new Set(), this.BindDef = /* @__PURE__ */ new Set(), this.GtplChilds = /* @__PURE__ */ new Set(), this.cleanupCallbacks = /* @__PURE__ */ new Set(), this.watchers = /* @__PURE__ */ new Map(), this.BoundEventProxy = this.eventPRoxy.bind(this), this.loadOptions(e2);
    }
    loadOptions(e2) {
      e2 && (this.Root = e2.root, e2.parent && (this.Parent = e2.parent), e2.context && (this.Context = new Set(e2.context)), e2.generator && (this.FncElements = e2.generator, this.Elements = [], S(this.Elements, this.FncElements, this)), D.setProperty(this, "GenerationFinish", true), void 0 !== e2.refresh && true !== e2.refresh || this.refresh());
    }
    getValue(e2) {
      const t2 = this.Root;
      return "this" == e2 ? t2 : t2 && e2 in t2 ? t2[e2] : this.Parent ? this.Parent.getValue(e2) : void 0;
    }
    getGtplRoot() {
      return this.Parent ? this.Parent.getGtplRoot() : this;
    }
    getRoot() {
      return this.Parent ? this.Parent.getRoot() : this.Root;
    }
    getContext(e2) {
      return "this" == e2 || this.Context && this.Context.has(e2) ? this : this.Parent ? this.Parent.getContext(e2) : this.getGtplRoot();
    }
    addBind(e2) {
      this.checkDestroyed("addBind") || ((function(e3, t2) {
        if (10 === t2.type && t2.link?.vorc?.va && t2.ele) return H(t2.link.vorc.va, e3, t2.ele, true), true;
        if (11 === t2.type && t2.link?.vorc?.va && t2.ele) {
          const n2 = t2.link.vorc.va;
          let i2 = J(e3, n2);
          return Array.isArray(i2) || (H(n2, e3, [], true), i2 = J(e3, n2)), i2.includes(t2.ele) || i2.push(t2.ele), true;
        }
        return false;
      })(this, e2) || (function(e3, t2) {
        if (6 == t2.type && t2.prop) {
          const n2 = { gtpl: U(e3, t2), bind: t2 }, i2 = { passive: false }, s2 = async function(t3) {
            const i3 = await z(n2.gtpl, n2.bind, void 0, t3);
            if ("function" == typeof i3) if (n2.bind.link.params) {
              const s3 = [];
              n2.bind.link.params.forEach((t4) => {
                null != t4.ct ? s3.push(t4.ct) : null != t4.va && s3.push(J(e3, t4.va));
              }), i3.apply(n2.gtpl.Root, [t3, ...s3]);
            } else i3.apply(n2.gtpl.Root, [t3]);
            else false === i3 && (t3.preventDefault && t3.preventDefault(), t3.stopPropagation && t3.stopPropagation());
          };
          return t2.ele.addEventListener(t2.prop, s2, !!v && i2), t2.ele[L] || (t2.ele[L] = []), t2.ele[L].push({ type: t2.prop, handler: s2, options: !!v && i2 }), true;
        }
        return false;
      })(this, e2) || (function(e3, t2) {
        let n2 = false;
        return t2.link.formula && t2.link.formula.vars && t2.link.formula.vars.length && (n2 = true, t2.link.formula.vars.forEach((n3) => {
          X(e3, n3, t2);
        })), n2;
      })(this, e2) || (function(e3, t2) {
        let n2 = false;
        return t2.link.vorc && t2.link.vorc.va && (n2 = true, Q(e3, t2), X(e3, t2.link.vorc.va, t2)), t2.link.functions && t2.link.functions.forEach((i2) => {
          i2.params && i2.params.forEach((i3) => {
            i3.va && (n2 = true, X(e3, i3.va, t2));
          });
        }), n2;
      })(this, e2) || this.BindConst.add(e2), D.getProperty(this, "GenerationFinish") && this.launchChange(4, e2));
    }
    checkDestroyed(e2) {
      return !!this.isDestroyed && (console.warn(`[GTPL] Cannot perform ${e2} on destroyed component`, this.ID), true);
    }
    destroy(e2 = true) {
      if (this.isDestroyed) return void console.warn("[GTPL] Component already destroyed", this.ID);
      if (this.cleanupCallbacks && this.cleanupCallbacks.size > 0 && (this.cleanupCallbacks.forEach((e3) => {
        try {
          e3();
        } catch (e4) {
          console.error("[GTPL] Error in cleanup callback:", e4);
        }
      }), this.cleanupCallbacks.clear()), this.isDestroyed = true, this.GtplChilds.forEach((e3) => e3.destroy(false)), this.GtplChilds.clear(), this.BindDef) {
        for (const e3 of this.BindDef) u(e3.val, this.BoundEventProxy);
        this.BindDef.clear();
      }
      const t2 = /* @__PURE__ */ new Set();
      if (this.BindTree && ee(this.BindTree, t2), this.BindConst && this.BindConst.forEach((e3) => t2.add(e3)), t2.forEach((e3) => {
        Z(this, e3);
      }), this.BindMap) {
        for (const [e3, t3] of this.BindMap) Z(t3, e3);
        this.BindMap.clear();
      }
      if (e2 && (te(this.Elements), this.RenderElements)) {
        const e3 = Array.isArray(this.Elements) ? this.Elements.length : 1;
        for (let t3 = 0; t3 < e3; t3++) {
          const e4 = this.RenderElements[t3];
          e4 && (e4.ele && te(e4.ele), e4.eles && te(e4.eles));
        }
        this.RenderElements = null;
      }
      this.watchers && this.watchers.clear(), this.watchers = null, this.Elements = null, this.Root = null, this.BindTree = null, this.BindConst = null, this.Context = null, this.Parent = null;
    }
    onCleanup(e2) {
      this.isDestroyed || "function" == typeof e2 && this.cleanupCallbacks.add(e2);
    }
    refresh() {
      for (let e2 of this.BindDef) this.eventPRoxy(4, [], void 0, e2);
      if (this.BindMap) for (let [e2, t2] of this.BindMap) t2.launchChange(5, e2);
      if (this.BindConst) for (let e2 of this.BindConst) this.launchChange(6, e2);
    }
    processRenderAndApply(e2, t2) {
      if (!this.checkDestroyed("addBind")) if (this.RenderElements) {
        const n2 = [];
        (Array.isArray(this.Elements) ? this.Elements : [this.Elements]).forEach((e3, t3) => {
          const i2 = this.RenderElements[t3];
          i2 ? i2.ele ? n2.push(i2.ele) : i2.eles && (i2.eles.forEach((e4) => e4.addTo(n2)), n2.push(i2.mark)) : n2.push(e3);
        }), t2(e2, n2, this);
      } else t2(e2, this.Elements, this);
    }
    addTo(e2) {
      this.processRenderAndApply(e2, S);
    }
    insertAfterTo(e2) {
      this.processRenderAndApply(e2, O);
    }
    insertBeforeTo(e2) {
      this.processRenderAndApply(e2, B);
    }
    watch(e2, t2) {
      if (this.isDestroyed) return () => {
      };
      const n2 = Array.isArray(e2) ? e2.join(".") : e2;
      let i2 = this.watchers.get(n2);
      i2 || this.watchers.set(n2, i2 = /* @__PURE__ */ new Set()), i2.add(t2);
      const s2 = () => {
        const e3 = this.watchers.get(n2);
        e3 && (e3.delete(t2), e3.size || this.watchers.delete(n2));
      };
      return this.onCleanup(s2), s2;
    }
    emitWatchers(e2, t2, n2, i2) {
      if (!this.watchers || 0 === this.watchers.size) return;
      if (!t2 || !t2.length) return;
      if (t2.some((e3) => "symbol" == typeof e3)) return;
      const s2 = t2.map(String).join(".");
      if (!s2) return;
      const r2 = (t3) => {
        const r3 = this.watchers.get(t3);
        if (r3) for (const o3 of r3) try {
          o3({ type: e2, path: s2, value: n2, objRef: i2, watch: t3 });
        } catch (e3) {
          console.error("[GTPL watch] error", e3);
        }
      };
      r2(s2);
      const o2 = s2.split(".");
      for (let e3 = o2.length - 1; e3 >= 1; e3--) r2(o2.slice(0, e3).join("."));
      for (let e3 = o2.length - 1; e3 >= 1; e3--) r2(o2.slice(0, e3).join(".") + ".*");
      r2("*");
    }
    eventPRoxy(e2, t2, n2, i2) {
      this.emitWatchers(e2, t2, n2, i2);
      const s2 = Array.isArray(t2) ? t2.slice(1) : [];
      ne(this.BindTree[i2.key], e2, s2, n2, [], 1).forEach((e3) => this.launchChange.apply(this, e3));
    }
    async launchChange(e2, t2, n2, i2) {
      if (this.checkDestroyed("launchChange")) return;
      if (6 == t2.type) return;
      const s2 = await z(this, t2, i2);
      let o2 = this;
      switch (t2.type) {
        case 0:
          o2 = await (async function(e3, t3, n3, i3) {
            t3 = U(t3, n3);
            const s3 = D.getProperty(t3, "memValues");
            if (null != i3) {
              if (s3.has(n3) && s3.get(n3) == i3) return t3;
              s3.set(n3, i3);
            }
            return n3.ele.textContent = i3, t3;
          })(0, this, t2, s2);
          break;
        case 7:
          o2 = await (async function(e3, t3, n3, i3) {
            t3 = U(t3, n3);
            const s3 = (e4, t4) => {
              if (void 0 !== n3.ele[e4] && null !== n3.ele[e4]) {
                if (null == t4) "" !== n3.ele[e4] && (n3.ele[e4] = null);
                else if (n3.ele[e4] != t4) try {
                  n3.ele[e4] = t4;
                } catch (t5) {
                  r(t5.message, n3.ele, e4);
                }
              } else null == t4 ? n3.ele.removeAttribute(e4) : n3.ele.getAttribute(e4) != t4 && n3.ele.setAttribute(e4, t4);
            };
            if (n3.prop) s3(n3.prop, i3);
            else if (null == i3) n3.attrs && (n3.attrs.forEach((e4) => {
              s3(e4, null);
            }), delete n3.attrs);
            else {
              n3.attrs || (n3.attrs = []), n3.attrs.filter((e4) => !(e4 in i3)).forEach((e4) => {
                s3(e4, null);
              }), n3.attrs.length = 0;
              for (let e4 in i3) n3.attrs.push(e4), s3(e4, i3[e4]);
            }
            return t3;
          })(0, this, t2, s2);
          break;
        case 9:
          o2 = await (async function(e3, t3, n3, i3) {
            return t3 = U(t3, n3), void 0 !== i3 && n3.ele.innerHTML != i3 && (n3.ele.innerHTML = i3), t3;
          })(0, this, t2, s2);
          break;
        case 8:
          o2 = await (async function(e3, t3, n3, i3) {
            t3 = U(t3, n3);
            const s3 = D.getProperty(t3, "memValues");
            return s3.has(n3) && s3.get(n3) == i3 || (s3.set(n3, i3), n3.prop && (n3.ele.style[n3.prop] = i3)), t3;
          })(0, this, t2, s2);
          break;
        case 1:
        case 2:
          o2 = await (async function(e3, t3, n3, i3) {
            t3 = U(t3, n3);
            const s3 = 2 == n3.type ? !i3 : !!i3;
            if (n3.mark.checks || (n3.mark.checks = {}), n3.mark.checks[n3.type] = s3, ie(t3, n3, s3), !n3.ele) return t3;
            const r2 = D.getProperty(t3, "memValues");
            return r2.has(n3) && r2.get(n3) === s3 || oe(t3, n3, s3) && r2.set(n3, s3), t3;
          })(0, this, t2, s2);
          break;
        case 5:
          o2 = await (async function(e3, t3, n3, i3, s3) {
            t3 = U(t3, n3), n3.eles || (n3.eles = []);
            const r2 = n3.eles, o3 = n3.link.index, l2 = [], a2 = [], c2 = Array.isArray(s3) && s3.length ? s3[0] : void 0;
            if (isNaN(c2)) if (i3 && i3.length) {
              if ("length" == c2 && r2.length == i3.length) return t3;
              i3.forEach((e4, i4) => {
                if (i4 >= r2.length) {
                  const s4 = ce(t3, n3, o3, r2, e4, false);
                  r2.push(s4), l2.push([s4, i4]);
                } else r2[i4].Root[o3.target] = e4;
              }), r2.length > i3.length && r2.splice(i3.length, r2.length - i3.length).forEach((e4, t4) => {
                a2.push([e4, t4]);
              });
            } else r2.length && (r2.forEach((e4, t4) => {
              a2.push([e4, t4]);
            }), r2.length = 0);
            else {
              const h2 = s3;
              if (0 == e3) {
                let e4 = false;
                if (h2.length > 1) e4 = true;
                else if (1 == h2.length && r2.length == i3.length) return r2[c2].Root[o3.target] = i3[c2], t3;
                if (e4) {
                  const e5 = r2[c2];
                  h2.shift(), H(h2, { Root: e5.Root[o3.target] }, J(t3, h2, i3[c2]), true);
                } else {
                  const e5 = ce(t3, n3, o3, r2, i3[c2], false);
                  r2.push(e5), l2.push([e5, c2]);
                }
              }
              if (1 == e3) if (h2.length > 1) r2[c2].Root[o3.target] = i3[c2];
              else {
                const e4 = r2.splice(c2, 1)[0];
                a2.push([e4, c2]);
              }
            }
            if (a2.length && a2.forEach((e4) => {
              const [n4, i4] = e4;
              n4.destroy(), t3.GtplChilds.delete(n4);
            }), l2.length) {
              const e4 = ae(t3, n3);
              e4 >= 0 && (t3.RenderElements[e4] || (t3.RenderElements[e4] = n3));
              const i4 = [];
              l2.forEach((e5) => {
                const [n4, s4] = e5;
                n4.addTo(i4), t3.GtplChilds.add(n4);
              }), n3.mark.parentNode ? (se({ type: n3.type, link: n3.link, ele: i4, mark: n3.mark }, false), l2.forEach((e5) => {
                e5[0].refresh();
              })) : e4 >= 0 && q(t3, n3) && _(t3, n3);
            }
            return t3;
          })(e2, this, t2, s2, n2);
          break;
        case 3:
          o2 = await he(0, this, t2, s2);
          break;
        case 12:
          o2 = await (async function(e3, t3, n3, i3) {
            t3 = U(t3, n3);
            const s3 = null != i3, r2 = D.getProperty(t3, "memValues");
            if (r2.has(n3) && r2.get(n3) == i3) return t3;
            r2.set(n3, i3);
            let o3 = false;
            if (n3.eles) o3 = true, n3.eles[0].destroy(), t3.GtplChilds.delete(n3.eles[0]), delete n3.eles;
            else if (n3.ele && (re(n3), n3.attrs)) for (const e4 of n3.attrs) Array.isArray(e4) || Z(t3, e4);
            if (!s3) return t3;
            if (o3 && !q(t3, n3)) return t3;
            if (Array.isArray(i3) || "function" == typeof i3) {
              const e4 = ce(t3, { link: n3.link, type: n3.type, gtpl: n3.gtpl, gen: i3 });
              n3.eles = [e4], t3.GtplChilds.add(e4), n3.ele = e4.Elements;
            } else {
              const e4 = d(i3);
              n3.attrs && G(n3.attrs, e4, t3), n3.ele = e4;
            }
            return D.getProperty(t3, "MarkEle").set(n3.mark, n3.ele), oe(t3, n3, s3), t3;
          })(0, this, t2, s2);
      }
      !(function(e3, t3) {
        const n3 = D.getProperty(e3, "renderElements");
        if (!n3.has(t3)) return;
        (Array.isArray(e3.Elements) ? e3.Elements : [e3.Elements]).forEach((t4, i3) => {
          const s3 = e3.RenderElements[i3];
          if (s3 && n3.has(s3)) {
            let e4 = true;
            if (s3.ele) {
              const t5 = Array.isArray(s3.ele) ? s3.ele[0] : s3.ele;
              s3.mark.parentNode || t5.parentNode ? s3.mark.parentNode && !t5.parentNode && (se(s3), s3.eles && (s3.eles[0].refresh(), s3.eles[0].refCase && se(s3.eles[0].refCase))) : e4 = false;
            } else if (s3.eles) if (s3.mark.parentNode) {
              let e5 = null;
              const t5 = [];
              s3.eles.forEach((n4) => {
                const i4 = [];
                n4.refresh(), n4.addTo(i4), i4.forEach((n5) => {
                  n5.parentNode ? e5 || (e5 = n5) : t5.push(n5);
                });
              }), t5.length && se({ type: s3.type, link: s3.link, ele: t5, mark: e5 || s3.mark }, false);
            } else e4 = false;
            e4 && n3.delete(s3);
          }
        });
      })(o2, t2);
    }
  };
  var ue = ["abstract", "await", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "default", "delete", "do", "double", "else", "enum", "export", "extends", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import", "in", "instanceof", "int", "interface", "let", "long", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield", "arguments", "async", "eval", "undefined"];
  var de = class {
    s;
    i;
    l;
    r;
    arr_acepted;
    ln;
    constructor() {
      this.setAceptedAN();
    }
    getResult() {
      return this.r;
    }
    getSingleResult() {
      let e2 = null;
      return this.r && 1 == this.r.length && (e2 = this.r[0]), e2;
    }
    setString(e2) {
      this.s = e2, this.l = e2.length, this.i = 0, this.r = [];
    }
    setAceptedAN(e2 = "_") {
      this.arr_acepted = Array.from(e2).map((e3) => e3.charCodeAt(0));
    }
    checkStart() {
      return this.i + 1 < this.l && "{" === this.s[this.i] && "{" === this.s[this.i + 1];
    }
    checkEnd() {
      return this.i + 1 < this.l && "}" === this.s[this.i] && "}" === this.s[this.i + 1];
    }
    next() {
      return this.i++, !(this.i >= this.l);
    }
    nop(e2 = false, t2 = null) {
      let n2 = null;
      for (this.ln = null; ; ) {
        if (n2 = this.s[this.i], t2 && t2.includes(n2)) return true;
        let i2 = " " == n2 || "	" == n2 || "\r" == n2 || "\n" == n2;
        if (!i2 && e2 && (i2 = '"' != n2 && "'" != n2 && !this.isAN(n2), i2 && (this.ln = n2)), !i2) return true;
        if (!this.next()) return false;
      }
    }
    isAN(e2, t2 = true) {
      if (null == e2) return false;
      let n2;
      for (let i2 = 0, s2 = e2.length, r2 = 0; i2 < s2; i2++) if (r2 = e2.charCodeAt(i2), n2 = r2 > 64 && r2 < 91 || r2 > 96 && r2 < 123 || this.arr_acepted.indexOf(r2) >= 0, t2 && (n2 = n2 || r2 > 47 && r2 < 58), !n2) return false;
      return true;
    }
    getVOrC() {
      let e2 = this.s[this.i];
      if ('"' == e2 || "'" == e2) return { ct: this.getConst() };
      if (this.isAN(e2, false)) return { va: this.getVar() };
      if (this.isNumber(e2)) {
        const e3 = this.i, t2 = this.getNumber();
        if (null !== t2) return { ct: t2 };
        this.i = e3;
      }
      return null;
    }
    getVar(e2 = true) {
      let t2, n2 = this.s[this.i], i2 = null;
      for (; ; ) {
        if (!this.next()) return "" != n2 ? n2.split(".") : null;
        if (i2 = this.s[this.i], t2 = this.isAN(i2), e2 && !t2 && (t2 = "." == i2), !t2) return n2.split(".");
        n2 += i2;
      }
    }
    getConst() {
      const e2 = this.s[this.i];
      if (!this.next()) return null;
      let t2 = this.s[this.i];
      if (t2 == e2) return t2 = "", this.next() ? t2 : null;
      let n2 = null, i2 = null;
      for (; ; ) {
        if (!this.next()) return null;
        if (n2 = this.s[this.i], n2 == e2 && "\\" != i2) return this.next() ? t2 : null;
        t2 += n2, i2 = n2;
      }
    }
    isNumber(e2) {
      const t2 = e2.charCodeAt(0);
      return t2 >= 48 && t2 <= 57;
    }
    getNumber() {
      let e2 = this.s[this.i], t2 = null, n2 = false;
      for (; this.next(); ) {
        if (t2 = this.s[this.i], "." == t2) {
          if (n2) return null;
          n2 = true;
        } else if (!this.isNumber(t2)) break;
        e2 += t2;
      }
      return e2;
    }
    check() {
      let e2, t2, n2, i2 = 0, s2 = "", r2 = false;
      for (; ; ) {
        if (this.checkStart()) {
          if (r2 = true, "" != s2 && (this.r.push(s2), s2 = ""), e2 = {}, this.i += 2, i2 = this.i, !this.nop()) return false;
          if (t2 = this.getVOrC(), t2) {
            for (e2.vorc = t2; ; ) {
              if (!this.nop()) return false;
              if (n2 = this.s[this.i], ":" == n2) {
                if (!this.next()) return false;
                if (!this.nop()) return false;
                const i3 = this.getVar();
                if (null === i3) return false;
                e2.functions || (e2.functions = []);
                const s3 = { name: i3 };
                if (e2.functions.push(s3), !this.nop()) return false;
                if (n2 = this.s[this.i], "(" == n2) {
                  if (!this.next()) return false;
                  if (!this.nop()) return false;
                  if (n2 = this.s[this.i], null == n2) break;
                  if (")" == n2) {
                    if (!this.next()) return false;
                    continue;
                  }
                  for (; ; ) {
                    if (t2 = this.getVOrC(), !t2) return false;
                    if (s3.params || (s3.params = []), s3.params.push(t2), !this.nop()) return false;
                    if (n2 = this.s[this.i], null == n2) break;
                    if ("," != n2) {
                      if (")" == n2) {
                        if (!this.next()) return false;
                        if (!this.nop()) return false;
                        break;
                      }
                    } else {
                      if (!this.next()) return false;
                      if (!this.nop()) return false;
                    }
                  }
                }
                continue;
              }
              break;
            }
            if (n2 = this.s[this.i], "{" == n2) {
              if (!this.next()) return false;
              for (; ; ) {
                if (!this.nop()) return false;
                if (n2 = this.s[this.i], null == n2) break;
                if ("}" == n2) {
                  if (!this.next()) return false;
                  if (!this.nop()) return false;
                  break;
                }
                if ("," != n2) {
                  if (t2 = this.getVOrC(), !t2) return false;
                  e2.params || (e2.params = []), e2.params.push(t2);
                } else if (!this.next()) return false;
              }
            }
            if (n2 = this.s[this.i], ";" == n2) {
              if (!this.next()) return false;
              if (!this.nop()) return false;
              const t3 = this.getVar(false);
              if (null === t3) return false;
              if (!this.nop()) return false;
              if (n2 = this.s[this.i], ";" != n2) return false;
              {
                if (!this.next()) return false;
                if (!this.nop()) return false;
                const n3 = this.getVar(false);
                if (null === n3) return false;
                e2.index = { index: t3.join(""), target: n3.join("") };
              }
            }
            if (!this.nop()) return false;
            if (this.checkEnd()) this.i++, this.r.push(e2);
            else if (!this.searchFormula(i2)) return false;
          } else if (!this.searchFormula(i2)) return false;
        } else s2 += this.s[this.i];
        if (!this.next()) break;
      }
      return "" != s2 && this.r.push(s2), r2;
    }
    searchFormula(e2) {
      let t2 = this.s.substring(e2, this.i);
      for (; ; ) {
        if (this.checkEnd()) {
          this.i++, this.r.push({ formula: { code: t2, vars: this.findVars(t2) } }), t2 = "";
          break;
        }
        if (t2 += this.s[this.i], !this.next()) return false;
      }
      return true;
    }
    findVars(e2) {
      let t2 = e2.trim();
      const n2 = this.s, i2 = this.i, s2 = this.l;
      this.s = t2, this.l = t2.length, this.i = 0;
      let r2 = [], o2 = [[]];
      const l2 = (e3) => {
        o2[o2.length - 1].push(e3);
      }, a2 = (e3) => o2.some((t3) => t3.indexOf(e3) >= 0), c2 = () => {
        for (; this.i < this.l && /\s/.test(this.s[this.i]); ) this.i++;
      }, h2 = (e3) => {
        for (this.i++; this.i < this.l; ) if ("\\" === this.s[this.i]) this.i += 2;
        else {
          if (this.s[this.i] === e3) {
            this.i++;
            break;
          }
          this.i++;
        }
      }, f2 = () => {
        for (this.i++; this.i < this.l; ) if ("\\" === this.s[this.i]) this.i += 2;
        else if ("$" === this.s[this.i] && "{" === this.s[this.i + 1]) {
          this.i += 2;
          let e3 = 1;
          const t3 = this.i;
          for (; this.i < this.l && e3 > 0; ) "{" === this.s[this.i] ? e3++ : "}" === this.s[this.i] && e3--, this.i++;
          const n3 = this.s.substring(t3, this.i - 1);
          this.findVars(n3).forEach((e4) => {
            a2(e4[0]) || r2.some((t4) => t4[0] === e4[0]) || r2.push(e4);
          });
        } else {
          if ("`" === this.s[this.i]) {
            this.i++;
            break;
          }
          this.i++;
        }
      }, u2 = () => {
        const e3 = this.i, t3 = this.getVOrC();
        if (t3 && t3.va) {
          let n3 = e3 - 1;
          for (; n3 >= 0 && /\s/.test(this.s[n3]); ) n3--;
          return n3 >= 0 && "." === this.s[n3] ? null : t3.va;
        }
        return null;
      }, d2 = () => {
        if ("(" !== this.s[this.i]) return false;
        const e3 = this.i;
        let t3 = 0;
        for (; this.i < this.l; ) {
          const e4 = this.s[this.i];
          if ("(" === e4) t3++;
          else if (")" === e4 && (t3--, 0 === t3)) break;
          this.i++;
        }
        const n3 = this.s.substring(e3 + 1, this.i);
        return this.i++, c2(), "=>" === this.s.substr(this.i, 2) && (n3.split(",").forEach((e4) => {
          const t4 = e4.trim();
          t4 && l2(t4);
        }), this.i += 2, true);
      }, p2 = () => {
        if ("catch" === this.s.substr(this.i, 5)) {
          if (this.i += 5, c2(), "(" === this.s[this.i]) {
            this.i++, c2();
            const e3 = u2();
            for (e3 && l2(e3[0]); this.i < this.l && ")" !== this.s[this.i]; ) this.i++;
            ")" === this.s[this.i] && this.i++;
          }
          return true;
        }
        return false;
      }, g2 = () => {
        if ("function" === this.s.substr(this.i, 8)) {
          this.i += 8, c2();
          const e3 = u2();
          if (e3 && l2(e3[0]), c2(), "(" === this.s[this.i]) {
            this.i++;
            let e4 = "";
            for (; this.i < this.l && ")" !== this.s[this.i]; ) e4 += this.s[this.i], this.i++;
            ")" === this.s[this.i] && this.i++, e4.split(",").forEach((e5) => {
              const t3 = e5.trim();
              t3 && l2(t3);
            });
          }
          return true;
        }
        return false;
      }, y2 = ["const", "var", "let", "function"];
      for (; this.i < this.l && (c2(), !(this.i >= this.l)); ) {
        const e3 = this.s[this.i];
        if ("catch" === this.s.substr(this.i, 5)) {
          p2();
          continue;
        }
        if ("function" === this.s.substr(this.i, 8)) {
          g2();
          continue;
        }
        if ("/" === e3 && "/" === this.s[this.i + 1]) {
          for (this.i += 2; this.i < this.l && "\n" !== this.s[this.i]; ) this.i++;
          continue;
        }
        if ("/" === e3 && "*" === this.s[this.i + 1]) {
          for (this.i += 2; this.i < this.l && ("*" !== this.s[this.i] || "/" !== this.s[this.i + 1]); ) this.i++;
          this.i += 2;
          continue;
        }
        if ('"' === e3 || "'" === e3) {
          h2(e3);
          continue;
        }
        if ("`" === e3) {
          f2();
          continue;
        }
        if ("{" === e3) {
          o2.push([]), this.i++;
          continue;
        }
        if ("}" === e3) {
          o2.pop(), this.i++;
          continue;
        }
        if ("(" === e3) {
          const e4 = this.i;
          if (d2()) continue;
          this.i = e4;
        }
        const t3 = u2();
        if (t3) {
          if (y2.indexOf(t3[0]) >= 0) {
            c2();
            const e5 = u2();
            e5 && l2(e5[0]);
            continue;
          }
          if (void 0 !== m[t3[0]]) continue;
          if (ue.indexOf(t3[0]) >= 0) continue;
          let e4 = this.i;
          for (; e4 < this.l && /\s/.test(this.s[e4]); ) e4++;
          if (":" === this.s[e4]) continue;
          if (a2(t3[0])) continue;
          r2.some((e5) => e5[0] === t3[0]) || r2.push(t3);
          continue;
        }
        this.i++;
      }
      return this.s = n2, this.i = i2, this.l = s2, r2;
    }
  };
  var pe;
  var ge = { allowFormulas: true, allowEvents: true, allowInnerHTML: true };
  function me(e2, t2, n2) {
    return `g('${e2}',${t2 ?? "null"},${n2 ?? "null"},o)`;
  }
  function ye(e2, t2, n2) {
    if (n2) {
      let i2 = [];
      return n2.forEach((e3) => {
        i2.push("const " + e3.var + "=" + e3.gen + ";");
      }), "((o)=>{" + i2.join("") + "return " + e2 + "})" + (t2 ? "" : "(o)");
    }
    return "((o)=>" + e2 + ")" + (t2 ? "" : "(o)");
  }
  function ve(e2, t2, n2, i2) {
    let s2 = be([e2], true);
    return s2 = s2.substring(0, s2.length - 1), s2 = s2 + ',"gen":' + (n2 || t2) + (i2 || "") + "}", s2;
  }
  function ke(e2, t2, n2, i2, s2, r2) {
    return e2.uid = t2, n2 ? ("" != i2 && (i2 += ","), i2 += ve(e2, t2, void 0, r2)) : ("" != s2 && (s2 += ","), s2 += ve(e2, t2, void 0, r2)), { jsonAttr2: i2, jsonAttr: s2 };
  }
  function Ee(e2) {
    return !(!e2 || !e2.formula);
  }
  function we(n2, i2, s2, r2) {
    let o2 = null;
    switch (i2) {
      case "g-is":
        o2 = o2 || 12;
      case "g-binds":
        o2 = o2 || 11;
      case "g-bind":
        o2 = o2 || 10;
      case "g-attr":
        o2 = o2 || 7;
      case "g-if":
        o2 = o2 || 1;
      case "g-notif":
        o2 = o2 || 2;
      case "g-switch":
        o2 = o2 || 3;
      case "g-case":
        o2 = o2 || 4;
      case "g-for":
        o2 = o2 || 5;
      case "g-inner":
        if (!r2.allowInnerHTML) throw new Error("Unsafe directive blocked in safe mode: g-inner");
        if (o2 = o2 || 9, pe.setString(`{{${s2}}}`), pe.check()) {
          const e2 = pe.getSingleResult();
          if (Ee(e2) && !r2.allowFormulas) throw new Error("Unsafe formula blocked in safe mode");
          const t2 = { type: o2, link: e2 };
          return 12 === o2 ? n2.unshift(t2) : n2.push(t2), true;
        }
        break;
      case "g-tpl":
        return o2 = o2 || 13, n2.push({ type: o2, link: { vorc: { ct: s2 } } }), true;
      case "g-style":
        s2.includes("{{") || (s2 = `{{${s2}}}`);
      case "style":
        let l2 = "";
        if (pe.setString(s2), pe.check()) {
          let i3 = pe.getResult();
          if (i3 && i3.length) {
            if (1 == i3.length) {
              if (Ee(i3[0]) && !r2.allowFormulas) throw new Error("Unsafe formula blocked in safe mode");
              return n2.push({ type: 8, prop: "cssText", link: i3[0] }), true;
            }
            const o3 = e(s2);
            for (const [e2, s3] of Object.entries(o3)) if (pe.setString(s3), pe.check()) {
              if (i3 = pe.getSingleResult(), Ee(i3) && !r2.allowFormulas) throw new Error("Unsafe formula blocked in safe mode");
              n2.push({ type: 8, prop: e2, link: i3 });
            } else l2 += l2 ? ";" : "", l2 += `${t(e2)}:${s3}`;
            return "" != l2 && n2.push(["style", l2]), true;
          }
        }
        break;
      default:
        if (pe.setString(s2), pe.check()) {
          const e2 = pe.getResult();
          if (e2 && 1 == e2.length) {
            const t2 = i2.startsWith("on");
            if (t2 && !r2.allowEvents) throw new Error(`Unsafe event blocked in safe mode: ${i2}`);
            if (Ee(e2[0]) && !r2.allowFormulas) throw new Error("Unsafe formula blocked in safe mode");
            const s3 = { type: t2 ? 6 : 7, prop: t2 ? i2.substring(2) : i2, link: e2[0] };
            return n2.push(s3), true;
          }
        }
    }
    return false;
  }
  function be(e2, t2 = false) {
    const n2 = e2.map((e3) => {
      if (Array.isArray(e3) || "string" == typeof e3) return JSON.stringify(e3);
      {
        const t3 = e3;
        if (t3.link?.formula) {
          return `{${Object.entries(t3).map(([e4, t4]) => {
            if ("link" === e4) {
              return `"${e4}":{${Object.entries(t4).map(([e5, t5]) => {
                if ("formula" === e5) {
                  const { vars: n3, code: i2 } = t5;
                  if (null != i2) {
                    const t6 = n3?.map((e6) => e6[0]).join(",") || "", s2 = /\bawait\b/.test(i2) ? " async " : "", r2 = `{${i2}}`;
                    return `"${e5}":{"vars":${JSON.stringify(n3)},"fnc":${s2}function(${t6})${r2}}`;
                  }
                  s("formula without code");
                }
                return `"${e5}":${JSON.stringify(t5)}`;
              }).join(",")}}`;
            }
            return `"${e4}":${JSON.stringify(t4)}`;
          }).join(",")}}`;
        }
        return JSON.stringify(e3);
      }
    });
    return t2 ? n2.join(",") : `[${n2.join(",")}]`;
  }
  var Ce = 0;
  var xe = 0;
  function Ae() {
    xe >= 60466176 && (xe = 0, Ce++, Ce >= 26 && (Ce = 0));
    const e2 = String.fromCharCode(97 + Ce), t2 = xe.toString(36).padStart(5, "0");
    return xe++, e2 + t2;
  }
  function Re(e2, t2, n2, i2, s2 = ge) {
    null == pe && (pe = new de());
    let r2, o2, l2, a2, c2, h2, f2, u2, d2, p2, g2, y2, v2, k2, E2, w2, b2 = /* @__PURE__ */ (function() {
      const e3 = [];
      return { add(t3) {
        e3.push(t3);
      }, addComma(t3, n3) {
        if (e3.length) {
          let t4 = true;
          const i3 = e3[e3.length - 1];
          n3?.includes(i3) && (t4 = false), t4 && e3.push(",");
        }
        e3.push(t3);
      }, addCommaOnly(t3) {
        if (e3.length) {
          let n3 = true;
          const i3 = e3[e3.length - 1];
          t3?.includes(i3) && (n3 = false), n3 && e3.push(",");
        }
      }, toString: (t3 = "", n3 = "") => t3 + e3.join("") + n3 };
    })();
    for (var C2 = 0, x2 = e2.length; C2 < x2; C2++) {
      var A2 = e2[C2];
      switch (r2 = o2 = l2 = a2 = c2 = h2 = null, p2 = g2 = y2 = v2 = k2 = "", A2.nodeType) {
        case 1:
          if ("script" == A2.nodeName.toLowerCase()) {
            b2.addComma(me(A2.nodeName, JSON.stringify(A2.textContent)), ["["]);
            continue;
          }
          f2 = A2, E2 = [];
          for (let e3 = 0, t3 = f2.attributes.length, n3 = f2.attributes; e3 < t3; e3++) {
            const t4 = n3.item(e3);
            if (t4) if (we(E2, t4.name, t4.value, s2)) {
              if (E2.length) {
                const e4 = E2[E2.length - 1];
                if (e4) {
                  if (12 == e4.type && (c2 = e4, E2.pop()), 1 != e4.type && 2 != e4.type || (a2 = e4, E2.pop()), 5 == e4.type && (r2 = e4, E2.pop()), 3 == e4.type && (o2 = e4, E2.pop()), 4 == e4.type) {
                    if (!i2) throw new Error("not switch");
                    i2.case || (i2.case = []), i2.case.push(e4), l2 = e4, l2.index = i2.case.length - 1, E2.pop();
                  }
                  13 == e4.type && (h2 = e4, E2.pop());
                }
              }
            } else E2.push([t4.name, t4.value]);
          }
          if (r2 && l2) throw new Error("not for and case " + Array.from(f2.attributes, (e3) => e3.name + '="' + e3.value + '"').join(" "));
          if (a2 && l2) throw new Error("not if and case " + Array.from(f2.attributes, (e3) => e3.name + '="' + e3.value + '"').join(" "));
          if (c2 && (l2 || o2 || h2)) throw new Error("not is and ( case or switch ot tpl ) " + Array.from(f2.attributes, (e3) => e3.name + "=" + e3.value + '"').join(" "));
          if (b2.addCommaOnly(["["]), h2) {
            const e3 = h2.link.vorc.ct, n3 = m.document.getElementById(e3);
            n3 ? (u2 = "template" == f2.nodeName.toLowerCase() ? t2 : f2, d2 = "template" == n3.nodeName.toLowerCase() ? n3.content.childNodes : [n3], p2 = Re(d2, u2, true, o2, s2)) : console.error("template " + e3 + " undefined.");
          } else u2 = "template" == f2.nodeName.toLowerCase() ? f2.content : f2, d2 = u2.childNodes, p2 = Re(d2, u2, true, o2, s2);
          if (c2 || a2 || l2 || r2 || o2) {
            w2 = Ae(), g2 = "", y2 = "";
            const e3 = [];
            if (k2 = be(E2), c2 && (c2.attrs = E2, { jsonAttr2: y2, jsonAttr: g2 } = ke(c2, w2, r2, y2, g2)), a2 && ({ jsonAttr2: y2, jsonAttr: g2 } = ke(a2, w2, r2, y2, g2)), o2) {
              o2.uid = w2;
              const t3 = o2.case;
              delete o2.case, v2 = "", t3 && t3.forEach((t4) => {
                if (t4.common && (t4.common.forEach((t5) => e3.push(t5)), delete t4.common), t4.gen) {
                  const e4 = t4.gen;
                  delete t4.gen, "" != v2 && (v2 += ","), v2 += ve(t4, null, e4);
                }
              }), { jsonAttr2: y2, jsonAttr: g2 } = ke(o2, w2, r2, y2, g2, ',"case":[' + v2 + "]");
            }
            h2 ? "template" == f2.nodeName.toLowerCase() ? e3.push({ var: w2, gen: p2 }) : e3.push({ var: w2, gen: ye(me(f2.nodeName, k2, p2), true) }) : e3.push({ var: w2, gen: c2 ? "null" : "template" == f2.nodeName.toLowerCase() ? p2 : ye(me(f2.nodeName, k2, p2), true) }), l2 ? (l2.uid = w2, l2.gen = w2, l2.common = e3, b2.add(ye(me("#comment", "[" + JSON.stringify(w2) + "," + g2 + "]"), t2))) : r2 ? (a2 || c2 || o2 ? (r2.uid = Ae(), "" != g2 && (g2 += ","), g2 += ve(r2, r2.uid), e3.push({ var: r2.uid, gen: ye(me("#comment", "[" + JSON.stringify(w2) + "," + y2 + "]"), true) })) : (r2.uid = w2, "" != g2 && (g2 += ","), g2 += ve(r2, w2)), b2.add(ye(me("#comment", "[" + JSON.stringify(r2.uid) + "," + g2 + "]"), t2, e3))) : b2.add(ye(me("#comment", "[" + JSON.stringify(w2) + "," + g2 + "]"), t2, e3));
          } else h2 && "template" == f2.nodeName.toLowerCase() ? b2.add(p2) : b2.add(ye(me(f2.nodeName, be(E2), p2), t2));
          break;
        case 3:
          {
            let e3 = true;
            if (A2.nodeValue && (pe.setString(A2.nodeValue), pe.check())) {
              e3 = false;
              const t3 = pe.getResult();
              t3 && t3.length && t3.forEach((e4) => {
                if (b2.addCommaOnly(["["]), "string" == typeof e4) b2.add(me(A2.nodeName, JSON.stringify(e4)));
                else {
                  if (Ee(e4) && !s2.allowFormulas) throw new Error("Unsafe formula blocked in safe mode");
                  b2.add(me(A2.nodeName, be([{ type: 0, prop: "textContent", link: e4 }])));
                }
              });
            }
            e3 && b2.addComma(me(A2.nodeName, JSON.stringify(A2.nodeValue)), ["["]);
          }
          break;
        case 6:
          b2.addComma(me(A2.nodeName, JSON.stringify(A2.nodeValue)), ["["]);
      }
    }
    const R2 = b2.toString(false !== n2 ? "[" : "", false !== n2 ? "]" : "");
    return void 0 === t2 ? "(o)=>" + R2 : R2;
  }
  var Ne = { GTpl: fe, GAddTo: S, GInsertAfterTo: O, GInsertBeforeTo: B, GregisterDirective: M, GGenerator: P, GProxy: f, unGProxy: u, jit: { GCompile: T, GCompileSafe: j, GCode: function(e2) {
    const t2 = { ...ge };
    if ("string" == typeof e2) {
      return Re(new DOMParser().parseFromString(e2.trim(), "text/html").body.childNodes, void 0, void 0, void 0, t2);
    }
    return Re(e2 instanceof Node ? [e2] : e2, void 0, void 0, void 0, t2);
  }, GCodeSafe: function(e2, t2) {
    const n2 = { allowFormulas: false, allowEvents: false, allowInnerHTML: false, ...t2 };
    if ("string" == typeof e2) {
      return Re(new DOMParser().parseFromString(e2.trim(), "text/html").body.childNodes, void 0, void 0, void 0, n2);
    }
    return Re(e2 instanceof Node ? [e2] : e2, void 0, void 0, void 0, n2);
  } }, utils: { log: s, stack: r, css2obj: e, style2css: t, globalObject: m, passiveSupported: v, isGProxy: h, toRaw: d, PROXYTARGET: l, ISPROXY: o } };

  // src/decorators/runtime-helpers.ts
  var SHEET_CACHE = /* @__PURE__ */ new WeakMap();
  function applyComponentStyles(cmp, meta, mode) {
    const styleMode = mode ?? meta.styleMode;
    const sr = cmp.$host;
    const canAdopt = !!(sr && "adoptedStyleSheets" in sr) && meta.stylesInline.length > 0;
    if (styleMode !== "lazy" && canAdopt) {
      const key = cmp.constructor;
      let sheet = SHEET_CACHE.get(key);
      if (!sheet) {
        sheet = new CSSStyleSheet();
        sheet.replaceSync(meta.stylesInline.join("\n"));
        SHEET_CACHE.set(key, sheet);
      }
      const current = [...sr.adoptedStyleSheets];
      if (!current.includes(sheet)) {
        sr.adoptedStyleSheets = [...current, sheet];
      }
    } else {
      switch (styleMode) {
        case "inline":
        case "file": {
          for (const css of meta.stylesInline) {
            const style = document.createElement("style");
            style.textContent = css;
            cmp.$host.appendChild(style);
          }
          for (const href of meta.styleUrls) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = href;
            cmp.$host.appendChild(link);
          }
          break;
        }
        case "lazy":
          break;
      }
    }
  }
  async function ensureCompiledTemplate(classMeta) {
    if (classMeta.templateFactory) return;
    if (classMeta.compilePromise) {
      await classMeta.compilePromise;
      return;
    }
    classMeta.compilePromise = (async () => {
      try {
        let html = classMeta.templateHtml ?? null;
        if (html == null) {
          const response = await fetch(classMeta.templateUrl);
          html = await response.text();
        }
        const compiled = Ne.jit.GCode(html);
        classMeta.templateFactory = Ne.jit.GCompile(compiled);
      } catch (err) {
        console.error("[GTPL compile error]", { url: classMeta.templateUrl, err });
        throw err;
      } finally {
        classMeta.compilePromise = null;
      }
    })();
    await classMeta.compilePromise;
  }
  function instantiateTemplate(controller, generator) {
    const options = { root: controller, generator };
    const gtplobj = new Ne.GTpl(options);
    return gtplobj;
  }

  // src/decorators/component.decorator.ts
  var COMPONENT_REGISTRY = /* @__PURE__ */ new Map();
  function getRegisteredComponent(name) {
    return COMPONENT_REGISTRY.get(name);
  }
  function toKebabCase(x2) {
    return x2.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();
  }
  function defineHidden(target, key, value, opts) {
    Object.defineProperty(target, key, {
      value,
      enumerable: opts?.enumerable ?? false,
      writable: opts?.writable ?? false,
      configurable: opts?.configurable ?? false
    });
  }
  var isLikelyHtml = (s2) => !!s2 && /^\s*</.test(s2) && s2.includes(">");
  var COMP_CTRL = /* @__PURE__ */ Symbol("COMP_CTRL");
  var COMP_FLAGS = /* @__PURE__ */ Symbol("COMP_FLAGS");
  var COMP_GTPL = /* @__PURE__ */ Symbol("COMP_GTPL");
  var COMP_MOUNT = /* @__PURE__ */ Symbol("COMP_MOUNT");
  var CLASS_META = /* @__PURE__ */ Symbol("CLASS_META");
  var HOST_CREATE = /* @__PURE__ */ Symbol("HOST_CREATE");
  var getCtrl = (host) => host[COMP_CTRL];
  var getMeta = (ctor) => ctor[CLASS_META];
  function getControllerFromComponent(component) {
    return component[COMP_CTRL];
  }
  function isHostCreated(ele) {
    return ele[HOST_CREATE] === true ? true : false;
  }
  function initComponentHost(host, ControllerClass, baseMeta, useWebComponent, ...args) {
    const ctrl = new ControllerClass(...args);
    defineHidden(host, COMP_CTRL, ctrl);
    defineHidden(ctrl, "$el", host);
    const flags = { firstRender: true, stylesApplied: false, destroyed: false };
    defineHidden(host, COMP_FLAGS, flags);
    defineHidden(ctrl, "destroy", function() {
      ctrl.onDestroy?.();
      flags.destroyed = true;
      try {
        host[COMP_GTPL]?.destroy?.();
      } catch (ex) {
        console.error(ex);
      }
      flags.firstRender = false;
      if (!useWebComponent)
        host.innerHTML = "";
      if (useWebComponent || host[HOST_CREATE])
        host.remove();
      host[COMP_GTPL] = null;
    }.bind(ctrl));
    ctrl.onConstruct?.(...args);
    const ctor = useWebComponent ? host.constructor : ControllerClass.__gcomponent__;
    if (!Object.prototype.hasOwnProperty.call(ctor, CLASS_META)) {
      defineHidden(ctor, CLASS_META, { ...baseMeta });
    }
    const classMeta = getMeta(ctor);
    if (useWebComponent) {
      if (!classMeta.shadow) {
        host.$host = host;
      } else if (classMeta.shadow === true) {
        host.$host = host.attachShadow({ mode: "open" });
      } else {
        host.$host = host.attachShadow(classMeta.shadow);
      }
    } else {
      host.$host = host;
    }
    const mountTemplateIfReady = () => {
      if (!flags.firstRender) return;
      if (!host[COMP_GTPL]) return;
      if (useWebComponent && !classMeta.shadow && !host.isConnected) return;
      flags.firstRender = false;
      host[COMP_GTPL].addTo(host.$host);
      ctrl.onTemplateReady?.();
    };
    defineHidden(host, COMP_MOUNT, mountTemplateIfReady);
    const loadTemplate = () => {
      const gtpl = instantiateTemplate(ctrl, classMeta.templateFactory);
      defineHidden(host, COMP_GTPL, gtpl, { writable: true });
      ctrl.onInit?.();
      mountTemplateIfReady();
    };
    if (classMeta.templateFactory) {
      loadTemplate();
    } else {
      ensureCompiledTemplate(classMeta).then(() => {
        if (!flags.destroyed) loadTemplate();
      });
    }
    const finishSetup = () => {
      if (!flags.stylesApplied) {
        flags.stylesApplied = true;
        if (classMeta.styleMode !== "lazy") {
          applyComponentStyles(host, classMeta);
        }
      }
      if (flags.firstRender) {
        mountTemplateIfReady();
      }
    };
    Promise.resolve().then(finishSetup);
    return host;
  }
  var GWatcher = class extends HTMLElement {
    constructor(ctrl) {
      super();
      this.ctrl = ctrl;
      this.style.display = "none";
      this.style.position = "absolute";
    }
    connectedCallback() {
      if (this.ctrl) {
        this.ctrl.onConnect?.(this);
        return;
      }
      const host = this.parentNode;
      if (!host) return;
      const ctrl = getControllerFromComponent(host);
      ctrl?.onConnect?.();
    }
    disconnectedCallback() {
      if (this.ctrl) {
        this.ctrl.onDisconnect?.(this);
        return;
      }
      const host = this.parentNode;
      if (!host) return;
      const ctrl = getControllerFromComponent(host);
      ctrl?.onDisconnect?.();
    }
  };
  if (!customElements.get("g-watcher")) {
    customElements.define("g-watcher", GWatcher);
  }
  function Component(config) {
    return function(ControllerClass) {
      const options = config;
      const asWebComponent = options.asWebComponent != null ? options.asWebComponent : true;
      const inferredTag = toKebabCase(ControllerClass.name);
      const tagName = options.tag ?? inferredTag;
      if (!tagName.includes("-")) {
        throw new Error(`Custom element name "${tagName}" must contain a hyphen (-). Use 'tag' in @Component.`);
      }
      let shadowOpt = false;
      if (options.shadow === true) shadowOpt = { mode: "open" };
      else if (options.shadow === false) shadowOpt = false;
      else if (typeof options.shadow === "object") shadowOpt = options.shadow;
      const aotTemplate = ControllerClass.__gtemplate__ ?? null;
      const styleMode = options.styleMode ?? "global";
      let styleUrls = [];
      let stylesInline = [];
      let templateHtml = null;
      let templateUrl = null;
      if (aotTemplate) {
        styleUrls = ControllerClass.__styleUrls__ ?? [];
        stylesInline = ControllerClass.__stylesInline__ ?? [];
      } else {
        const tStr = typeof options.template === "string" ? options.template : null;
        const tObj = typeof options.template === "object" && options.template ? options.template.html ?? null : null;
        if (tObj != null) templateHtml = tObj;
        else if (tStr != null) isLikelyHtml(tStr) ? templateHtml = tStr : templateUrl = tStr;
        if (options.style) {
          const arr = Array.isArray(options.style) ? options.style : [options.style];
          for (const s2 of arr) {
            const t2 = s2.trim();
            if (/\.(scss|sass)$/i.test(t2)) continue;
            if (/\.css$/i.test(t2)) styleUrls.push(t2);
            else stylesInline.push(s2);
          }
        }
      }
      const baseMeta = {
        templateHtml,
        templateUrl,
        templateFactory: aotTemplate,
        styleMode,
        styleUrls,
        stylesInline,
        shadow: shadowOpt,
        compilePromise: null,
        asWebComponent
      };
      let GeneratedComponent = null;
      if (asWebComponent) {
        GeneratedComponent = class extends HTMLElement {
          constructor(...args) {
            super();
            initComponentHost(this, ControllerClass, baseMeta, true, ...args);
          }
          connectedCallback() {
            this[COMP_MOUNT]?.();
            getCtrl(this).onConnect?.();
          }
          disconnectedCallback() {
            getCtrl(this)?.onDisconnect?.();
          }
        };
        if (!customElements.get(tagName))
          customElements.define(tagName, GeneratedComponent);
      } else {
        GeneratedComponent = class {
          constructor(ele, ...args) {
            if (!ele) {
              ele = Ne.utils.globalObject.document.createElement("div");
              ele.setAttribute("g-component", tagName);
              defineHidden(ele, HOST_CREATE, true);
            }
            ele?.appendChild(new GWatcher(this));
            return initComponentHost(ele, ControllerClass, baseMeta, false, ...args);
          }
          connectedCallback() {
            getCtrl(this).onConnect?.();
          }
          disconnectedCallback() {
            getCtrl(this)?.onDisconnect?.();
          }
        };
      }
      defineHidden(ControllerClass, "__gcomponent__", GeneratedComponent);
      if (!COMPONENT_REGISTRY.has(tagName)) {
        COMPONENT_REGISTRY.set(tagName, {
          asWebComponent,
          ControllerClass,
          ComponentClass: GeneratedComponent
        });
      } else {
        console.warn(`Component with name "${tagName}" is already defined.`);
      }
      return ControllerClass;
    };
  }

  // src/core/GTplComponentBase.ts
  var GTplComponentBase = class {
    onConstruct() {
    }
    onInit() {
    }
    onTemplateReady() {
    }
    onConnect() {
    }
    onDisconnect() {
    }
    onDestroy() {
    }
  };

  // src/core/GEvents.ts
  var GEvents = class {
    constructor() {
      this.namespaces = /* @__PURE__ */ new Map();
    }
    getNamespace(ns = "default") {
      if (!this.namespaces.has(ns)) {
        this.namespaces.set(ns, /* @__PURE__ */ new Map());
      }
      return this.namespaces.get(ns);
    }
    /**
     * Registra un listener (interno). Usado por on() y once().
     */
    addListener(event, handler, options = {}) {
      if (event === "*" && !options.namespace) {
        const global2 = this.getNamespace("__GLOBAL__");
        const listeners2 = global2.get(event) || [];
        listeners2.push({ handler, once: options.once, priority: options.priority ?? 0 });
        listeners2.sort((a2, b2) => (b2.priority ?? 0) - (a2.priority ?? 0));
        global2.set(event, listeners2);
        return handler;
      }
      const ns = this.getNamespace(options.namespace);
      const listeners = ns.get(event) || [];
      listeners.push({ handler, once: options.once, priority: options.priority ?? 0 });
      listeners.sort((a2, b2) => (b2.priority ?? 0) - (a2.priority ?? 0));
      ns.set(event, listeners);
      return handler;
    }
    /**
     * Suscribe un listener a un evento.
     */
    on(event, handler, options = {}) {
      return this.addListener(event, handler, options);
    }
    /**
     * Suscribe un listener que se ejecutará una sola vez.
     */
    once(event, handler, options = {}) {
      return this.addListener(event, handler, { ...options, once: true });
    }
    /**
     * Suscribe un listener y devuelve un objeto con `.off()` para cancelarlo fácilmente.
     * 
     * @example
     * const sub = bus.subscribe("update", data => console.log(data));
     * sub.off(); // 👈 elimina el listener
     */
    subscribe(event, handler, options) {
      this.on(event, handler, options);
      return {
        off: () => this.off(event, handler, options?.namespace)
      };
    }
    off(event, handler, namespace = "default") {
      const ns = this.getNamespace(namespace);
      const handlers = ns.get(event);
      if (!handlers) return;
      ns.set(event, handlers.filter((l2) => l2.handler !== handler));
    }
    offAll(event, namespace = "default") {
      if (event) {
        this.getNamespace(namespace).delete(event);
      } else {
        this.removeAllListeners(namespace);
      }
    }
    /**
     * Emite un evento (ejecuta todos los listeners).
     * 
     * @param event Nombre del evento.
     * @param payload Datos asociados al evento.
     * @param namespace Namespace opcional (por defecto "default").
     * @param options 
     *    - sequential: fuerza la ejecución en orden (por defecto es paralelo).
     */
    async emit(event, payload, namespace = "default", options) {
      const ns = this.getNamespace(namespace);
      const handlers = ns.get(event);
      const wildcardLocal = ns.get("*");
      const globalWildcardListeners = this.namespaces.get("__GLOBAL__")?.get("*") ?? [];
      const allHandlers = [
        ...handlers ?? [],
        ...wildcardLocal ?? [],
        ...globalWildcardListeners ?? []
      ];
      if (allHandlers.length === 0) return;
      const runHandler = async (listener, isWildcard = false) => {
        try {
          if (isWildcard) {
            const handler = listener.handler;
            await handler({ event, payload, namespace });
          } else {
            const handler = listener.handler;
            await handler(payload);
          }
        } catch (err) {
          console.error(`[GEvents] Error en handler "${String(event)}" (${namespace}):`, err);
        }
        if (listener.once) {
          const targetNs = event === "*" && !namespace ? "__GLOBAL__" : namespace;
          this.off(event, listener.handler, targetNs);
        }
      };
      const execute = async (listener) => {
        const isWildcard = (wildcardLocal?.includes(listener) ?? false) || (globalWildcardListeners?.includes(listener) ?? false);
        await runHandler(listener, isWildcard);
      };
      if (!options?.sequential) {
        await Promise.all(allHandlers.map(execute));
      } else {
        for (const l2 of allHandlers) await execute(l2);
      }
    }
    waitFor(event, timeoutMs, namespace = "default") {
      return new Promise((resolve, reject) => {
        const handler = (payload) => {
          clearTimeout(timer);
          this.off(event, handler, namespace);
          resolve(payload);
        };
        let timer;
        if (timeoutMs) {
          timer = setTimeout(() => {
            this.off(event, handler, namespace);
            reject(new Error(`Timeout esperando evento "${String(event)}" (${namespace})`));
          }, timeoutMs);
        }
        this.on(event, handler, { namespace });
      });
    }
    /**
    * Espera a que un evento se emita y **todos los listeners terminen** (incluidos los async).
    * 
    * @param event Nombre del evento a esperar.
    * @param timeoutMs Tiempo máximo de espera (opcional).
    * @param namespace Namespace opcional (por defecto "default").
    * 
    * @returns Una promesa que se resuelve con el payload cuando todos los handlers hayan terminado.
    */
    waitForComplete(event, timeoutMs, namespace = "default") {
      return new Promise((resolve, reject) => {
        let timer;
        const handler = async (payload) => {
          clearTimeout(timer);
          const ns = this.getNamespace(namespace);
          const handlers = ns.get(event);
          if (handlers && handlers.length > 0) {
            try {
              await Promise.all(
                handlers.map(async (listener) => {
                  try {
                    await listener.handler(payload);
                  } catch (err) {
                    console.error(`[GEvents] Error en waitForComplete("${String(event)}"):`, err);
                  }
                })
              );
            } catch (err) {
              console.error(`[GEvents] Error ejecutando handlers en waitForComplete("${String(event)}")`, err);
            }
          }
          this.off(event, handler, namespace);
          resolve(payload);
        };
        if (timeoutMs) {
          timer = setTimeout(() => {
            this.off(event, handler, namespace);
            reject(new Error(`Timeout esperando evento completo "${String(event)}" (${namespace})`));
          }, timeoutMs);
        }
        this.on(event, handler, { namespace });
      });
    }
    removeAllListeners(namespace) {
      if (namespace) {
        this.namespaces.delete(namespace);
      } else {
        this.namespaces.clear();
      }
    }
    count(ns) {
      return [...ns.values()].reduce((acc, arr) => acc + (arr?.length ?? 0), 0);
    }
    listenerCount(namespace) {
      if (namespace) return this.count(this.namespaces.get(namespace) ?? /* @__PURE__ */ new Map());
      let total = 0;
      for (const ns of this.namespaces.values()) total += this.count(ns);
      return total;
    }
    listNamespaces() {
      return [...this.namespaces.keys()];
    }
    hasListeners(event, namespace = "default") {
      const ns = this.namespaces.get(namespace);
      return !!ns?.get(event)?.length;
    }
    getListeners(event, namespace = "default") {
      return [...this.namespaces.get(namespace)?.get(event) ?? []];
    }
  };

  // src/services/GBus.ts
  var GBus = new GEvents();

  // src/core/GRouter.ts
  var GRouter = class {
    constructor(urlconfig, opts) {
      this.urls = [];
      this.ids = /* @__PURE__ */ new Map();
      this.historyCache = /* @__PURE__ */ new Map();
      this.active = null;
      this.suppressNextHashChange = false;
      this.options = {
        mode: "hash",
        base: "",
        debug: false,
        anchorLeafRoutes: true,
        strictErrors: true
      };
      this.transientData = /* @__PURE__ */ new Map();
      if (urlconfig) this.urls = urlconfig;
      if (opts) this.setOptions(opts);
      this.loadIds(this.urls);
    }
    /** Permite actualizar opciones (ej. para pasar a history). Llama antes de loadEvents/start */
    setOptions(opts) {
      this.options = { ...this.options, ...opts, base: this.options.base };
      if (opts?.base != null) {
        this.options.base = this.normalizePath("/" + (opts.base || "") + "/");
      }
    }
    /* =======================
       Construcción de índices
       ======================= */
    log(...args) {
      if (this.options.debug) {
        console.debug("[GRouter]", ...args);
      }
    }
    normalizePath(input) {
      if (!input) return "/";
      let s2 = input.replace(/\\/g, "/");
      if (!s2.startsWith("/")) s2 = "/" + s2;
      s2 = s2.replace(/\/{2,}/g, "/");
      if (s2.length > 1 && s2.endsWith("/")) s2 = s2.slice(0, -1);
      return s2 || "/";
    }
    escapeRegexLiteral(s2) {
      return s2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    /** Calcula una "especificidad" simple: más literal y más largo = más específico */
    routeSpecificity(url) {
      const literals = url.replace(/:\??[A-Za-z0-9_]+/g, "");
      return literals.length;
    }
    /** Compila el patrón de ruta a RegExp y detecta claves y opcionales */
    compilePattern(route) {
      if (route.regexurl && route.paramKeys && route.optional) return;
      const isWildcard = route.wildcard === true || route.url.trim() === "*" || route.url.trim() === "/*";
      if (!route.wildcard && route.url.includes("*")) {
        const m2 = route.url.match(/\*([A-Za-z0-9_]+)/);
        if (m2) {
          const key = m2[1];
          route.paramKeys = [key];
          route.optional = [];
          route.regexurl = new RegExp("^" + this.escapeRegexLiteral(route.url.split("*")[0]) + "(.*)$");
          if (!route.params) route.params = {};
          route.params[key] = null;
          return;
        }
      }
      const rawPattern = this.normalizePath(isWildcard ? "/*" : route.url || "/");
      const pattern = rawPattern;
      const reToken = /:\??([A-Za-z0-9_]+)/g;
      const paramKeys = [];
      const optional = /* @__PURE__ */ new Set();
      let cursor = 0;
      let built = "";
      if (isWildcard) {
        built = ".*";
      } else {
        let m2;
        while (m2 = reToken.exec(pattern)) {
          const start = m2.index;
          const raw = m2[0];
          const name = m2[1];
          const isOptional = raw[1] === "?";
          built += this.escapeRegexLiteral(pattern.slice(cursor, start));
          paramKeys.push(name);
          if (isOptional) optional.add(name);
          let frag = route.regex?.[name] ?? "([^/]+)";
          if (isOptional && !/\?\)$/.test(frag)) {
            if (!/^\(.*\)$/.test(frag)) {
              frag = `(${frag})`;
            }
            frag = `${frag}?`;
          }
          built += frag;
          cursor = start + raw.length;
        }
        built += this.escapeRegexLiteral(pattern.slice(cursor));
      }
      const hasChildren = Array.isArray(route.childs) && route.childs.length > 0;
      const shouldAnchorLeaf = this.options.anchorLeafRoutes && !hasChildren && !isWildcard;
      const final = "^" + built + (shouldAnchorLeaf ? "$" : "");
      route.regexurl = new RegExp(final);
      route.paramKeys = paramKeys;
      route.optional = Array.from(optional);
      if (!route.params) route.params = {};
      for (const k2 of paramKeys) {
        if (!(k2 in route.params)) route.params[k2] = null;
      }
      route.url = pattern;
    }
    /** Registra rutas, compila regex y crea el índice de ids */
    loadIds(gurls, parent) {
      for (const r2 of gurls) {
        if (this.ids.has(r2.id)) throw Error(`${r2.id} exits`);
        r2.parent = parent ?? null;
        this.compilePattern(r2);
        if (r2.default) this.defaultRoute = r2;
        this.ids.set(r2.id, r2);
        this.log("route loaded:", r2.id, r2.url);
        if (Array.isArray(r2.childs) && r2.childs.length) {
          this.loadIds(r2.childs, r2);
        }
      }
    }
    /** Compatibilidad con tu API */
    prepareGURL(gurl) {
      this.compilePattern(gurl);
      return !!gurl.regexurl;
    }
    getGurlFromId(id) {
      return this.ids.get(id);
    }
    /* =======================
           Matching / middlewares
       ======================= */
    extractParams(route, matchArray) {
      const out = {};
      if (!route.paramKeys || !route.paramKeys.length) return out;
      let idx = 1;
      for (const key of route.paramKeys) {
        const val = matchArray[idx++];
        if (val != null) out[key] = val;
      }
      return out;
    }
    async runMiddlewareChain(finalRoute, match) {
      const chain = [];
      const collect = (mw) => {
        if (!mw) return;
        if (Array.isArray(mw)) chain.push(...mw);
        else chain.push(mw);
      };
      const stack = [];
      let cur = finalRoute;
      while (cur) {
        stack.unshift(cur);
        cur = cur.parent;
      }
      for (const r2 of stack) collect(r2.middleware);
      for (const mw of chain) {
        const res = await mw(match);
        if (res === false) return { ok: false };
        if (res && typeof res === "object" && "ok" in res) {
          if (!res.ok) return { ok: false, redirect: res.redirect };
        }
      }
      return { ok: true };
    }
    /** Itera rutas en orden de mayor especificidad para evitar colisiones */
    orderedRoutes(routes) {
      return [...routes].sort((a2, b2) => this.routeSpecificity(b2.url) - this.routeSpecificity(a2.url));
    }
    /** Resuelve un path (sin query), recursivo sobre childs */
    async resolvePath(path, routes, seedParams) {
      const normalRoutes = routes.filter((r2) => !r2.wildcard && r2.url !== "*" && r2.url !== "/*");
      const wildcardRoutes = routes.filter((r2) => r2.wildcard || r2.url === "*" || r2.url === "/*");
      const candidates = [...this.orderedRoutes(normalRoutes), ...wildcardRoutes];
      for (const r2 of candidates) {
        this.compilePattern(r2);
        const m2 = path.match(r2.regexurl);
        if (!m2) continue;
        const localParams = this.extractParams(r2, m2);
        const params = { ...seedParams ?? {}, ...localParams };
        let rest = path.replace(r2.regexurl, "");
        rest = this.normalizePath(rest);
        if (rest === "/") {
          const fullPath = this.buildUrlFromRouteChain(r2, params);
          const found = {
            id: r2.id,
            url: r2.url,
            fullPath,
            params,
            classRef: r2.classRef,
            default: !!r2.default,
            redirect: r2.redirect,
            gurl: r2
          };
          const mw = await this.runMiddlewareChain(r2, found);
          if (!mw.ok) {
            if (found.redirect || mw.redirect) {
              return { ...found, redirect: mw.redirect || found.redirect };
            }
            return null;
          }
          return found;
        }
        if (r2.childs && r2.childs.length) {
          const childMatch = await this.resolvePath(rest, r2.childs, params);
          if (childMatch) return childMatch;
        }
      }
      return null;
    }
    /** Compatibilidad con tu API: checkUrl(url, urls?, params?) */
    async checkUrl(url, routes, params) {
      const norm = this.normalizePath(url);
      const baseRoutes = routes ?? this.urls;
      const match = await this.resolvePath(norm, baseRoutes, params);
      return match;
    }
    /* =======================
             URL building
       ======================= */
    buildUrlFromRouteChain(route, params) {
      const chain = [];
      let cur = route;
      while (cur) {
        chain.unshift(cur);
        cur = cur.parent;
      }
      const template = chain.map((r2) => r2.url).map((u2) => u2.startsWith("/") ? u2 : "/" + u2).join("");
      return this.buildUrlFromTemplate(template, params);
    }
    buildUrlFromTemplate(templateUrl, params) {
      let url = templateUrl;
      url = url.replace(/:\??([A-Za-z0-9_]+)/g, (_m, key, offset, full) => {
        const isOptional = full[offset + 1] === "?";
        const val = params?.[key];
        if (val == null || val === "") {
          return isOptional ? "" : `:${key}`;
        }
        return String(val);
      });
      url = url.replace(/\/{2,}/g, "/");
      url = this.normalizePath(url);
      return url;
    }
    /** Compatibilidad con tu API: getUrlFromParams(id, params?) */
    getUrlFromParams(id, params) {
      const r2 = this.ids.get(id);
      if (!r2) return null;
      this.compilePattern(r2);
      const url = this.buildUrlFromRouteChain(r2, params);
      if (/:([A-Za-z0-9_]+)/.test(url)) return null;
      return url;
    }
    /* =======================
             Querystring
       ======================= */
    parseQueryString(qs) {
      if (!qs) return null;
      const sp = new URLSearchParams(qs);
      const out = {};
      sp.forEach((v2, k2) => out[k2] = v2);
      return Object.keys(out).length ? out : null;
    }
    buildQueryString(query) {
      if (!query) return "";
      const sp = new URLSearchParams();
      for (const [k2, v2] of Object.entries(query)) {
        if (v2 == null) continue;
        sp.append(k2, String(v2));
      }
      const s2 = sp.toString();
      return s2 ? `?${s2}` : "";
    }
    /* =======================
           Navegación/Historia
       ======================= */
    currentPathFromLocation() {
      if (this.options.mode === "hash") {
        const raw = window.location.hash || "";
        const part = raw.startsWith("#") ? raw.slice(1) : raw;
        const [p3] = part.split("?");
        return this.normalizePath(p3 || "/");
      }
      const full = window.location.pathname;
      const base = this.options.base || "";
      let rel = full.startsWith(base) ? full.slice(base.length) : full;
      const [p2] = rel.split("?");
      return this.normalizePath(p2 || "/");
    }
    currentQueryFromLocation() {
      const raw = window.location.href;
      const qIndex = raw.indexOf("?");
      if (qIndex === -1) return null;
      return this.parseQueryString(raw.slice(qIndex + 1));
    }
    setLocation(path, query, replace = false) {
      const qs = this.buildQueryString(query);
      if (this.options.mode === "hash") {
        const target2 = "#" + this.normalizePath(path) + qs;
        if (replace) window.location.replace(target2);
        else window.location.hash = target2;
        return;
      }
      const target = (this.options.base || "") + this.normalizePath(path) + qs;
      if (replace) window.history.replaceState({}, "", target);
      else window.history.pushState({}, "", target);
      this.onLocationChange({ synthetic: true });
    }
    /** Navegación programática (compat) */
    navigate(idOrPath, params, query) {
      if (idOrPath.startsWith("/")) {
        this.setLocation(idOrPath, query, false);
        return;
      }
      const url = this.getUrlFromParams(idOrPath, params);
      if (!url) {
        if (this.options.strictErrors) throw new Error(`No se pudo construir URL para id="${idOrPath}"`);
        return;
      }
      this.setLocation(url, query, false);
    }
    /**
     * Navega a una ruta (por id o path) adjuntando datos en memoria.
     * Los datos no van en la URL ni en sessionStorage.
     * Se mantienen hasta que el usuario recargue o cambie de ruta.
     */
    navigateWithData(idOrPath, data, params, query) {
      let path;
      if (idOrPath.startsWith("/")) {
        path = this.normalizePath(idOrPath);
      } else {
        path = this.getUrlFromParams(idOrPath, params);
        if (!path && this.options.strictErrors)
          throw new Error(`No se pudo construir URL para id="${idOrPath}"`);
      }
      if (!path) return;
      this.transientData.set(path, data);
      this.setLocation(path, query, false);
    }
    getDataForCurrent() {
      const currentPath = this.active?.fullPath ?? null;
      if (!currentPath) return null;
      return this.transientData.get(currentPath) ?? null;
    }
    getDataForMatch(match) {
      if (!match) return null;
      const path = this.normalizePath(match.fullPath);
      return this.transientData.get(path) ?? null;
    }
    /**
     * Limpia los datos asociados a una ruta (o todos).
     */
    clearData(path) {
      if (path) {
        this.transientData.delete(this.normalizePath(path));
      } else {
        this.transientData.clear();
      }
    }
    /** Replace en el historial (compat) */
    replace(idOrPath, params, query) {
      if (idOrPath.startsWith("/")) {
        this.setLocation(idOrPath, query, true);
        return;
      }
      const url = this.getUrlFromParams(idOrPath, params);
      if (!url) {
        if (this.options.strictErrors) throw new Error(`No se pudo construir URL para id="${idOrPath}"`);
        return;
      }
      this.setLocation(url, query, true);
    }
    back() {
      window.history.back();
    }
    removeListener() {
      this.cb = void 0;
    }
    setListener(cb) {
      this.cb = cb;
    }
    /** Compatibilidad con tu API: loadEvents(callback) */
    start(callback) {
      this.setListener(callback);
      this.historyCache = /* @__PURE__ */ new Map();
      if (this.options.mode === "hash") {
        if (!this.hashchangebind) this.hashchangebind = (e2) => this.hashchange(e2);
        window.removeEventListener("hashchange", this.hashchangebind);
        window.addEventListener("hashchange", this.hashchangebind, false);
      } else {
        if (!this.popstatebind) this.popstatebind = (e2) => this.onLocationChange({ synthetic: false });
        window.removeEventListener("popstate", this.popstatebind);
        window.addEventListener("popstate", this.popstatebind, false);
      }
      const path = this.currentPathFromLocation();
      const qs = this.currentQueryFromLocation();
      if (this.defaultRoute) {
        const defUrl = this.getUrlFromParams(this.defaultRoute.id);
        const isEmpty = this.options.mode === "hash" && (!window.location.hash || window.location.hash === "#" || window.location.hash === "#/") || this.options.mode === "history" && (path === "/" || path === "");
        if (isEmpty && defUrl) {
          if (defUrl !== path)
            this.setLocation(defUrl, void 0, true);
          this.onLocationChange({ synthetic: true });
          return;
        }
      }
      this.onLocationChange({ newURL: window.location.href, oldURL: "", query: qs ?? void 0 });
    }
    /** Compatibilidad con tu API (sólo en modo hash) */
    async hashchange(event) {
      if (this.suppressNextHashChange) {
        this.suppressNextHashChange = false;
        return;
      }
      const newUrlStr = event?.newURL || window.location.href;
      const oldUrlStr = event?.oldURL || "";
      await this.onLocationChange({ newURL: newUrlStr, oldURL: oldUrlStr });
    }
    async onLocationChange(ev) {
      const path = this.currentPathFromLocation();
      const query = ev.query ?? this.currentQueryFromLocation() ?? null;
      const isHistory = this.options.mode === "history";
      const isHash = this.options.mode === "hash";
      const base = this.options.base;
      const prev = this.active;
      let match = this.historyCache.get(path) || null;
      if (!match) {
        const res = await this.resolvePath(path, this.urls);
        if (res) {
          if (query) res.query = { ...query };
          else delete res.query;
          const redirectTo = res.redirect;
          if (redirectTo) {
            this.setLocation(redirectTo, void 0, false);
            return;
          }
          if (this.beforeChange) {
            const ok = await this.beforeChange(prev ?? null, res);
            if (ok === false) {
              this.log("Navigation cancelled by beforeChange");
              if (this.options.mode === "history" && prev) {
                const prevUrl = base + prev.fullPath + this.buildQueryString(prev.query);
                window.history.replaceState({}, "", prevUrl);
                this.active = prev;
                return;
              }
              if (this.options.mode === "hash" && prev) {
                this.suppressNextHashChange = true;
                this.setLocation(prev.fullPath, prev.query, true);
              }
              return;
            }
          }
          const viewRoute = res;
          this.active = viewRoute;
          const cacheKey = viewRoute.fullPath;
          this.historyCache.set(cacheKey, viewRoute);
          try {
            this.cb?.("new", this.active, prev ?? null);
          } catch (e2) {
            this.log("Callback error:", e2);
          }
          if (this.afterChange) {
            try {
              await this.afterChange(prev ?? null, this.active);
            } catch (e2) {
              this.log("afterChange error:", e2);
            }
          }
          this.log("route new:", res);
          return;
        } else {
          this.active = null;
          try {
            this.cb?.("notfound", null, prev ?? null);
          } catch (e2) {
            this.log("Callback error:", e2);
          }
          this.log("route notfound:", path);
          return;
        }
      } else {
        if (query) match.query = { ...query };
        else delete match.query;
        const routeDef = this.ids.get(match.id);
        const mw = await this.runMiddlewareChain(routeDef, match);
        if (!mw.ok) {
          const redirectTo = match.redirect || mw.redirect;
          if (redirectTo) {
            this.setLocation(redirectTo, void 0, false);
            return;
          }
          this.active = null;
          try {
            this.cb?.("notfound", null, prev ?? null);
          } catch (e2) {
            this.log("Callback error:", e2);
          }
          return;
        }
        if (this.beforeChange) {
          const ok = await this.beforeChange(prev ?? null, match);
          if (ok === false) {
            this.log("Navigation cancelled by beforeChange");
            if (this.options.mode === "history" && prev) {
              const prevUrl = base + prev.fullPath + this.buildQueryString(prev.query);
              window.history.replaceState({}, "", prevUrl);
              this.active = prev;
              return;
            }
            if (this.options.mode === "hash" && prev) {
              this.suppressNextHashChange = true;
              this.setLocation(prev.fullPath, prev.query, true);
            }
            return;
          }
        }
        this.active = match;
        try {
          this.cb?.("history", this.active, prev ?? null);
        } catch (e2) {
          this.log("Callback error:", e2);
        }
        if (this.afterChange) {
          try {
            await this.afterChange(prev ?? null, this.active);
          } catch (e2) {
            this.log("afterChange error:", e2);
          }
        }
        this.log("route history:", match);
        return;
      }
    }
    /** Compatibilidad con tu API: limpia toda la caché (y opcionalmente fija active) */
    cleanHist(gurl) {
      this.historyCache = /* @__PURE__ */ new Map();
      if (gurl) {
        const full = this.buildUrlFromRouteChain(gurl);
        this.active = {
          id: gurl.id,
          url: gurl.url,
          fullPath: full,
          params: {},
          classRef: gurl.classRef,
          default: !!gurl.default,
          redirect: gurl.redirect
        };
        this.historyCache.set(full, this.active);
      }
    }
    /** Compatibilidad con tu API: elimina de la caché según objeto asociado */
    removeHist(gurldel) {
      let toRemove = null;
      for (const [url, m2] of this.historyCache) {
        if (m2.object === gurldel.obj) {
          toRemove = url;
          break;
        }
      }
      if (toRemove) this.historyCache.delete(toRemove);
    }
    /** Compatibilidad con tu API */
    getParams() {
      return this.active?.params ?? {};
    }
    /** Añade una ruta en caliente (corrige bug: this.urls.get → this.ids.get) */
    addGurl(gurl, parentId) {
      if (this.ids.has(gurl.id)) throw Error(`${gurl.id} exits`);
      let parent;
      if (parentId) {
        parent = this.ids.get(parentId);
        if (!parent) throw Error(`${parentId} not exits`);
      }
      this.compilePattern(gurl);
      this.ids.set(gurl.id, gurl);
      if (parent) {
        gurl.parent = parent;
        if (!parent.childs) parent.childs = [];
        parent.childs.push(gurl);
      } else {
        this.urls.push(gurl);
      }
      if (gurl.childs && gurl.childs.length) this.loadIds(gurl.childs, gurl);
    }
    /** Liberar listeners y cachés */
    destroy() {
      if (this.hashchangebind) window.removeEventListener("hashchange", this.hashchangebind);
      if (this.popstatebind) window.removeEventListener("popstate", this.popstatebind);
      this.historyCache.clear();
      this.cb = void 0;
      this.active = null;
    }
    /* ==========
       Helpers legacy expuestos para compatibilidad
       ========== */
    // Mantenemos por compatibilidad; internamente no lo usamos fuera de compilePattern
    escapeRegExp(str) {
      return this.escapeRegexLiteral(str);
    }
    /* ==========
       Extensiones NO rompedoras (útiles)
       ========== */
    /** Devuelve null en vez de lanzar si falta param obligatorio (útil en UI) */
    tryGetUrlFromParams(id, params) {
      try {
        return this.getUrlFromParams(id, params);
      } catch {
        return null;
      }
    }
    getMatch() {
      return this.active;
    }
    getAllRoutes() {
      return [...this.ids.values()];
    }
    /**
     * Devuelve el GMatch que resultaría de navegar a un path dado,
     * pero si existe en caché se devuelve directamente el objeto cacheado.
     * NO modifica el router ni dispara eventos.
     */
    async matchPath(pathOrUrl) {
      const [pathPart, queryPart] = pathOrUrl.split("?");
      const norm = this.normalizePath(pathPart || "/");
      const cached = this.historyCache.get(norm);
      if (cached) {
        if (queryPart) {
          const q2 = this.parseQueryString(queryPart);
          if (q2) cached.query = q2;
          else delete cached.query;
        }
        return cached;
      }
      const match = await this.resolvePath(norm, this.urls);
      if (!match) return null;
      const routeDef = this.ids.get(match.id);
      const mw = await this.runMiddlewareChain(routeDef, match);
      if (!mw.ok) {
        if (mw.redirect) return { ...match, redirect: mw.redirect };
        return null;
      }
      if (queryPart) {
        const q2 = this.parseQueryString(queryPart);
        if (q2) match.query = q2;
        else delete match.query;
      }
      return match;
    }
    /**
      * Devuelve la cadena de GURL desde la raíz hasta la ruta actual (o una ruta dada).
      * Útil para breadcrumbs, títulos, etc.
      */
    getRouteChain(match) {
      const r2 = match?.gurl ?? this.active?.gurl;
      if (!r2) return [];
      const chain = [];
      let cur = r2;
      while (cur) {
        chain.unshift(cur);
        cur = cur.parent ?? null;
      }
      return chain;
    }
  };

  // src/core/GDirectiveBase.ts
  var GDirectiveBase = class {
    constructor(ele, value, root, arg) {
      this.ele = ele;
      this.value = value;
      this.root = root.Root;
      this.argument = arg;
      this.onInit?.();
    }
  };

  // src/decorators/directive.decorator.ts
  function isValidAttributeName(name) {
    return /^[a-zA-Z_][a-zA-Z0-9_\-:.]*$/.test(name);
  }
  function Directive(config) {
    return function(constructor) {
      const name = config?.name ?? constructor.name.replace(/Directive$/, "").replace(/([A-Z])/g, "-$1").toLowerCase().slice(1);
      if (!name) {
        throw new Error("@Directive() requiere un nombre v\xE1lido");
      }
      if (!isValidAttributeName(name)) {
        throw new Error(
          `Nombre de directiva inv\xE1lido: "${name}". Debe ser un nombre de atributo HTML v\xE1lido.`
        );
      }
      const success = Ne.GregisterDirective(name, constructor);
      if (!success) {
        console.warn(`\u26A0\uFE0F La directiva "${name}" ya est\xE1 registrada.`);
      }
      return constructor;
    };
  }

  // src/directives/GSet.ts
  var GSet = class extends GDirectiveBase {
    onInit() {
      if (this.argument && this.argument.trim()) {
        this.path = this.argument.trim().split(".");
        return;
      }
      const legacy = this.ele.getAttribute("g-set-var");
      if (legacy && legacy.trim()) {
        this.path = legacy.trim().split(".");
        this.ele.removeAttribute("g-set-var");
        return;
      }
      console.error(
        'g-set: falta el nombre de la propiedad. Usa g-set:prop / g-set:obj.prop o g-set-var="prop".'
      );
    }
    applyPathSet(target, value) {
      if (!target || !this.path || this.path.length === 0) return;
      const path = this.path;
      if (path.length > 1) {
        const reduce = (obj, index, fin) => {
          if (obj == null) return void 0;
          if (index === fin) return obj[path[index]];
          return reduce(obj[path[index]], index + 1, fin);
        };
        const parent = reduce(target, 0, path.length - 2);
        if (!parent) return;
        const lastKey = path[path.length - 1];
        parent[lastKey] = value;
      } else {
        const lastKey = path[0];
        target[lastKey] = value;
      }
    }
    setAttribute(name, value) {
      if (!this.path || this.path.length === 0) return;
      const controller = getControllerFromComponent(this.ele);
      if (!controller) return;
      this.applyPathSet(controller, value);
    }
    getAttribute(name) {
      return null;
    }
    removeAttribute(name) {
    }
  };
  GSet = __decorateClass([
    Directive({
      name: "g-set"
    })
  ], GSet);

  // src/directives/GClass.ts
  var GClass = class extends GDirectiveBase {
    onInit() {
      const current = this.ele.getAttribute("class");
      this.cls = current ? current.split(/\s+/).filter(Boolean) : [];
    }
    setAttribute(name, value) {
      const ele = this.ele;
      this.cls = Array.isArray(value) ? value : String(value || "").split(/\s+/);
      if (this.cls.length) ele.setAttribute("class", this.cls.join(" "));
      else ele.removeAttribute("class");
    }
    getAttribute(name) {
      return this.cls?.length ? this.cls.join(" ") : null;
    }
    removeAttribute(name) {
      const ele = this.ele;
      ele.removeAttribute("class");
      this.cls = [];
    }
  };
  GClass = __decorateClass([
    Directive({
      name: "g-class"
    })
  ], GClass);

  // src/directives/GComponent.ts
  var GComponent = class extends GDirectiveBase {
    destroyComponent() {
      if (this.webc) {
        const prevCtrl = getControllerFromComponent(this.webc);
        prevCtrl?.destroy();
        if (!this.regc?.asWebComponent) {
          if (isHostCreated(this.webc)) this.webc.remove();
          else this.webc.setAttribute("g-component", "");
        }
        this.webc = void 0;
        this.regc = void 0;
      }
    }
    createComponent(tagName) {
      const nextTag = String(tagName ?? "").trim();
      if (!nextTag) {
        this.destroyComponent();
        this.value = "";
        this.ele.removeAttribute("g-component");
        return;
      }
      if (this.value === nextTag && this.webc)
        return;
      this.destroyComponent();
      const regc = getRegisteredComponent(nextTag);
      if (!regc) {
        console.warn(`[g-component] componente "${nextTag}" no registrado`);
        return;
      }
      this.value = nextTag;
      this.ele.setAttribute("g-component", this.value);
      this.ele.innerHTML = "";
      if (regc.asWebComponent) {
        const webc = new regc.ComponentClass();
        this.ele.appendChild(webc);
        this.webc = webc;
      } else {
        this.webc = new regc.ComponentClass(this.ele);
      }
      this.regc = regc;
    }
    onInit() {
      this.createComponent(this.value);
    }
    setAttribute(name, value) {
      this.createComponent(String(value ?? ""));
    }
    getAttribute(name) {
      return this.value ?? "";
    }
    removeAttribute(name) {
      this.destroyComponent();
      this.value = "";
      this.ele.removeAttribute("g-component");
    }
  };
  GComponent = __decorateClass([
    Directive({
      name: "g-component"
    })
  ], GComponent);

  // docs/playground.js
  var definitions = [];
  function define(tag, Controller, template, options = {}) {
    Component({ tag, template: { html: template }, ...options })(Controller);
    definitions.push({ tag, Controller, template, options });
  }
  var CounterCard = class extends GTplComponentBase {
    count = 0;
    label = "My first component";
    increment() {
      this.count++;
    }
    reset() {
      this.count = 0;
    }
  };
  define("docs-counter-card", CounterCard, `
<label>Card title <input [value]="{{ label }}" /></label>
<h3>{{ label }}</h3>
<p class="metric" aria-live="polite">{{ count }}</p>
<div class="actions">
    <button onclick="{{ increment }}">Increment</button>
    <button class="secondary" onclick="{{ reset }}">Reset</button>
</div>`);
  var ProfileCard = class extends GTplComponentBase {
    profile = { name: "Waiting for parent", role: "Guest" };
  };
  define("docs-profile-card", ProfileCard, `
<article class="profile">
    <span class="avatar" aria-hidden="true">G</span>
    <div><strong data-profile-name>{{ profile.name }}</strong><p>{{ profile.role }}</p></div>
</article>`);
  var ParentProfile = class extends GTplComponentBase {
    name = "Ada Lovelace";
    role = "Template engineer";
    changePerson() {
      this.name = this.name === "Ada Lovelace" ? "Grace Hopper" : "Ada Lovelace";
      this.role = this.name === "Ada Lovelace" ? "Template engineer" : "Compiler engineer";
    }
  };
  define("docs-parent-profile", ParentProfile, `
<label>Name <input [value]="{{ name }}" /></label>
<label>Role <input [value]="{{ role }}" /></label>
<docs-profile-card g-set:profile.name="{{ name }}" g-set:profile.role="{{ role }}"></docs-profile-card>
<button onclick="{{ changePerson }}">Change person</button>`);
  var ClassBadge = class extends GTplComponentBase {
    active = true;
    classes = ["status", "status-ok"];
    toggle() {
      this.active = !this.active;
      this.classes = this.active ? ["status", "status-ok"] : ["status", "status-paused"];
    }
  };
  define("docs-class-badge", ClassBadge, `
<p g-class="{{ classes }}">{{ return active ? 'System online' : 'System paused' }}</p>
<button onclick="{{ toggle }}">Toggle status</button>`);
  var WeatherWidget = class extends GTplComponentBase {
    temperature = 21;
    warmUp() {
      this.temperature++;
    }
  };
  define("docs-weather-widget", WeatherWidget, `
<article class="widget"><h3>Weather widget</h3>
<p><strong>{{ temperature }}</strong> \xB0C in Madrid</p>
<button onclick="{{ warmUp }}">Warm up</button></article>`);
  var TasksWidget = class extends GTplComponentBase {
    tasks = [{ title: "Build components" }, { title: "Ship documentation" }];
    add() {
      this.tasks.push({ title: "Task " + (this.tasks.length + 1) });
    }
  };
  define("docs-tasks-widget", TasksWidget, `
<article class="widget"><h3>Tasks widget</h3>
<ul><li g-for="tasks;index;task">{{ task.title }}</li></ul>
<button onclick="{{ add }}">Add task</button></article>`);
  var DynamicDashboard = class extends GTplComponentBase {
    current = "docs-weather-widget";
    showWeather() {
      this.current = "docs-weather-widget";
    }
    showTasks() {
      this.current = "docs-tasks-widget";
    }
    clear() {
      this.current = "";
    }
  };
  define("docs-dynamic-dashboard", DynamicDashboard, `
<div class="actions">
    <button onclick="{{ showWeather }}">Weather</button>
    <button onclick="{{ showTasks }}">Tasks</button>
    <button class="secondary" onclick="{{ clear }}">Clear</button>
</div>
<div g-component="{{ current }}"></div>`);
  var BusReceiver = class extends GTplComponentBase {
    messages = [];
    subscription = null;
    onInit() {
      this.subscription = GBus.subscribe("docs.note", (payload) => {
        this.messages.push(payload.text);
      }, { namespace: "playground" });
    }
    onDestroy() {
      this.subscription?.off();
    }
  };
  define("docs-bus-receiver", BusReceiver, `
<p>Received: <strong data-message-count>{{ return messages.length }}</strong></p>
<ul class="event-log" aria-live="polite"><li g-for="messages;index;message">{{ message }}</li></ul>`);
  var BusSender = class extends GTplComponentBase {
    text = "Hello from another component";
    count = 0;
    send() {
      this.count++;
      GBus.emit("docs.note", { text: "#" + this.count + ": " + this.text }, "playground");
    }
  };
  define("docs-bus-sender", BusSender, `
<label>Message <input [value]="{{ text }}" /></label>
<button onclick="{{ send }}">Publish message</button>`);
  var BusPlayground = class extends GTplComponentBase {
  };
  define("docs-bus-playground", BusPlayground, `
<div class="columns"><docs-bus-sender></docs-bus-sender><docs-bus-receiver></docs-bus-receiver></div>`);
  var routeResolver = new GRouter([
    { id: "home", url: "/" },
    { id: "project", url: "/projects/:id", regex: { id: "([0-9]+)" } },
    { id: "guide", url: "/guides/:topic" }
  ]);
  var RouteExplorer = class extends GTplComponentBase {
    path = "/projects/42";
    result = "Click Resolve route";
    generated = "";
    async resolve() {
      const match = await routeResolver.matchPath(this.path);
      this.result = match ? JSON.stringify({ id: match.id, params: match.params }, null, 2) : "No matching route";
    }
    project() {
      this.path = "/projects/128";
      this.resolve();
    }
    guide() {
      this.path = "/guides/components";
      this.resolve();
    }
    missing() {
      this.path = "/projects/not-a-number";
      this.resolve();
    }
    build() {
      this.generated = routeResolver.getUrlFromParams("project", { id: 7 });
    }
  };
  define("docs-route-explorer", RouteExplorer, `
<label>Path <input [value]="{{ path }}" /></label>
<div class="actions"><button onclick="{{ resolve }}">Resolve route</button>
<button class="secondary" onclick="{{ project }}">Project</button>
<button class="secondary" onclick="{{ guide }}">Guide</button>
<button class="secondary" onclick="{{ missing }}">Invalid ID</button></div>
<pre class="route-result" aria-live="polite">{{ result }}</pre>
<button class="secondary" onclick="{{ build }}">Build project URL</button><output>{{ generated }}</output>`);
  var LifecycleChild = class extends GTplComponentBase {
    onConstruct() {
      GBus.emit("docs.lifecycle", "onConstruct", "lifecycle");
    }
    onInit() {
      GBus.emit("docs.lifecycle", "onInit", "lifecycle");
    }
    onTemplateReady() {
      GBus.emit("docs.lifecycle", "onTemplateReady", "lifecycle");
    }
    onConnect() {
      GBus.emit("docs.lifecycle", "onConnect", "lifecycle");
    }
    onDisconnect() {
      GBus.emit("docs.lifecycle", "onDisconnect", "lifecycle");
    }
    onDestroy() {
      GBus.emit("docs.lifecycle", "onDestroy", "lifecycle");
    }
  };
  define("docs-lifecycle-child", LifecycleChild, '<p class="status status-ok">Child component mounted.</p>');
  var LifecyclePlayground = class extends GTplComponentBase {
    current = "";
    events = [];
    subscription = null;
    onInit() {
      this.subscription = GBus.subscribe("docs.lifecycle", (event) => {
        this.events.push(event);
      }, { namespace: "lifecycle" });
    }
    mount() {
      this.current = "docs-lifecycle-child";
    }
    unmount() {
      this.current = "";
    }
    clear() {
      this.events = [];
    }
    onDestroy() {
      this.subscription?.off();
    }
  };
  define("docs-lifecycle-playground", LifecyclePlayground, `
<div class="actions"><button onclick="{{ mount }}">Mount child</button>
<button class="secondary" onclick="{{ unmount }}">Destroy child</button>
<button class="secondary" onclick="{{ clear }}">Clear log</button></div>
<div g-component="{{ current }}"></div>
<ol class="event-log" aria-live="polite"><li g-for="events;index;event">{{ event }}</li></ol>`);
  var ShadowCard = class extends GTplComponentBase {
    count = 0;
    increment() {
      this.count++;
    }
  };
  define("docs-shadow-card", ShadowCard, `
<h3>Inside a ShadowRoot</h3>
<p>Local clicks: <strong>{{ count }}</strong></p>
<button onclick="{{ increment }}">Shadow counter +1</button>
<slot></slot>`, {
    shadow: true,
    styleMode: "inline",
    style: ":host{display:block;padding:1rem;border:2px solid #1e855f;border-radius:12px;background:#f3faef;color:#132218;font:inherit}h3{color:#1e855f;margin:0 0 .75rem}button{padding:.55rem .85rem;border:0;border-radius:7px;background:#1e855f;color:white;cursor:pointer}::slotted(p){font-style:italic}"
  });
  var sections = [
    { id: "components", title: "Components, state & two-way inputs", description: "A controller owns state. GTPL binds its fields directly to DOM and routes template events to methods.", tag: "docs-counter-card", tags: ["docs-counter-card"] },
    { id: "inputs", title: "Parent \u2192 child: nested g-set inputs", description: "Edit both inputs. g-set:profile.name and g-set:profile.role assign reactive values to the registered child controller, including nested paths.", tag: "docs-parent-profile", tags: ["docs-profile-card", "docs-parent-profile"] },
    { id: "classes", title: "Dynamic classes with g-class", description: "Pass an array or a space-separated string. Each update replaces the complete class list, so include base classes in the value.", tag: "docs-class-badge", tags: ["docs-class-badge"] },
    { id: "dynamic", title: "Dynamic components & nested lists", description: "g-component mounts a registered tag, destroys the previous component when switching, and clears the slot for an empty string. Switch back to see fresh local state.", tag: "docs-dynamic-dashboard", tags: ["docs-weather-widget", "docs-tasks-widget", "docs-dynamic-dashboard"] },
    { id: "events", title: "Component communication with GBus", description: "Independent sender and receiver communicate through a namespace. Keep the subscription handle and call off() in onDestroy().", tag: "docs-bus-playground", tags: ["docs-bus-sender", "docs-bus-receiver", "docs-bus-playground"] },
    { id: "router", title: "Route explorer: params, validation & URLs", description: "Resolve real GRouter patterns without navigating away. Try /projects/42, /guides/components or an invalid numeric ID. Custom regex fragments include a capture group for their parameter. Production navigation uses GRouterService.init(routes).", tag: "docs-route-explorer", tags: ["docs-route-explorer"], prelude: "const routeResolver = new GRouter([\n  { id: 'home', url: '/' },\n  { id: 'project', url: '/projects/:id', regex: { id: '([0-9]+)' } },\n  { id: 'guide', url: '/guides/:topic' }\n]);" },
    { id: "lifecycle", title: "Lifecycle & explicit cleanup", description: "Mount, destroy, then mount again. Observe actual hook order: construction, connection and asynchronous template availability can interleave. onTemplateReady signals template insertion; it does not await every asynchronous binding.", tag: "docs-lifecycle-playground", tags: ["docs-lifecycle-child", "docs-lifecycle-playground"] },
    { id: "shadow", title: "Shadow DOM, scoped styles & slots", description: "shadow: true creates an open ShadowRoot. Inline styles stay scoped; the slot projects content supplied by the parent. The counter remains reactive inside the shadow tree.", tag: "docs-shadow-card", tags: ["docs-shadow-card"], lightDOM: "<p>Projected from the light DOM through a native slot.</p>" }
  ];
  var importLine = "import { Component, GTplComponentBase, GBus, GRouter } from '@mpeliz/gtplweb';";
  var main = document.querySelector("#examples");
  var toc = document.querySelector("#example-links");
  for (const [index, section] of sections.entries()) {
    const article = document.createElement("section");
    article.className = "demo";
    article.id = section.id;
    const heading = document.createElement("h2");
    heading.textContent = `${String(index + 1).padStart(2, "0")} / ${section.title}`;
    const description = document.createElement("p");
    description.className = "demo-intro";
    description.textContent = section.description;
    const preview = document.createElement("div");
    preview.className = "preview";
    const previewLabel = document.createElement("p");
    previewLabel.className = "panel-label";
    previewLabel.textContent = "LIVE EXAMPLE";
    const host = document.createElement(section.tag);
    if (section.lightDOM) host.innerHTML = section.lightDOM;
    preview.append(previewLabel, host);
    article.append(heading, description, preview);
    const details = document.createElement("details");
    details.className = "source";
    const summary = document.createElement("summary");
    summary.textContent = "View complete example source";
    details.append(summary);
    const imported = document.createElement("pre");
    imported.textContent = importLine + (section.prelude ? "\n\n" + section.prelude : "");
    details.append(imported);
    for (const tag of section.tags) {
      const def = definitions.find((item) => item.tag === tag);
      const label = document.createElement("h3");
      label.textContent = tag;
      const html = document.createElement("pre");
      const htmlCode = document.createElement("code");
      htmlCode.textContent = def.template.trim();
      html.append(htmlCode);
      const js = document.createElement("pre");
      const jsCode = document.createElement("code");
      jsCode.textContent = "const " + def.Controller.name + " = " + def.Controller.toString() + ";\n\nComponent(" + JSON.stringify({ tag, template: { html: def.template }, ...def.options }, null, 2) + ")(" + def.Controller.name + ");";
      js.append(jsCode);
      details.append(label, html, js);
    }
    const mount = document.createElement("pre");
    mount.textContent = "<" + section.tag + ">" + (section.lightDOM || "") + "</" + section.tag + ">";
    details.append(mount);
    article.append(details);
    main.append(article);
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#" + section.id;
    link.textContent = section.title;
    li.append(link);
    toc.append(li);
  }
  document.documentElement.dataset.playground = "ready";
})();
/*! Bundled license information:

@mpeliz/gtpl/dist/gtpl.esm.js:
  (*!
  * @mpeliz/gtpl v1.1.4
  * (c) 2024 Manuel Peliz
  * @license Apache-2.0
  * @repository [object Object]
  *)
*/
//# sourceMappingURL=gtplweb-docs.js.map
