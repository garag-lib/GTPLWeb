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

  // node_modules/@mpeliz/gtpl/dist/shared/runtime.esm.js
  function e(e2) {
    const t2 = {};
    let n2 = "", r2 = null, o3 = 0;
    const s2 = (e3) => {
      if (!(e3 = e3.trim())) return;
      const n3 = e3.indexOf(":");
      if (-1 === n3) return;
      const r3 = e3.slice(0, n3).trim(), o4 = e3.slice(n3 + 1).trim();
      if (!r3) return;
      const s3 = r3.startsWith("--") ? r3 : r3.replace(/-([a-z])/g, (e4, t3) => t3.toUpperCase());
      t2[s3] = o4;
    };
    for (let t3 = 0; t3 < e2.length; t3++) {
      const i2 = e2[t3];
      if ('"' === i2 || "'" === i2) {
        let n3 = 0;
        for (let r3 = t3 - 1; r3 >= 0 && "\\" === e2[r3]; r3--) n3++;
        n3 % 2 == 0 && (r2 === i2 ? r2 = null : r2 || (r2 = i2));
      }
      r2 || ("(" === i2 && o3++, ")" === i2 && o3--), r2 || 0 !== o3 || ";" !== i2 ? n2 += i2 : (s2(n2), n2 = "");
    }
    return s2(n2), t2;
  }
  function t(e2) {
    return e2.startsWith("--") ? e2 : e2.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
  var n = /* @__PURE__ */ new Set(["symbol", "bigint", "undefined", "boolean", "string", "number"]);
  function r(e2) {
    return null === e2 || n.has(typeof e2);
  }
  function o(e2) {
    if (null === e2) return true;
    return "function" === typeof e2 || ("undefined" != typeof Window && e2 instanceof Window || ("undefined" != typeof Node && e2 instanceof Node || ("undefined" != typeof DOMTokenList && e2 instanceof DOMTokenList || ("undefined" != typeof NodeList && e2 instanceof NodeList || ("undefined" != typeof HTMLCollection && e2 instanceof HTMLCollection || (!!(e2 instanceof Date || e2 instanceof RegExp || e2 instanceof Map || e2 instanceof Set || e2 instanceof WeakMap || e2 instanceof WeakSet || e2 instanceof ArrayBuffer || ArrayBuffer.isView(e2)) || !Object.isExtensible(e2)))))));
  }
  function s(...e2) {
    console.log("%c----------", "font-weight:bold"), console.log(...e2), console.log("%c----------", "font-weight:bold");
  }
  function i(e2, ...t2) {
    const n2 = new Error(e2);
    console.error("%cSTACK ERROR:", "color:red;font-weight:bold", e2), s(n2.stack, ...t2);
  }
  var l = /* @__PURE__ */ Symbol("is proxy");
  var a = /* @__PURE__ */ Symbol("proxy target");
  var c = /* @__PURE__ */ new WeakMap();
  var f = /* @__PURE__ */ new WeakMap();
  var d = /* @__PURE__ */ new WeakMap();
  var h = /* @__PURE__ */ new WeakMap();
  var u = /* @__PURE__ */ new WeakMap();
  var p = /* @__PURE__ */ new WeakSet();
  var g = /* @__PURE__ */ new WeakSet();
  var y = 0;
  function v() {
    return { children: /* @__PURE__ */ new Map(), targets: /* @__PURE__ */ new Set() };
  }
  function m(e2, t2) {
    if (!k(t2.objRef)) return;
    if (y && t2.node && p.has(t2.node)) return void t2.node.targets.delete(e2);
    const n2 = u.get(t2.objRef);
    let r2 = n2?.get(t2.event);
    if (!r2) return;
    const o3 = [r2];
    for (const e3 of t2.parentPath) {
      if (r2 = r2.children.get(e3), !r2) return;
      o3.push(r2);
    }
    r2.targets.delete(e2);
    for (let e3 = o3.length - 1; e3 > 0 && !(o3[e3].targets.size || o3[e3].children.size || y && p.has(o3[e3])); e3--) o3[e3 - 1].children.delete(t2.parentPath[e3 - 1]);
    o3[0].targets.size || o3[0].children.size || n2.delete(t2.event), n2.size || u.delete(t2.objRef);
  }
  function k(e2) {
    return "object" == typeof e2 && null !== e2 || "function" == typeof e2;
  }
  function E(e2, t2, n2, r2, o3) {
    const s2 = k(n2);
    if (s2 && (o3 = o3 || (function(e3, t3, n3) {
      let r3 = u.get(e3);
      r3 || u.set(e3, r3 = /* @__PURE__ */ new Map());
      let o4 = r3.get(t3);
      o4 || r3.set(t3, o4 = v());
      for (const e4 of n3) {
        let t4 = o4.children.get(e4);
        t4 || o4.children.set(e4, t4 = v()), o4 = t4;
      }
      return o4;
    })(n2, t2, r2), o3.targets.has(e2))) return;
    let i2 = d.get(e2);
    if (i2 || (i2 = [], d.set(e2, i2)), s2 || !i2.some((e3) => {
      return e3.event === t2 && e3.objRef === n2 && (o4 = e3.parentPath, s3 = r2, o4.length === s3.length && o4.every((e4, t3) => e4 === s3[t3]));
      var o4, s3;
    })) {
      const s3 = { event: t2, objRef: n2, parentPath: r2.slice(), node: o3 };
      i2.push(s3), o3?.targets.add(e2);
    }
    if (k(n2)) {
      let t3 = h.get(n2);
      t3 || (t3 = /* @__PURE__ */ new Set(), h.set(n2, t3)), t3.add(e2);
    }
  }
  function b(e2, t2, n2) {
    if (r(t2) || C(t2) || o(t2)) return t2;
    let s2 = t2;
    return (d.get(e2)?.slice() ?? []).forEach((e3) => {
      if (e3.node) {
        let r2 = e3.node.children.get(n2);
        r2 || e3.node.children.set(n2, r2 = v()), r2.targets.has(t2) || E(t2, e3.event, e3.objRef, [...e3.parentPath, n2], r2), s2 = S(t2);
      } else s2 = A(t2, e3.event, e3.objRef, [...e3.parentPath, n2]);
    }), s2;
  }
  function w(e2, t2, n2, r2) {
    C(e2) && (e2 = e2[a]);
    const o3 = d.get(e2);
    if (!o3) return;
    const s2 = [];
    let i2, l3 = false, f3 = false;
    for (const a3 of o3) a3.event !== t2 || void 0 !== n2 && a3.objRef !== n2 || r2 && !(a3.parentPath.length >= r2.length && r2.every((e3, t3) => a3.parentPath[t3] === e3)) ? (s2.push(a3), a3.objRef === n2 && (f3 = true)) : (l3 = true, m(e2, a3), void 0 === n2 && k(a3.objRef) && (i2 || (i2 = /* @__PURE__ */ new Set())).add(a3.objRef));
    if (!l3) return;
    const u3 = (t3) => {
      const n3 = h.get(t3);
      n3?.delete(e2), 0 !== n3?.size || y && g.has(t3) || h.delete(t3);
    };
    if (k(n2) && !f3 && u3(n2), i2) {
      for (const e3 of s2) i2.delete(e3.objRef);
      i2.forEach(u3);
    }
    if (s2.length > 0) d.set(e2, s2);
    else {
      d.delete(e2);
      const t3 = c.get(e2);
      if (t3) {
        try {
          t3.revoke();
        } catch (e3) {
          console.error("[GProxy] Error revoking proxy:", e3);
        }
        c.delete(e2);
      }
    }
  }
  function P(e2, t2) {
    for (const n2 of e2) {
      if (!k(n2.objRef)) continue;
      const e3 = [...n2.parentPath, t2];
      let r2 = u.get(n2.objRef)?.get(n2.event);
      for (const t3 of e3) r2 = r2?.children.get(t3);
      if (!r2) continue;
      const o3 = /* @__PURE__ */ new Set(), s2 = [r2];
      for (; s2.length; ) {
        const e4 = s2.pop();
        e4.targets.forEach((e5) => o3.add(e5)), e4.children.forEach((e5) => s2.push(e5));
      }
      for (const t3 of o3) w(t3, n2.event, n2.objRef, e3);
    }
  }
  function R(e2, t2, n2) {
    if (C(e2) && (e2 = e2[a]), void 0 === n2) {
      return new Set((d.get(e2) ?? []).filter((e3) => e3.event === t2 && k(e3.objRef)).map((e3) => e3.objRef)).forEach((n3) => R(e2, t2, n3)), void w(e2, t2);
    }
    if (void 0 !== n2 && k(n2)) {
      const e3 = h.get(n2);
      if (e3) return Array.from(e3).forEach((e4) => w(e4, t2, n2)), void (0 !== e3.size || y && g.has(n2) || h.delete(n2));
    }
    w(e2, t2, n2);
  }
  function C(e2) {
    return !!e2 && "object" == typeof e2 && true === e2[l];
  }
  function A(e2, t2, n2, s2 = []) {
    return r(e2) || o(e2) ? e2 : (E(e2, t2, n2, Array.isArray(s2) ? s2 : []), S(e2));
  }
  function S(e2) {
    const t2 = c.get(e2);
    if (t2) return t2.proxy;
    const n2 = (o3 = e2, { get(e3, t3, n3) {
      if (t3 === l) return true;
      if (t3 === a) return o3;
      if (t3 === Symbol.iterator) {
        const t4 = e3[Symbol.iterator];
        return "function" != typeof t4 ? t4 : function* () {
          if (Array.isArray(e3) && t4 === Array.prototype[Symbol.iterator]) for (let t5 = 0; t5 < e3.length; t5++) yield b(o3, e3[t5], String(t5));
          else for (const n4 of t4.call(e3)) yield b(o3, n4, Symbol.iterator);
        };
      }
      const r2 = Reflect.get(e3, t3, n3);
      return b(o3, r2, t3);
    }, set(e3, t3, n3, s3) {
      n3 = D(n3);
      const i3 = Reflect.get(e3, t3, s3);
      if (r(i3) && Object.is(i3, n3)) {
        const n4 = Reflect.getOwnPropertyDescriptor(e3, t3);
        if (n4 && "value" in n4 && n4.writable && s3 === c.get(o3)?.proxy) return true;
      }
      const l3 = Array.isArray(e3) ? e3.length : void 0, a3 = void 0 !== l3 && "length" === t3 && ("number" != typeof n3 || n3 < l3) ? Reflect.ownKeys(e3) : void 0, f3 = Reflect.set(e3, t3, n3, s3), h3 = void 0 === l3 ? void 0 : e3.length;
      if (f3 || void 0 !== l3 && h3 !== l3) {
        const r2 = a3?.filter((t4) => !Reflect.getOwnPropertyDescriptor(e3, t4)), c3 = d.get(o3)?.slice() ?? [];
        f3 && k(i3) && D(i3) !== D(Reflect.get(e3, t3, s3)) && P(c3, t3), r2?.forEach((e4) => P(c3, e4)), c3.forEach((r3) => r3.event(0, [...r3.parentPath, t3], f3 ? n3 : Reflect.get(e3, t3, s3), r3.objRef)), "length" !== t3 && void 0 !== l3 && h3 !== l3 && c3.forEach((e4) => e4.event(0, [...e4.parentPath, "length"], h3, e4.objRef)), r2?.forEach((e4) => c3.forEach((t4) => t4.event(1, [...t4.parentPath, e4], void 0, t4.objRef)));
      }
      return f3;
    }, deleteProperty(e3, t3) {
      const n3 = Reflect.getOwnPropertyDescriptor(e3, t3), r2 = Reflect.deleteProperty(e3, t3);
      if (r2) {
        const e4 = d.get(o3)?.slice() ?? [];
        n3 && P(e4, t3), e4.forEach((e5) => e5.event(1, [...e5.parentPath, t3], void 0, e5.objRef));
      }
      return r2;
    }, has: (e3, t3) => Reflect.has(e3, t3), ownKeys: (e3) => Reflect.ownKeys(e3), getOwnPropertyDescriptor: (e3, t3) => Reflect.getOwnPropertyDescriptor(e3, t3) });
    var o3;
    const { proxy: s2, revoke: i2 } = Proxy.revocable(e2, n2);
    return c.set(e2, { proxy: s2, revoke: i2 }), f.set(s2, e2), s2;
  }
  function x(e2, t2, n2) {
    const r2 = D(e2);
    return R(r2, t2, n2), r2;
  }
  function D(e2) {
    let t2 = e2;
    for (; k(t2); ) {
      const e3 = f.get(t2);
      if (e3) t2 = e3;
      else {
        if (!C(t2)) break;
        t2 = t2[a];
      }
    }
    return t2;
  }
  var B = null;
  function j(e2) {
    return e2 && e2.Math === Math && e2;
  }
  try {
    B = j("object" == typeof globalThis && globalThis) || j("object" == typeof window && window) || j("object" == typeof self && self) || j("object" == typeof global && global) || /* @__PURE__ */ (function() {
      return this;
    })();
  } catch (e2) {
  }
  var T = B;
  var O = null;
  try {
    const e2 = { get passive() {
      return O = true, false;
    } };
    T.addEventListener("test", null, e2), T.removeEventListener("test", null, e2);
  } catch (e2) {
    O = false;
  }
  var M = O;
  var N = /* @__PURE__ */ new Map();
  var G = /* @__PURE__ */ new WeakMap();
  function L(e2, t2, n2, r2, o3) {
    const s2 = N.get(t2);
    if (!s2) return false;
    let i2;
    try {
      i2 = new s2(e2, n2, r2, o3);
    } catch (t3) {
      throw e2.parentNode?.removeChild(e2), t3;
    }
    let l3 = G.get(e2);
    return l3 || (l3 = [], G.set(e2, l3)), l3.push(i2), i2;
  }
  function W(e2, t2, n2) {
    return n2 && (e2.mark = n2), t2 && (e2.ele = t2), e2;
  }
  function z(e2, t2, n2, r2) {
    Array.isArray(t2) ? t2.forEach((t3) => z(e2, t3, n2, r2)) : "function" != typeof t2 ? null != t2 && (Array.isArray(e2) ? e2.push(t2) : r2(e2, t2)) : z(e2, t2(n2), n2, r2);
  }
  function q(e2, t2, n2) {
    let r2 = t2;
    const o3 = [];
    for (; ; ) if ("function" != typeof r2) {
      if (Array.isArray(r2)) for (let e3 = r2.length - 1; e3 >= 0; e3--) o3.push(r2[e3]);
      else null != r2 && (Array.isArray(e2) ? e2.push(r2) : e2.appendChild(r2));
      if (0 === o3.length) return;
      r2 = o3.pop();
    } else r2 = r2(n2);
  }
  function I(e2) {
    if (N.has(e2)) return { dirName: e2, arg: null };
    const t2 = e2.indexOf(":");
    if (-1 === t2) return null;
    const n2 = e2.slice(0, t2), r2 = e2.indexOf(":", t2 + 1), o3 = e2.slice(t2 + 1, -1 === r2 ? void 0 : r2);
    return N.has(n2) ? { dirName: n2, arg: o3 } : null;
  }
  function V(e2, t2, n2) {
    if (!Array.isArray(e2)) return;
    let r2;
    e2.forEach((e3) => {
      if (Array.isArray(e3)) {
        const n3 = I(e3[0]);
        n3 ? (r2 || (r2 = [])).push([e3, n3]) : t2.setAttribute(e3[0], e3[1]);
      } else {
        const o3 = e3;
        let s2 = null;
        o3.prop && (s2 = I(o3.prop), s2 && (r2 || (r2 = [])).push([o3, s2])), s2 || n2.addBind(W(o3, t2));
      }
    }), r2?.forEach((e3) => {
      const r3 = e3[0], o3 = e3[1];
      if (Array.isArray(r3)) {
        const [e4, s2] = r3;
        L(t2, o3.dirName, s2, n2, o3.arg);
      } else {
        const e4 = r3, s2 = L(t2, o3.dirName, "", n2, o3.arg);
        n2.addBind(W(e4, s2));
      }
    });
  }
  var H = Object.assign(function(e2, t2, n2, r2, o3) {
    let s2 = null;
    switch (e2) {
      case "#text":
        null == s2 && (s2 = T.document.createTextNode("")), "string" == typeof t2 && (s2.textContent = t2);
      case "#comment":
        return null == s2 && (s2 = T.document.createComment("")), "string" == typeof t2 ? s2.textContent = t2 : t2.forEach((e3) => {
          "string" != typeof e3 ? Array.isArray(e3) ? console.error(s2, e3) : 0 == e3.type ? r2.addBind(W(e3, s2)) : r2.addBind(W(e3, void 0, s2)) : s2.textContent = e3;
        }), s2;
      default:
        const i2 = o3 && "http://www.w3.org/1999/xhtml" !== o3 ? T.document.createElementNS(o3, e2) : T.document.createElement(e2);
        return q(i2, n2, r2), V(t2, i2, r2), i2;
    }
  }, { getDocument: () => T.document, addAttributes: V });
  var _ = q;
  var F = function(e2, t2, n2) {
    z(e2, t2, n2, (e3, t3) => {
      const n3 = e3.parentNode;
      n3 && n3.insertBefore(t3, e3);
    });
  };
  var U = function(e2, t2, n2) {
    z(e2, t2, n2, (e3, t3) => {
      const n3 = e3.parentNode;
      if (!n3) return;
      const r2 = e3.nextSibling;
      r2 ? n3.insertBefore(t3, r2) : n3.appendChild(t3);
    });
  };
  var K = function(e2, t2) {
    return !N.has(e2) && (N.set(e2, t2), true);
  };
  var $ = V;
  var X = /* @__PURE__ */ Symbol("ElementReferenceIndex");
  var Y = /* @__PURE__ */ new WeakMap();
  var Z = /* @__PURE__ */ new WeakMap();
  var J = /* @__PURE__ */ new WeakMap();
  var Q = /* @__PURE__ */ new WeakSet();
  var ee = /* @__PURE__ */ new WeakMap();
  var te = /* @__PURE__ */ new WeakSet();
  function ne(e2, t2) {
    e2?.initialStates?.forEach((e3) => {
      t2 && (e3.failure || (e3.failure = t2), e3.reject?.(t2.error)), 0 === --e3.pending && (e3.resolveIdle?.(), e3.idle = void 0, e3.resolveIdle = void 0);
    }), e2?.initialStates?.clear();
  }
  var re = /* @__PURE__ */ new Map();
  var oe = /* @__PURE__ */ new WeakMap();
  var se;
  var ie = false;
  function le(e2) {
    return null != e2 && ("object" == typeof e2 || "function" == typeof e2) && "function" == typeof e2.then;
  }
  function ae(e2) {
    e2.reportErrors && e2.promise && !e2.observingErrors && (e2.observingErrors = true, e2.promise.catch((e3) => console.error("[GTPL] Binding update failed:", e3)));
  }
  function ce(e2, t2, n2) {
    const r2 = oe.get(e2) === t2;
    r2 && (oe.delete(e2), t2.initialStates?.size && Q.delete(e2));
    const o3 = n2 && r2 && !t2.context.isDestroyed && !e2.gtpl?.isDestroyed;
    t2.initialStates?.size && ne(t2, o3 ? n2 : void 0), o3 ? t2.reject ? t2.reject(n2.error) : t2.reportErrors && console.error("[GTPL] Binding update failed:", n2.error) : t2.resolve?.();
  }
  var fe = { binitChangeEvents: false, changeEventsCount: 0, changeEventsHandler: null };
  var de = class _de {
    static globalVar = /* @__PURE__ */ new WeakMap();
    static init(e2) {
      _de.globalVar.has(e2) || _de.globalVar.set(e2, { GenerationFinish: false });
    }
    static getProperty(e2, t2, n2 = true) {
      const r2 = _de.globalVar.get(e2);
      if (void 0 !== r2?.[t2]) return r2[t2];
      if (!n2 || "GenerationFinish" === t2) return;
      const o3 = r2 || {};
      return r2 || _de.globalVar.set(e2, o3), o3[t2] = "renderElements" === t2 ? /* @__PURE__ */ new Set() : /* @__PURE__ */ new WeakMap();
    }
    static setProperty(e2, t2, n2) {
      _de.init(e2);
      _de.globalVar.get(e2)[t2] = n2;
    }
  };
  var he = /* @__PURE__ */ new WeakMap();
  var ue = /* @__PURE__ */ new WeakMap();
  function pe() {
    !(function() {
      if (fe.binitChangeEvents) return;
      fe.binitChangeEvents = true, fe.changeEventsHandler = function(e2) {
        const t2 = e2.target, n2 = he.get(t2);
        if (n2 && n2.size) for (const e3 of n2) {
          const n3 = e3.prop || "value";
          let r2;
          r2 = n3 in t2 ? t2[n3] : t2.getAttribute(n3), ve(e3.va, e3.ctx, r2);
        }
      };
    })(), fe.changeEventsCount++, fe.changeEventsCount > 1 || T && "function" == typeof T.addEventListener && (T.addEventListener("input", fe.changeEventsHandler), T.addEventListener("change", fe.changeEventsHandler), T.addEventListener("toggle", fe.changeEventsHandler));
  }
  function ge(e2, t2) {
    const n2 = de.getProperty(e2, "renderElements");
    n2.has(t2) || n2.add(t2);
  }
  function ye(e2, t2) {
    const n2 = de.getProperty(e2, "renderElements", false);
    if (!n2?.has(t2)) return;
    (Array.isArray(e2.Elements) ? e2.Elements : [e2.Elements]).forEach((t3, r2) => {
      const o3 = e2.RenderElements[r2];
      if (o3 && n2.has(o3)) {
        let e3 = true;
        if (o3.ele) {
          const t4 = Array.isArray(o3.ele) ? o3.ele[0] : o3.ele;
          o3.mark.parentNode || t4.parentNode ? o3.mark.parentNode && !t4.parentNode && (Me(o3), o3.eles && (o3.eles[0].refresh(), o3.eles[0].refCase && Me(o3.eles[0].refCase))) : e3 = false;
        } else if (o3.eles) if (o3.mark.parentNode) {
          let e4 = null;
          const t4 = [];
          o3.eles.forEach((n3) => {
            const r3 = [];
            n3.refresh(), n3.addTo(r3), r3.forEach((n4) => {
              n4.parentNode ? e4 || (e4 = n4) : t4.push(n4);
            });
          }), t4.length && Me({ type: o3.type, link: o3.link, ele: t4, mark: e4 || o3.mark }, false);
        } else e3 = false;
        e3 && n2.delete(o3);
      }
    });
  }
  function ve(e2, t2, n2, r2 = false) {
    if (e2.length) if (e2.length > 1) {
      const o3 = (t3, n3, r3) => n3 === r3 ? t3[e2[n3]] : o3(t3[e2[n3]], ++n3, r3), s2 = o3(t2.Root, 0, e2.length - 2), i2 = e2[e2.length - 1];
      (r2 || s2[i2] !== n2) && (s2[i2] = n2);
    } else {
      const o3 = e2[0];
      (r2 || t2.Root[o3] !== n2) && (t2.Root[o3] = n2);
    }
  }
  function me(e2, t2, n2, r2, o3) {
    null == r2 && (r2 = 0);
    const s2 = null == n2 ? e2.getValue(t2[r2++]) : n2[t2[r2++]];
    return r2 >= t2.length ? s2 : me(e2, t2, s2, r2);
  }
  function ke(e2, t2, n2 = 0, r2) {
    for (; n2 < t2.length; n2++) {
      if (e2.isDestroyed) return;
      const o3 = t2[n2], s2 = e2.getContext(o3.name[0]), l3 = me(s2, o3.name);
      if (l3) {
        const i2 = [];
        if (o3.params) for (const t3 of o3.params) null != t3.ct ? i2.push(t3.ct) : null != t3.va && i2.push(me(e2, t3.va));
        if (null != r2 && i2.push(r2), le(r2 = l3.apply(s2.Root, i2))) {
          const o4 = n2 + 1;
          return Promise.resolve(r2).then((n3) => ke(e2, t2, o4, n3));
        }
      } else i("fnc undefined", n2, t2);
    }
    return r2;
  }
  function Ee(e2, t2, n2, r2) {
    const o3 = t2.gtpl || e2;
    if (t2.link.formula?.fnc) {
      const e3 = [];
      if (t2.link.formula.vars) for (const n3 of t2.link.formula.vars) e3.push(o3.getValue(n3[0]));
      return r2 && e3.push(r2), t2.link.formula.fnc.apply(o3.Root, e3);
    }
    let s2;
    return t2.link.vorc && (null != t2.link.vorc.va && (s2 = void 0 !== n2 ? n2 : me(o3, t2.link.vorc.va)), null != t2.link.vorc.ct && (s2 = t2.link.vorc.ct)), t2.link.functions ? ke(o3, t2.link.functions, 0, s2) : s2;
  }
  function be(e2, t2) {
    let n2 = e2;
    if (t2.link.vorc && t2.link.vorc.va) n2 = e2.getContext(t2.link.vorc.va[0]);
    else if (t2.link.functions) {
      const r2 = t2.link.functions[0];
      n2 = e2.getContext(r2.name[0]);
    }
    return n2;
  }
  function we(e2, t2, n2) {
    const o3 = t2[0];
    if (null != e2.BindTree[o3]) return;
    const s2 = { key: o3, val: e2.getValue(o3), pro: void 0 };
    e2.BindDef.add(s2);
    try {
      const t3 = Object.getOwnPropertyDescriptor(e2.Root, o3);
      t3 && "value" in t3 && (t3.value = void 0), e2.Root.hasOwnProperty(o3) || (e2.Root[o3] = null);
      const n3 = function() {
        return void 0 !== s2.pro ? s2.pro : r(s2.val) ? s2.val : (s2.val = D(s2.val), s2.pro = A(s2.val, e2.BoundEventProxy, s2, [s2.key]), s2.pro);
      };
      Object.defineProperty(e2.Root, o3, { get: n3, set: function(t4) {
        const n4 = D(t4), o4 = (function(e3, t5, n5, r2, o5) {
          const s3 = u.get(n5)?.get(t5), i3 = s3?.children.get(r2);
          if (!s3 || !i3 || p.has(i3)) return x(e3, t5, n5), o5();
          const l4 = g.has(n5);
          p.add(i3), g.add(n5), y++;
          try {
            return x(e3, t5, n5), o5();
          } finally {
            p.delete(i3), l4 || g.delete(n5), y--, i3.targets.size || i3.children.size || s3.children.get(r2) !== i3 || m(e3, { event: t5, objRef: n5, parentPath: [r2], node: i3 });
            const o6 = h.get(n5);
            l4 || 0 !== o6?.size || h.delete(n5);
          }
        })(s2.val, e2.BoundEventProxy, s2, s2.key, () => (s2.val = n4, r(n4) ? (delete s2.pro, s2.val) : (s2.val = D(s2.val), s2.pro = A(s2.val, e2.BoundEventProxy, s2, [s2.key]), s2.pro)));
        return e2.eventPRoxy(0, [s2.key], n4, s2), o4;
      } });
      const i2 = { original: t3, get: n3, active: true };
      Y.set(s2, i2), Z.set(n3, i2);
      const l3 = t3?.get && Z.get(t3.get);
      l3 && (l3.successors || (l3.successors = /* @__PURE__ */ new Set())).add(i2);
    } catch (t3) {
      i(t3.message, o3, e2.Root);
    }
  }
  function Pe(e2, t2, n2) {
    if (0 == t2.length || 1 == t2.length && "this" == t2[0]) return;
    let r2 = e2.BindTree;
    for (let o3 = 0, s2 = t2.length; o3 < s2; o3++) {
      const i2 = t2[o3];
      if (0 == o3) {
        const r3 = e2.getContext(i2);
        if (r3 != e2) {
          n2.gtpl = e2, e2.BindMap || (e2.BindMap = /* @__PURE__ */ new Map());
          const o4 = e2.BindMap.get(n2);
          if (o4 && o4 !== r3) {
            let t3 = J.get(e2);
            t3 || J.set(e2, t3 = /* @__PURE__ */ new Map());
            let s3 = t3.get(n2);
            s3 || t3.set(n2, s3 = /* @__PURE__ */ new Set()), s3.add(o4), s3.add(r3);
          }
          return e2.BindMap.set(n2, r3), void Pe(r3, t2, n2);
        }
        we(r3, t2);
      }
      null == r2[i2] && (r2[i2] = {}), o3 < s2 - 1 ? (r2 = r2[i2], null == r2.tree && (r2.tree = {}), r2 = r2.tree) : r2 = r2[i2];
    }
    null == r2.me && (r2.me = /* @__PURE__ */ new Set()), r2.me.add(n2);
  }
  function Re(e2, t2, n2) {
    if (0 == t2.length || 1 == t2.length && "this" == t2[0]) return null;
    let r2 = e2.BindTree;
    for (let e3 = 0, n3 = t2.length; e3 < n3; e3++) {
      const o3 = t2[e3];
      if (!r2 || null == r2[o3]) return null;
      if (r2 = r2[o3], e3 < n3 - 1) {
        if (null == r2.tree) return null;
        r2 = r2.tree;
      }
    }
    return r2?.me ?? null;
  }
  function Ce(e2, t2) {
    if ((function(e3) {
      const t3 = oe.get(e3);
      t3 && (t3.initialStates?.size && ne(t3), t3.resolve?.(), re.delete(e3), oe.delete(e3)), Q.delete(e3);
    })(t2), 5 === t2.type && ee.delete(t2), t2.link.vorc && t2.link.vorc.va && Re(e2, t2.link.vorc.va)?.delete(t2), t2.link.formula?.vars && t2.link.formula.vars.forEach((n2) => {
      Re(e2, n2)?.delete(t2);
    }), t2.link.functions?.forEach((n2) => n2.params?.forEach((n3) => {
      n3.va && Re(e2, n3.va)?.delete(t2);
    })), t2.simetric && t2.ele) {
      const n2 = he.get(t2.ele);
      if (n2) {
        const r2 = t2._simetricEntry;
        if (r2 && n2.has(r2)) n2.delete(r2), n2.size || he.delete(t2.ele);
        else {
          const r3 = new Set(Array.from(n2).filter((t3) => t3.ctx !== e2));
          r3.size ? he.set(t2.ele, r3) : he.delete(t2.ele);
        }
      }
      t2._simetricRefTracked && (fe.changeEventsCount && (fe.changeEventsCount--, fe.changeEventsCount > 0 || T && "function" == typeof T.removeEventListener && fe.changeEventsHandler && (T.removeEventListener("input", fe.changeEventsHandler), T.removeEventListener("change", fe.changeEventsHandler), T.removeEventListener("toggle", fe.changeEventsHandler))), delete t2._simetricRefTracked), (function(e3) {
        if (!e3.ele) return;
        const t3 = e3._simetricPatchProp;
        if (!t3) return;
        const n3 = ue.get(e3.ele);
        if (!n3) return void delete e3._simetricPatchProp;
        const r2 = n3.get(t3);
        r2 ? (r2.count--, r2.count <= 0 && (r2.restore(), n3.delete(t3), n3.size || ue.delete(e3.ele)), delete e3._simetricPatchProp) : delete e3._simetricPatchProp;
      })(t2), delete t2._simetricEntry;
    }
  }
  function Ae(e2, t2) {
    let n2 = false;
    if (t2.link.vorc && t2.link.vorc.va && Re(e2, t2.link.vorc.va)?.has(t2) && (n2 = true), t2.link.formula?.vars && t2.link.formula.vars.forEach((r2) => {
      Re(e2, r2)?.has(t2) && (n2 = true);
    }), !n2) {
      const n3 = de.getProperty(e2, "renderElements", false);
      n3?.delete(t2);
    }
    return n2;
  }
  function Se(e2, t2) {
    if (7 == t2.type && t2.prop && t2.link && t2.link.vorc && t2.link.vorc.va) {
      const { prop: n2 } = t2;
      if (n2.startsWith("[") && n2.endsWith("]")) {
        t2._simetricRefTracked || (pe(), t2._simetricRefTracked = true), t2.simetric = true, t2.prop = n2.slice(1, -1);
        const r2 = t2.link.vorc.va, o3 = e2.getContext(r2[0]);
        he.has(t2.ele) || he.set(t2.ele, /* @__PURE__ */ new Set());
        const s2 = { va: r2, ctx: o3, prop: t2.prop };
        he.get(t2.ele)?.add(s2), t2._simetricEntry = s2, (function(e3, t3, n3) {
          if (!e3.ele || !e3.prop) return;
          const r3 = e3.ele, o4 = e3.prop;
          let s3 = ue.get(r3);
          s3 || (s3 = /* @__PURE__ */ new Map(), ue.set(r3, s3));
          const i2 = s3.get(o4);
          if (i2) return i2.count++, void (e3._simetricPatchProp = o4);
          const l3 = r3.constructor?.prototype;
          if (!l3 || !(o4 in l3)) return;
          const a3 = Object.getOwnPropertyDescriptor(l3, o4);
          if (!a3 || "function" != typeof a3.get || "function" != typeof a3.set) return;
          const c3 = Object.prototype.hasOwnProperty.call(r3, o4), f3 = c3 ? Object.getOwnPropertyDescriptor(r3, o4) : void 0;
          Object.defineProperty(r3, o4, { configurable: true, enumerable: a3.enumerable, get: function() {
            return a3.get.call(this);
          }, set: function(e4) {
            if ("value" === o4 && "select" === r3.nodeName?.toLowerCase?.()) {
              const r4 = a3.set.call(this, e4);
              return a3.get.call(this) == e4 ? ve(t3, n3, e4) : console.error("select value not valid", e4 + " not in options"), r4;
            }
            return ve(t3, n3, e4), a3.set.call(this, e4);
          } }), s3.set(o4, { count: 1, restore: () => {
            c3 && f3 ? Object.defineProperty(r3, o4, f3) : delete r3[o4];
          } }), e3._simetricPatchProp = o4;
        })(t2, r2, o3);
      }
    }
  }
  function xe(e2, t2) {
    e2 && (e2.me && e2.me.forEach((e3) => t2.add(e3)), e2.tree && Object.keys(e2.tree).forEach((n2) => {
      xe(e2.tree[n2], t2);
    }));
  }
  function De(e2) {
    if (null != e2) if (Array.isArray(e2)) Oe(e2).forEach((e3) => {
      De(e3);
    });
    else {
      if (e2[X]) {
        for (const { type: t2, handler: n2, options: r2 } of e2[X]) e2.removeEventListener(t2, n2, r2);
        delete e2[X];
      }
      if ("undefined" != typeof Element && e2 instanceof Element) for (; e2.attributes.length > 0; ) e2.removeAttribute(e2.attributes[0].name);
      e2.destroy ? e2.isDestroyed || e2.destroy(true) : e2.parentNode?.removeChild(e2);
    }
  }
  function Be(e2, t2, n2) {
    if (n2 || te.has(t2.mark)) {
      const n3 = de.getProperty(e2, "MarkEle"), r2 = de.getProperty(e2, "memValues");
      t2.ele ? n3.has(t2.mark) && t2.ele != n3.get(t2.mark) && (t2.ele = n3.get(t2.mark), r2.delete(t2)) : t2.mark && (t2.gen ? (n3.has(t2.mark) ? t2.ele = n3.get(t2.mark) : ("function" == typeof t2.gen ? t2.ele = t2.gen(t2.gtpl ? t2.gtpl : e2) : (t2.ele = [], _(t2.ele, t2.gen, t2.gtpl ? t2.gtpl : e2)), n3.set(t2.mark, t2.ele)), delete t2.gen) : n3.has(t2.mark) && (t2.ele = n3.get(t2.mark), r2.delete(t2)));
    }
  }
  var je = /* @__PURE__ */ new WeakMap();
  function Te(e2) {
    if (!Array.isArray(e2.ele) || je.has(e2.ele) || 5 === e2.type) return;
    const t2 = 1 === e2.ele.length ? e2.ele[0] : void 0;
    if (1 === t2?.nodeType || 3 === t2?.nodeType) return;
    const n2 = e2.mark?.ownerDocument || T.document;
    if (!n2?.createComment || !n2?.createDocumentFragment) return;
    const r2 = n2.createComment(""), o3 = n2.createComment("");
    e2.ele.unshift(r2), e2.ele.push(o3);
    const s2 = n2.createDocumentFragment();
    e2.ele.forEach((e3) => s2.appendChild(e3)), je.set(e2.ele, { start: r2, end: o3, storage: s2, hidden: true });
  }
  function Oe(e2) {
    const t2 = je.get(e2);
    if (!t2 || !t2.start.parentNode || t2.start.parentNode !== t2.end.parentNode) return e2;
    const n2 = [];
    for (let e3 = t2.start; e3; e3 = e3.nextSibling) if (n2.push(e3), e3 === t2.end) return n2;
    return e2;
  }
  function Me(e2, t2 = true) {
    if (e2.ele) {
      if (Array.isArray(e2.ele)) {
        Te(e2), Oe(e2.ele).forEach((t4) => {
          e2.mark.parentNode.insertBefore(t4, e2.mark);
        });
        const t3 = je.get(e2.ele);
        t3 && (t3.hidden = false);
      } else e2.mark.parentNode.insertBefore(e2.ele, e2.mark);
      t2 && !te.has(e2.mark) && e2.mark.remove();
    }
  }
  function Ne(e2, t2 = true) {
    if (e2.ele) if (Array.isArray(e2.ele)) {
      const n2 = je.get(e2.ele);
      if (n2?.hidden) return;
      const r2 = Oe(e2.ele);
      t2 && !e2.mark.parentNode && r2[0]?.parentNode && r2[0].parentNode.insertBefore(e2.mark, r2[0]), r2.forEach((e3) => {
        n2 ? n2.storage.appendChild(e3) : e3.remove();
      }), n2 && (n2.hidden = true);
    } else t2 && !e2.mark.parentNode && e2.ele.parentNode && e2.ele.parentNode.insertBefore(e2.mark, e2.ele), e2.ele.remove();
  }
  function Ge(e2, t2, n2) {
    Te(t2);
    const r2 = We(e2, t2), o3 = (function(e3) {
      let t3 = true;
      if (e3.mark.checks) {
        for (let n3 in e3.mark.checks) if (!e3.mark.checks[n3]) {
          t3 = false;
          break;
        }
      }
      return t3;
    })(t2);
    if (n2 && o3) r2 >= 0 && (e2.RenderElements[r2] = t2), t2.mark.parentNode ? Me(t2) : r2 >= 0 && Ae(e2, t2) && ge(e2, t2);
    else {
      r2 >= 0 && delete e2.RenderElements[r2];
      const n3 = Array.isArray(t2.ele) ? t2.ele[0] : t2.ele;
      n3?.parentNode ? Ne(t2) : r2 >= 0 && Ae(e2, t2) && ge(e2, t2);
    }
    return !(n2 && !o3);
  }
  function Le(e2, t2) {
    if (!e2) return;
    if (Array.isArray(e2)) return void e2.forEach((e3) => Le(e3, t2));
    if (8 === e2.nodeType && 6 == e2.textContent?.length) return void (t2[e2.textContent] = e2);
    const n2 = e2.content?.childNodes || e2.childNodes;
    if (n2) for (let e3 = 0, r2 = n2.length; e3 < r2; e3++) Le(n2[e3], t2);
  }
  function We(e2, t2) {
    const n2 = e2.Elements.indexOf(t2.mark);
    return n2 >= 0 && (e2.RenderElements || (e2.RenderElements = {})), n2;
  }
  function ze(e2, t2, n2, r2, o3, s2) {
    const i2 = { parent: t2.gtpl ? t2.gtpl : e2, generator: t2.gen };
    if (n2 && r2) {
      const e3 = {};
      e3[n2.index] = r2.length, e3[n2.target] = o3, i2.context = [n2.index, n2.target], i2.root = e3;
    }
    return void 0 !== s2 && (i2.refresh = s2), new He(i2);
  }
  function qe(e2) {
    return !!e2.link.vorc?.va && !e2.link.formula?.fnc && !e2.link.functions?.length;
  }
  function Ie(e2, t2 = /* @__PURE__ */ new Set()) {
    if (null === (e2 = D(e2)) || "object" != typeof e2) return "function" != typeof e2;
    if (t2.has(e2)) return true;
    const n2 = Object.getPrototypeOf(e2);
    if (n2 !== Object.prototype && n2 !== Array.prototype && null !== n2) return false;
    t2.add(e2);
    for (const n3 of Reflect.ownKeys(e2)) {
      const r2 = Object.getOwnPropertyDescriptor(e2, n3);
      if (!("value" in r2) || !Ie(r2.value, t2)) return false;
    }
    return true;
  }
  function Ve(e2, t2, n2, r2, o3, s2) {
    const i2 = n2.gtpl || t2;
    t2 = be(t2, n2);
    const l3 = null != r2;
    if (n2.mark.checks || (n2.mark.checks = {}), n2.mark.checks[n2.type] = l3, Be(t2, n2, l3), n2.mark.checks || (n2.mark.checks = {}), n2.mark.checks[n2.type] = null != r2, !n2.ele) return t2;
    const a3 = de.getProperty(t2, "memValues");
    if (a3.has(n2) && a3.get(n2) === r2) return t2;
    if (a3.delete(n2), n2.case && n2.case.length) {
      if (n2.eles && n2.eles.length && (n2.eles.forEach((e3) => {
        Ne(e3.refCase), e3.destroy(), i2.GtplChilds.delete(e3);
      }), delete n2.eles), !Ae(t2, n2)) return t2;
      if (l3) {
        if (!n2.case[0].mark) {
          const e3 = {};
          Le(n2.ele, e3);
          for (let t3 = 0, r3 = n2.case.length; t3 < r3; t3++) {
            const r4 = n2.case[t3];
            !r4.mark && r4.uid && (r4.mark = e3[r4.uid]);
          }
        }
        return (function e3(o4) {
          for (let s3 = o4; s3 < n2.case.length; s3++) {
            if (!c3()) return t2;
            const o5 = n2.case[s3], i3 = Ee(t2, o5);
            if (le(i3)) return Promise.resolve(i3).then((n3) => c3() ? n3 == r2 ? f3(o5) : e3(s3 + 1) : t2);
            if (!c3()) return t2;
            if (i3 == r2) return f3(o5);
          }
          return d3();
        })(0);
      }
    }
    return d3();
    function c3() {
      return !t2.isDestroyed && !i2.isDestroyed && oe.get(n2) === s2;
    }
    function f3(e3) {
      const r3 = ze(t2, e3, void 0, void 0, void 0, false);
      return c3() ? (e3.ele = r3.Elements, e3.eles = [r3], r3.refCase = e3, i2.GtplChilds.add(r3), n2.eles = e3.eles, d3()) : (r3.destroy(), t2);
    }
    function d3() {
      if (!c3()) return t2;
      const e3 = Ge(t2, n2, l3);
      if (l3 && n2.eles?.length) {
        const t3 = n2.eles[0];
        (e3 || t3.refCase.mark.parentNode) && (t3.refresh(), Me(t3.refCase));
      }
      return a3.set(n2, r2), t2;
    }
  }
  var He = class _He {
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
    initialState = { pending: 0, settled: false };
    initialReady;
    bindingDepth = 0;
    constructor(e2) {
      this.ID = Math.random().toString(16).slice(2), this.BindTree = {}, this.BindConst = /* @__PURE__ */ new Set(), this.BindDef = /* @__PURE__ */ new Set(), this.GtplChilds = /* @__PURE__ */ new Set(), this.cleanupCallbacks = /* @__PURE__ */ new Set(), this.watchers = /* @__PURE__ */ new Map(), this.BoundEventProxy = this.eventPRoxy.bind(this), this.loadOptions(e2);
    }
    loadOptions(e2) {
      try {
        e2 && (this.Root = e2.root, e2.parent && (this.Parent = e2.parent, this.bindingDepth = (e2.parent.bindingDepth || 0) + 1), e2.context && (this.Context = new Set(e2.context)), e2.generator && (this.FncElements = e2.generator, this.Elements = [], _(this.Elements, this.FncElements, this)), de.setProperty(this, "GenerationFinish", true), void 0 !== e2.refresh && true !== e2.refresh || this.refresh());
      } catch (e3) {
        try {
          this.destroy();
        } catch (e4) {
          console.error("[GTPL] Error cleaning failed construction:", e4);
        }
        throw e3;
      }
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
      this.checkDestroyed("addBind") || (Q.add(e2), 12 === e2.type && e2.mark && te.add(e2.mark), (function(e3, t2) {
        if (10 === t2.type && t2.link?.vorc?.va && t2.ele) {
          const n2 = t2.link.vorc.va;
          return ve(n2, e3, t2.ele, true), e3.onCleanup(() => {
            me(e3, n2) === t2.ele && ve(n2, e3, null);
          }), true;
        }
        if (11 === t2.type && t2.link?.vorc?.va && t2.ele) {
          const n2 = t2.link.vorc.va;
          let r2 = me(e3, n2);
          if (Array.isArray(r2) || (ve(n2, e3, [], true), r2 = me(e3, n2)), !r2.includes(t2.ele)) {
            r2.push(t2.ele);
            const o3 = D(r2);
            e3.onCleanup(() => {
              let r3 = o3;
              try {
                const t3 = me(e3, n2);
                D(t3) === o3 && (r3 = t3);
              } catch {
              }
              const s2 = r3.indexOf(t2.ele);
              -1 !== s2 && r3.splice(s2, 1);
            });
          }
          return true;
        }
        return false;
      })(this, e2) || (function(e3, t2) {
        if (6 == t2.type && t2.prop) {
          const n2 = { gtpl: be(e3, t2), bind: t2 }, r2 = { passive: false }, o3 = function(t3) {
            const r3 = (r4) => {
              if (!e3.isDestroyed && !n2.gtpl.isDestroyed) if ("function" == typeof r4) if (n2.bind.link.params) {
                const o5 = [];
                n2.bind.link.params.forEach((t4) => {
                  null != t4.ct ? o5.push(t4.ct) : null != t4.va && o5.push(me(e3, t4.va));
                }), r4.apply(n2.gtpl.Root, [t3, ...o5]);
              } else r4.apply(n2.gtpl.Root, [t3]);
              else false === r4 && (t3.preventDefault && t3.preventDefault(), t3.stopPropagation && t3.stopPropagation());
            }, o4 = Ee(n2.gtpl, n2.bind, void 0, t3);
            le(o4) ? Promise.resolve(o4).then(r3).catch((e4) => console.error("[GTPL] Event handler failed:", e4)) : r3(o4);
          };
          t2.ele.addEventListener(t2.prop, o3, !!M && r2), t2.ele[X] || (t2.ele[X] = []);
          const s2 = { type: t2.prop, handler: o3, options: !!M && r2 };
          return t2.ele[X].push(s2), e3.onCleanup(() => {
            t2.ele.removeEventListener(s2.type, s2.handler, s2.options);
            const e4 = t2.ele[X];
            if (!e4) return;
            const n3 = e4.indexOf(s2);
            -1 !== n3 && e4.splice(n3, 1), e4.length || delete t2.ele[X];
          }), true;
        }
        return false;
      })(this, e2) || (function(e3, t2) {
        let n2 = false;
        return t2.link.formula && t2.link.formula.vars && t2.link.formula.vars.length && (n2 = true, t2.link.formula.vars.forEach((n3) => {
          Pe(e3, n3, t2);
        })), n2;
      })(this, e2) || (function(e3, t2) {
        let n2 = false;
        return t2.link.vorc && t2.link.vorc.va && (n2 = true, Se(e3, t2), Pe(e3, t2.link.vorc.va, t2)), t2.link.functions && t2.link.functions.forEach((r2) => {
          r2.params && r2.params.forEach((r3) => {
            r3.va && (n2 = true, Pe(e3, r3.va, t2));
          });
        }), n2;
      })(this, e2) || this.BindConst.add(e2), de.getProperty(this, "GenerationFinish") && this.queueChange(4, e2, void 0, void 0, true));
    }
    checkDestroyed(e2) {
      return !!this.isDestroyed && (console.warn(`[GTPL] Cannot perform ${e2} on destroyed component`, this.ID), true);
    }
    destroy(e2 = true) {
      if (this.isDestroyed) return void console.warn("[GTPL] Component already destroyed", this.ID);
      if (this.isDestroyed = true, this.cleanupCallbacks && this.cleanupCallbacks.size > 0 && (this.cleanupCallbacks.forEach((e3) => {
        try {
          e3();
        } catch (e4) {
          console.error("[GTPL] Error in cleanup callback:", e4);
        }
      }), this.cleanupCallbacks.clear()), this.GtplChilds.forEach((t3) => {
        t3.isDestroyed || t3.destroy(e2);
      }), this.GtplChilds.clear(), this.BindDef) {
        for (const e3 of this.BindDef) {
          const t3 = Y.get(e3);
          if (t3) {
            t3.active = false;
            const e4 = t3.original?.get && Z.get(t3.original.get);
            e4?.successors?.delete(t3), t3.successors?.forEach((n3) => {
              n3.original = t3.original, e4 && (e4.successors || (e4.successors = /* @__PURE__ */ new Set())).add(n3);
            }), t3.successors?.clear();
          }
          if (t3 && this.Root && Object.getOwnPropertyDescriptor(this.Root, e3.key)?.get === t3.get) {
            let n3 = t3.original;
            for (; n3?.get; ) {
              const e4 = Z.get(n3.get);
              if (!e4 || e4.active) break;
              n3 = e4.original;
            }
            try {
              Object.defineProperty(this.Root, e3.key, n3 && !("value" in n3) ? n3 : { configurable: true, enumerable: true, writable: true, ...n3, value: D(e3.val) }), n3?.set && n3.set.call(this.Root, D(e3.val));
            } catch (e4) {
              console.error("[GTPL] Error restoring reactive property:", e4);
            }
          }
          Y.delete(e3), x(e3.val, this.BoundEventProxy, e3);
        }
        this.BindDef.clear();
      }
      const t2 = /* @__PURE__ */ new Set(), n2 = /* @__PURE__ */ new Set(), r2 = (t3) => {
        !e2 || t3.gtpl && t3.gtpl !== this || !t3.ele || 1 !== t3.type && 2 !== t3.type && 3 !== t3.type && 12 !== t3.type || n2.add(t3.ele);
      };
      if (this.BindTree && Object.keys(this.BindTree).forEach((e3) => {
        xe(this.BindTree[e3], t2);
      }), this.BindConst && this.BindConst.forEach((e3) => t2.add(e3)), t2.forEach((e3) => {
        r2(e3), Ce(this, e3);
      }), this.BindMap) {
        for (const [e3, t3] of this.BindMap) r2(e3), Ce(t3, e3), J.get(this)?.get(e3)?.forEach((n3) => {
          n3 !== t3 && Ce(n3, e3);
        });
        this.BindMap.clear();
      }
      if (J.delete(this), e2 && (De(this.Elements), n2.forEach((e3) => De(e3)), this.RenderElements)) {
        const e3 = Array.isArray(this.Elements) ? this.Elements.length : 1;
        for (let t3 = 0; t3 < e3; t3++) {
          const e4 = this.RenderElements[t3];
          e4 && (e4.ele && De(e4.ele), e4.eles && De(e4.eles));
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
      if (this.BindMap) for (let [e2, t2] of this.BindMap) t2 instanceof _He ? t2.queueChange(5, e2, void 0, void 0, true) : t2.launchChange(5, e2);
      if (this.BindConst) for (let e2 of this.BindConst) this.queueChange(6, e2, void 0, void 0, true);
    }
    ready() {
      return this.initialReady || (this.initialReady = new Promise((e2, t2) => {
        const n2 = (n3) => {
          this.initialState.settled || (this.initialState.settled = true, this.initialState.reject = void 0, this.cleanupCallbacks.delete(r2), n3 ? t2(n3.error) : e2());
        }, r2 = () => n2({ error: new Error("[GTPL] Component destroyed before ready") });
        this.initialState.reject = (e3) => n2({ error: e3 }), this.onCleanup(r2), this.waitInitialRender().then(() => n2(), (e3) => n2({ error: e3 }));
      })), this.initialReady;
    }
    async waitInitialRender() {
      for (; ; ) {
        if (this.isDestroyed) throw new Error("[GTPL] Component destroyed before ready");
        if (this.initialState.failure) throw this.initialState.failure.error;
        const e2 = this.initialState;
        if (!e2.pending) return;
        e2.idle || (e2.idle = new Promise((t2) => {
          e2.resolveIdle = t2;
        })), await e2.idle;
      }
    }
    trackInitialUpdate(e2, t2) {
      const n2 = e2.initialStates || (e2.initialStates = /* @__PURE__ */ new Set()), r2 = (e3) => {
        for (; e3; ) {
          const t3 = e3.initialState;
          t3.settled || n2.has(t3) || (n2.add(t3), t3.pending++), e3 = e3.Parent;
        }
      };
      r2(this), t2 !== this && r2(t2);
    }
    processRenderAndApply(e2, t2) {
      if (!this.checkDestroyed("addBind")) if (this.RenderElements) {
        const n2 = [];
        (Array.isArray(this.Elements) ? this.Elements : [this.Elements]).forEach((e3, t3) => {
          const r2 = this.RenderElements[t3];
          if (r2) if (r2.ele) {
            const e4 = Array.isArray(r2.ele) ? je.get(r2.ele) : void 0;
            e4 && (e4.hidden = false), n2.push(Array.isArray(r2.ele) ? Oe(r2.ele) : r2.ele), te.has(r2.mark) && n2.push(r2.mark);
          } else r2.eles && (r2.eles.forEach((e4) => e4.addTo(n2)), n2.push(r2.mark));
          else n2.push(e3);
        }), t2(e2, n2, this);
      } else t2(e2, Oe(this.Elements), this);
    }
    addTo(e2) {
      this.processRenderAndApply(e2, _);
    }
    insertAfterTo(e2) {
      this.processRenderAndApply(e2, U);
    }
    insertBeforeTo(e2) {
      this.processRenderAndApply(e2, F);
    }
    watch(e2, t2) {
      if (this.isDestroyed) return () => {
      };
      const n2 = Array.isArray(e2) ? e2.join(".") : e2;
      let r2 = this.watchers.get(n2);
      r2 || this.watchers.set(n2, r2 = /* @__PURE__ */ new Set()), r2.add(t2);
      const o3 = () => {
        if (this.cleanupCallbacks.delete(o3), !this.watchers) return;
        const e3 = this.watchers.get(n2);
        e3 && (e3.delete(t2), e3.size || this.watchers.delete(n2));
      };
      return this.onCleanup(o3), o3;
    }
    emitWatchers(e2, t2, n2, r2) {
      if (!this.watchers || 0 === this.watchers.size) return;
      if (!t2 || !t2.length) return;
      if (t2.some((e3) => "symbol" == typeof e3)) return;
      const o3 = t2.map(String).join(".");
      if (!o3) return;
      const s2 = (t3) => {
        if (this.isDestroyed) return;
        const s3 = this.watchers?.get(t3);
        if (s3) for (const i3 of s3) {
          if (this.isDestroyed) return;
          try {
            i3({ type: e2, path: o3, value: n2, objRef: r2, watch: t3 });
          } catch (e3) {
            console.error("[GTPL watch] error", e3);
          }
        }
      };
      s2(o3);
      const i2 = [];
      for (let e3 = o3.lastIndexOf("."); e3 >= 0; e3 = o3.lastIndexOf(".", e3 - 1)) {
        const t3 = o3.slice(0, e3);
        if (i2.push(t3), s2(t3), 0 === e3) break;
      }
      for (const e3 of i2) s2(e3 + ".*");
      s2("*");
    }
    eventPRoxy(e2, t2, n2, r2) {
      if (this.isDestroyed) return;
      if (this.emitWatchers(e2, t2, n2, r2), this.isDestroyed) return;
      const o3 = Array.isArray(t2) ? t2 : [];
      _He.queueBindings(this, this.BindTree[r2.key], e2, o3, 1);
    }
    static queueBindings(e2, t2, n2, r2, o3) {
      if (t2) {
        if (t2.me) for (const s2 of t2.me) e2.queueChange(n2, s2, r2, void 0, true, o3);
        if (t2.tree) {
          const s2 = r2[o3];
          if (void 0 !== s2) _He.queueBindings(e2, t2.tree[s2], n2, r2, o3 + 1);
          else for (const s3 in t2.tree) _He.queueBindings(e2, t2.tree[s3], n2, r2, o3 + 1);
        }
      }
    }
    launchChange(e2, t2, n2, r2) {
      return this.queueChange(e2, t2, n2, r2);
    }
    queueChange(e2, t2, n2, r2, o3 = false, s2 = 0) {
      if (this.isDestroyed || t2.gtpl?.isDestroyed || 6 === t2.type) return o3 ? void 0 : Promise.resolve();
      let i2 = re.get(t2);
      const l3 = n2 ? n2.length - s2 : 0, a3 = o3 && 5 === t2.type && qe(t2) && (0 === e2 || 1 === e2) && l3 > 0, c3 = a3 && "symbol" != typeof n2[s2] && /^(0|[1-9]\d*)$/.test(String(n2[s2])) ? Number(n2[s2]) : void 0, f3 = void 0 !== c3 && l3 > 1;
      if (i2) 5 === t2.type && (i2.listUpdate = i2.listUpdate && a3, i2.listNestedOnly = i2.listNestedOnly && f3), i2.type = 4, i2.path = void 0, i2.value = void 0;
      else {
        const o4 = oe.get(t2);
        o4 && (o4.initialStates?.size && ne(o4), o4.resolve?.()), i2 = { context: this, type: e2, path: l3 > 0 ? n2.slice(s2) : void 0, value: r2, reportErrors: false }, 5 === t2.type && (i2.listUpdate = a3, i2.listNestedOnly = f3), re.set(t2, i2), oe.set(t2, i2);
      }
      const d3 = t2.gtpl || this;
      void 0 !== c3 && ((i2.listTouched || (i2.listTouched = /* @__PURE__ */ new Set())).add(c3), 0 === e2 && 1 === l3 && (i2.listIndices || (i2.listIndices = /* @__PURE__ */ new Set())).add(c3));
      const h3 = i2.initialStates?.has(this.initialState), u3 = i2.checkedCaller === this ? !!i2.initialStates?.size : h3 || !this.getGtplRoot().initialState.settled || d3 !== this && !d3.getGtplRoot().initialState.settled || !d3.initialState.settled && Q.has(t2);
      return i2.checkedCaller = this, o3 || (function(e3) {
        e3.promise || (e3.promise = new Promise((t3, n3) => {
          e3.resolve = t3, e3.reject = n3;
        })), ae(e3), e3.promise;
      })(i2), u3 && !h3 && this.trackInitialUpdate(i2, d3), o3 && !u3 && (i2.reportErrors = true, ae(i2)), se && !se.seen.has(t2) && _He.enqueueFlushBinding(t2, i2), se || ie || (ie = true, queueMicrotask(_He.flushChanges)), i2.promise;
    }
    static flushChanges() {
      ie = false, se = { queues: [], positions: [], seen: /* @__PURE__ */ new Set(), depth: 0 };
      for (const [e2, t2] of re) _He.enqueueFlushBinding(e2, t2);
      for (; se.depth < se.queues.length; ) {
        const e2 = se.depth, t2 = se.queues[e2], n2 = se.positions[e2] || 0;
        if (!t2 || n2 >= t2.length) {
          se.depth++;
          continue;
        }
        const r2 = t2[n2];
        se.positions[e2] = n2 + 1;
        const o3 = re.get(r2);
        if (o3) if (re.delete(r2), o3.context.isDestroyed || r2.gtpl?.isDestroyed) ce(r2, o3);
        else try {
          const e3 = o3.context.applyChange(o3.type, r2, o3.path, o3.value, o3);
          le(e3) ? Promise.resolve(e3).then(() => ce(r2, o3), (e4) => ce(r2, o3, { error: e4 })) : ce(r2, o3);
        } catch (e3) {
          ce(r2, o3, { error: e3 });
        }
      }
      se = void 0, re.size && !ie && (ie = true, queueMicrotask(_He.flushChanges));
    }
    static enqueueFlushBinding(e2, t2) {
      const n2 = se, r2 = (e2.gtpl || t2.context).bindingDepth;
      (n2.queues[r2] || (n2.queues[r2] = [])).push(e2), n2.seen.add(e2), r2 < n2.depth && (n2.depth = r2);
    }
    applyChange(e2, t2, n2, r2, o3) {
      const s2 = Ee(this, t2, r2);
      return le(s2) ? Promise.resolve(s2).then((r3) => this.applyResult(e2, t2, n2, r3, o3)) : this.applyResult(e2, t2, n2, s2, o3);
    }
    applyResult(e2, t2, n2, r2, o3) {
      if (this.isDestroyed || t2.gtpl?.isDestroyed || oe.get(t2) !== o3) return;
      let s2 = false, l3 = false;
      if (5 === t2.type) {
        const e3 = D(r2), n3 = ee.get(t2);
        if (qe(t2) && Array.isArray(e3)) {
          let r3 = false;
          if (o3.listUpdate && n3?.rows === e3 && n3.ordinary && o3.listTouched) {
            r3 = true;
            for (const t3 of o3.listTouched) {
              const n4 = Object.getOwnPropertyDescriptor(e3, t3);
              if (n4 && (!("value" in n4) || !Ie(n4.value))) {
                r3 = false;
                break;
              }
            }
          } else r3 = Ie(e3);
          ee.set(t2, { rows: e3, ordinary: r3 }), s2 = !!o3.listUpdate && r3, l3 = s2 && !!o3.listNestedOnly && n3?.rows === e3 && t2.eles?.length === e3.length;
        } else ee.delete(t2);
        Array.isArray(e3) && (r2 = s2 ? e3 : Array.from(e3, (e4) => D(e4)));
      }
      let a3 = this;
      switch (t2.type) {
        case 0:
          a3 = (function(e3, t3, n3, r3) {
            t3 = be(t3, n3);
            const o4 = de.getProperty(t3, "memValues");
            if (null != r3) {
              if (o4.has(n3) && o4.get(n3) == r3) return t3;
              o4.set(n3, r3);
            }
            return n3.ele.textContent = r3, t3;
          })(0, this, t2, r2);
          break;
        case 7:
          a3 = (function(e3, t3, n3, r3) {
            t3 = be(t3, n3);
            const o4 = (e4, t4) => {
              if (void 0 !== n3.ele[e4] && null !== n3.ele[e4]) {
                if (null == t4) "" !== n3.ele[e4] && (n3.ele[e4] = null);
                else if (n3.ele[e4] != t4) try {
                  n3.ele[e4] = t4;
                } catch (t5) {
                  i(t5.message, n3.ele, e4);
                }
              } else null == t4 ? n3.ele.removeAttribute(e4) : n3.ele.getAttribute(e4) != t4 && n3.ele.setAttribute(e4, t4);
            };
            if (n3.prop) o4(n3.prop, r3);
            else if (null == r3) n3.attrs && (n3.attrs.forEach((e4) => {
              o4(e4, null);
            }), delete n3.attrs);
            else {
              n3.attrs || (n3.attrs = []), n3.attrs.filter((e4) => !(e4 in r3)).forEach((e4) => {
                o4(e4, null);
              }), n3.attrs.length = 0;
              for (let e4 in D(r3)) n3.attrs.push(e4), o4(e4, r3[e4]);
            }
            return t3;
          })(0, this, t2, r2);
          break;
        case 9:
          a3 = (function(e3, t3, n3, r3) {
            return t3 = be(t3, n3), void 0 !== r3 && n3.ele.innerHTML != r3 && (n3.ele.innerHTML = r3), t3;
          })(0, this, t2, r2);
          break;
        case 8:
          a3 = (function(e3, t3, n3, r3) {
            t3 = be(t3, n3);
            const o4 = de.getProperty(t3, "memValues");
            return o4.has(n3) && o4.get(n3) == r3 || (o4.set(n3, r3), n3.prop && (n3.ele.style[n3.prop] = r3)), t3;
          })(0, this, t2, r2);
          break;
        case 1:
        case 2:
          a3 = (function(e3, t3, n3, r3) {
            t3 = be(t3, n3);
            const o4 = 2 == n3.type ? !r3 : !!r3;
            if (n3.mark.checks || (n3.mark.checks = {}), n3.mark.checks[n3.type] = o4, Be(t3, n3, o4), !n3.ele) return t3;
            const s3 = de.getProperty(t3, "memValues");
            return s3.has(n3) && s3.get(n3) === o4 || Ge(t3, n3, o4) && s3.set(n3, o4), t3;
          })(0, this, t2, r2);
          break;
        case 5:
          l3 || (a3 = (function(e3, t3, n3, r3, o4, s3 = false, i2) {
            const l4 = n3.gtpl || t3;
            t3 = be(t3, n3), n3.eles || (n3.eles = []);
            const a4 = n3.eles, c3 = n3.link.index, f3 = [], d3 = [], h3 = r3?.length || 0;
            for (let e4 = 0; e4 < h3; e4++) {
              const o5 = D(r3[e4]);
              if (e4 >= a4.length) {
                const r4 = ze(t3, n3, c3, a4, o5, false);
                a4.push(r4), f3.push([r4, e4]);
              } else {
                const t4 = a4[e4].Root;
                s3 && !i2?.has(e4) && Object.is(D(t4[c3.target]), o5) || (t4[c3.target] = o5);
              }
            }
            if (a4.length > h3 && a4.splice(h3).forEach((e4, t4) => d3.push([e4, t4])), d3.length && d3.forEach((e4) => {
              const [t4, n4] = e4;
              t4.destroy(), l4.GtplChilds.delete(t4);
            }), f3.length) {
              const e4 = We(t3, n3);
              e4 >= 0 && (t3.RenderElements[e4] || (t3.RenderElements[e4] = n3));
              const r4 = [];
              f3.forEach((e5) => {
                const [t4, n4] = e5;
                t4.addTo(r4), l4.GtplChilds.add(t4);
              }), n3.mark.parentNode ? (Me({ type: n3.type, link: n3.link, ele: r4, mark: n3.mark }, false), f3.forEach((e5) => {
                e5[0].refresh();
              })) : e4 >= 0 && Ae(t3, n3) && ge(t3, n3);
            }
            return t3;
          })(0, this, t2, r2, 0, s2, o3.listIndices));
          break;
        case 3:
          a3 = Ve(0, this, t2, r2, 0, o3);
          break;
        case 12:
          a3 = (function(e3, t3, n3, r3) {
            const o4 = n3.gtpl || t3;
            t3 = be(t3, n3);
            const s3 = null != r3, i2 = de.getProperty(t3, "memValues");
            if (i2.has(n3) && i2.get(n3) == r3) return t3;
            i2.set(n3, r3), n3.mark.checks || (n3.mark.checks = {}), n3.mark.checks[n3.type] = s3;
            let l4 = false;
            if (n3.eles) l4 = true, n3.eles[0].destroy(), o4.GtplChilds.delete(n3.eles[0]), delete n3.eles;
            else if (n3.ele && (Ne(n3), n3.attrs)) for (const e4 of n3.attrs) Array.isArray(e4) || Ce(t3, e4);
            if (o4.isDestroyed || t3.isDestroyed) return t3;
            if (!s3) return delete n3.ele, de.getProperty(t3, "MarkEle").delete(n3.mark), Ge(t3, n3, false), t3;
            if (l4 && !Ae(t3, n3)) return t3;
            const a4 = 11 === r3.nodeType ? Array.from(r3.childNodes) : r3;
            if (Array.isArray(a4) || "function" == typeof a4) {
              const e4 = ze(t3, { link: n3.link, type: n3.type, gtpl: n3.gtpl, gen: a4 });
              n3.eles = [e4], o4.GtplChilds.add(e4), n3.ele = e4.Elements;
            } else {
              const e4 = D(r3);
              n3.attrs && $(n3.attrs, e4, t3), n3.ele = e4;
            }
            return de.getProperty(t3, "MarkEle").set(n3.mark, n3.ele), Ge(t3, n3, s3), t3;
          })(0, this, t2, r2);
      }
      if (le(a3)) return Promise.resolve(a3).then((e3) => {
        e3.isDestroyed || this.isDestroyed || t2.gtpl?.isDestroyed || oe.get(t2) !== o3 || ye(e3, t2);
      });
      a3.isDestroyed || oe.get(t2) !== o3 || ye(a3, t2);
    }
  };
  var _e = { GTpl: He, GAddTo: _, GInsertAfterTo: U, GInsertBeforeTo: F, GregisterDirective: K, GGenerator: H, GProxy: A, unGProxy: x, utils: { log: s, stack: i, css2obj: e, style2css: t, globalObject: T, passiveSupported: M, isGProxy: C, toRaw: D, PROXYTARGET: a, ISPROXY: l } };

  // node_modules/@mpeliz/gtpl/dist/gtpl.esm.js
  var h2 = ["abstract", "await", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "default", "delete", "do", "double", "else", "enum", "export", "extends", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import", "in", "instanceof", "int", "interface", "let", "long", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield", "arguments", "async", "eval", "undefined"];
  var o2 = class {
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
      let t2 = null;
      return this.r && 1 == this.r.length && (t2 = this.r[0]), t2;
    }
    setString(t2) {
      this.s = t2, this.l = t2.length, this.i = 0, this.r = [];
    }
    setAceptedAN(t2 = "_") {
      this.arr_acepted = Array.from(t2).map((t3) => t3.charCodeAt(0));
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
    nop(t2 = false, i2 = null) {
      let s2 = null;
      for (this.ln = null; ; ) {
        if (s2 = this.s[this.i], i2 && i2.includes(s2)) return true;
        let e2 = " " == s2 || "	" == s2 || "\r" == s2 || "\n" == s2;
        if (!e2 && t2 && (e2 = '"' != s2 && "'" != s2 && !this.isAN(s2), e2 && (this.ln = s2)), !e2) return true;
        if (!this.next()) return false;
      }
    }
    isAN(t2, i2 = true) {
      if (null == t2) return false;
      let s2;
      for (let e2 = 0, n2 = t2.length, r2 = 0; e2 < n2; e2++) if (r2 = t2.charCodeAt(e2), s2 = r2 > 64 && r2 < 91 || r2 > 96 && r2 < 123 || this.arr_acepted.indexOf(r2) >= 0, i2 && (s2 = s2 || r2 > 47 && r2 < 58), !s2) return false;
      return true;
    }
    getVOrC() {
      let t2 = this.s[this.i];
      if ('"' == t2 || "'" == t2) return { ct: this.getConst() };
      if (this.isAN(t2, false)) return { va: this.getVar() };
      if (this.isNumber(t2)) {
        const t3 = this.i, i2 = this.getNumber();
        if (null !== i2) return { ct: i2 };
        this.i = t3;
      }
      return null;
    }
    getVar(t2 = true) {
      let i2, s2 = this.s[this.i], e2 = null;
      for (; ; ) {
        if (!this.next()) return "" != s2 ? s2.split(".") : null;
        if (e2 = this.s[this.i], i2 = this.isAN(e2), t2 && !i2 && (i2 = "." == e2), !i2) return s2.split(".");
        s2 += e2;
      }
    }
    getConst() {
      const t2 = this.s[this.i];
      if (!this.next()) return null;
      let i2 = this.s[this.i];
      if (i2 == t2) return i2 = "", this.next() ? i2 : null;
      let s2 = null, e2 = null;
      for (; ; ) {
        if (!this.next()) return null;
        if (s2 = this.s[this.i], s2 == t2 && "\\" != e2) return this.next() ? i2 : null;
        i2 += s2, e2 = s2;
      }
    }
    isNumber(t2) {
      const i2 = t2.charCodeAt(0);
      return i2 >= 48 && i2 <= 57;
    }
    getNumber() {
      let t2 = this.s[this.i], i2 = null, s2 = false;
      for (; this.next(); ) {
        if (i2 = this.s[this.i], "." == i2) {
          if (s2) return null;
          s2 = true;
        } else if (!this.isNumber(i2)) break;
        t2 += i2;
      }
      return t2;
    }
    check() {
      let t2, i2, s2, e2 = 0, n2 = "", r2 = false;
      for (; ; ) {
        if (this.checkStart()) {
          if (r2 = true, "" != n2 && (this.r.push(n2), n2 = ""), t2 = {}, this.i += 2, e2 = this.i, !this.nop()) return false;
          if (i2 = this.getVOrC(), i2) {
            for (t2.vorc = i2; ; ) {
              if (!this.nop()) return false;
              if (s2 = this.s[this.i], ":" == s2) {
                if (!this.next()) return false;
                if (!this.nop()) return false;
                const e3 = this.getVar();
                if (null === e3) return false;
                t2.functions || (t2.functions = []);
                const n3 = { name: e3 };
                if (t2.functions.push(n3), !this.nop()) return false;
                if (s2 = this.s[this.i], "(" == s2) {
                  if (!this.next()) return false;
                  if (!this.nop()) return false;
                  if (s2 = this.s[this.i], null == s2) break;
                  if (")" == s2) {
                    if (!this.next()) return false;
                    continue;
                  }
                  for (; ; ) {
                    if (i2 = this.getVOrC(), !i2) return false;
                    if (n3.params || (n3.params = []), n3.params.push(i2), !this.nop()) return false;
                    if (s2 = this.s[this.i], null == s2) break;
                    if ("," != s2) {
                      if (")" == s2) {
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
            if (s2 = this.s[this.i], "{" == s2) {
              if (!this.next()) return false;
              for (; ; ) {
                if (!this.nop()) return false;
                if (s2 = this.s[this.i], null == s2) break;
                if ("}" == s2) {
                  if (!this.next()) return false;
                  if (!this.nop()) return false;
                  break;
                }
                if ("," != s2) {
                  if (i2 = this.getVOrC(), !i2) return false;
                  t2.params || (t2.params = []), t2.params.push(i2);
                } else if (!this.next()) return false;
              }
            }
            if (s2 = this.s[this.i], ";" == s2) {
              if (!this.next()) return false;
              if (!this.nop()) return false;
              const i3 = this.getVar(false);
              if (null === i3) return false;
              if (!this.nop()) return false;
              if (s2 = this.s[this.i], ";" != s2) return false;
              {
                if (!this.next()) return false;
                if (!this.nop()) return false;
                const s3 = this.getVar(false);
                if (null === s3) return false;
                t2.index = { index: i3.join(""), target: s3.join("") };
              }
            }
            if (!this.nop()) return false;
            if (this.checkEnd()) this.i++, this.r.push(t2);
            else if (!this.searchFormula(e2)) return false;
          } else if (!this.searchFormula(e2)) return false;
        } else n2 += this.s[this.i];
        if (!this.next()) break;
      }
      return "" != n2 && this.r.push(n2), r2;
    }
    startsRegex() {
      const t2 = this.s.substring(0, this.i).trimEnd();
      return "" === t2 || /[({\[=,:;!?&|~%^<>*]$/.test(t2) || /(?:^|[^\w.$])(?:return|throw|case|yield|await|typeof|void|delete|in|of|instanceof)$/.test(t2) || /(?:^|[^+])\+$/.test(t2) || /(?:^|[^-])-$/.test(t2);
    }
    skipRegex() {
      this.i++;
      let t2 = false;
      for (; this.i < this.l; ) {
        const i2 = this.s[this.i++];
        if ("\\" === i2) this.i++;
        else if ("[" === i2) t2 = true;
        else if ("]" === i2) t2 = false;
        else if ("/" === i2 && !t2 || "\n" === i2) return;
      }
    }
    searchFormula(t2) {
      this.i = t2;
      const i2 = (t3) => {
        for (this.i++; this.i < this.l; ) {
          const i3 = this.s[this.i++];
          if ("\\" === i3) this.i++;
          else {
            if (i3 === t3) return;
            "`" === t3 && "$" === i3 && "{" === this.s[this.i] && (this.i++, s2(true));
          }
        }
      }, s2 = (t3) => {
        let s3 = 0;
        for (; this.i < this.l; ) {
          const e3 = this.s[this.i];
          if ('"' !== e3 && "'" !== e3 && "`" !== e3) if ("/" !== e3 || "/" !== this.s[this.i + 1]) if ("/" !== e3 || "*" !== this.s[this.i + 1]) if ("/" === e3 && this.startsRegex()) this.skipRegex();
          else {
            if ("{" === e3) s3++;
            else if ("}" === e3) if (s3 > 0) s3--;
            else {
              if (t3) return this.i++, true;
              if (this.checkEnd()) return true;
            }
            this.i++;
          }
          else {
            for (this.i += 2; this.i < this.l && "*/" !== this.s.substring(this.i, this.i + 2); ) this.i++;
            this.i += 2;
          }
          else for (this.i += 2; this.i < this.l && "\n" !== this.s[this.i]; ) this.i++;
          else i2(e3);
        }
        return false;
      };
      if (!s2(false)) return false;
      const e2 = this.s.substring(t2, this.i);
      return this.i++, this.r.push({ formula: { code: e2, vars: this.findVars(e2) } }), true;
    }
    findVars(t2) {
      let s2 = t2.trim();
      const e2 = this.s, n2 = this.i, r2 = this.l;
      this.s = s2, this.l = s2.length, this.i = 0;
      let o3 = [];
      const u3 = (t3) => {
        const i2 = o3.find((i3) => i3[0] === t3[0]);
        if (!i2) return void o3.push(t3);
        let s3 = 1;
        for (; s3 < i2.length && s3 < t3.length && i2[s3] === t3[s3]; ) s3++;
        i2.length = s3;
      };
      let a3 = [[]];
      const l3 = (t3) => {
        a3[a3.length - 1].push(t3);
      }, f3 = (t3) => a3.some((i2) => i2.indexOf(t3) >= 0), c3 = () => {
        for (; this.i < this.l && /\s/.test(this.s[this.i]); ) this.i++;
      }, d3 = (t3) => {
        for (this.i++; this.i < this.l; ) if ("\\" === this.s[this.i]) this.i += 2;
        else {
          if (this.s[this.i] === t3) {
            this.i++;
            break;
          }
          this.i++;
        }
      }, p3 = () => {
        for (this.i++; this.i < this.l; ) if ("\\" === this.s[this.i]) this.i += 2;
        else if ("$" === this.s[this.i] && "{" === this.s[this.i + 1]) {
          this.i += 2;
          let t3 = 1;
          const i2 = this.i;
          for (; this.i < this.l && t3 > 0; ) "{" === this.s[this.i] ? t3++ : "}" === this.s[this.i] && t3--, this.i++;
          const s3 = this.s.substring(i2, this.i - 1);
          this.findVars(s3).forEach((t4) => {
            f3(t4[0]) || u3(t4);
          });
        } else {
          if ("`" === this.s[this.i]) {
            this.i++;
            break;
          }
          this.i++;
        }
      }, m3 = () => {
        const t3 = this.i, i2 = this.getVOrC();
        if (i2 && i2.va) {
          let s3 = t3 - 1;
          for (; s3 >= 0 && /\s/.test(this.s[s3]); ) s3--;
          return s3 >= 0 && "." === this.s[s3] ? null : i2.va;
        }
        return null;
      }, g3 = () => {
        if ("(" !== this.s[this.i]) return false;
        const t3 = this.i;
        let i2 = 0;
        for (; this.i < this.l; ) {
          const t4 = this.s[this.i];
          if ("(" === t4) i2++;
          else if (")" === t4 && (i2--, 0 === i2)) break;
          this.i++;
        }
        const s3 = this.s.substring(t3 + 1, this.i);
        return this.i++, c3(), "=>" === this.s.substr(this.i, 2) && (s3.split(",").forEach((t4) => {
          const i3 = t4.trim();
          i3 && l3(i3);
        }), this.i += 2, true);
      }, $3 = () => {
        if ("catch" === this.s.substr(this.i, 5) && !this.isAN(this.s[this.i + 5])) {
          if (this.i += 5, c3(), "(" === this.s[this.i]) {
            this.i++, c3();
            const t3 = m3();
            for (t3 && l3(t3[0]); this.i < this.l && ")" !== this.s[this.i]; ) this.i++;
            ")" === this.s[this.i] && this.i++;
          }
          return true;
        }
        return false;
      }, y3 = () => {
        if ("function" === this.s.substr(this.i, 8) && !this.isAN(this.s[this.i + 8])) {
          this.i += 8, c3();
          const t3 = m3();
          if (t3 && l3(t3[0]), c3(), "(" === this.s[this.i]) {
            this.i++;
            let t4 = "";
            for (; this.i < this.l && ")" !== this.s[this.i]; ) t4 += this.s[this.i], this.i++;
            ")" === this.s[this.i] && this.i++, t4.split(",").forEach((t5) => {
              const i2 = t5.trim();
              i2 && l3(i2);
            });
          }
          return true;
        }
        return false;
      }, N3 = ["const", "var", "let", "function"];
      for (; this.i < this.l && (c3(), !(this.i >= this.l)); ) {
        const t3 = this.s[this.i];
        if ("catch" === this.s.substr(this.i, 5) && !this.isAN(this.s[this.i + 5])) {
          $3();
          continue;
        }
        if ("function" === this.s.substr(this.i, 8) && !this.isAN(this.s[this.i + 8])) {
          y3();
          continue;
        }
        if ("/" === t3 && "/" === this.s[this.i + 1]) {
          for (this.i += 2; this.i < this.l && "\n" !== this.s[this.i]; ) this.i++;
          continue;
        }
        if ("/" === t3 && "*" === this.s[this.i + 1]) {
          for (this.i += 2; this.i < this.l && ("*" !== this.s[this.i] || "/" !== this.s[this.i + 1]); ) this.i++;
          this.i += 2;
          continue;
        }
        if ("/" === t3 && this.startsRegex()) {
          this.skipRegex();
          continue;
        }
        if ('"' === t3 || "'" === t3) {
          d3(t3);
          continue;
        }
        if ("`" === t3) {
          p3();
          continue;
        }
        if ("{" === t3) {
          a3.push([]), this.i++;
          continue;
        }
        if ("}" === t3) {
          a3.pop(), this.i++;
          continue;
        }
        if ("(" === t3) {
          const t4 = this.i;
          if (g3()) continue;
          this.i = t4;
        }
        const s3 = this.i, e3 = m3();
        if (e3) {
          if (N3.indexOf(e3[0]) >= 0) {
            c3();
            const t5 = m3();
            t5 && l3(t5[0]);
            continue;
          }
          if (void 0 !== T[e3[0]]) continue;
          if (h2.indexOf(e3[0]) >= 0) continue;
          let t4 = this.i;
          for (; t4 < this.l && /\s/.test(this.s[t4]); ) t4++;
          let n3 = s3 - 1;
          for (; n3 >= 0 && /\s/.test(this.s[n3]); ) n3--;
          if (":" === this.s[t4] && ("{" === this.s[n3] || "," === this.s[n3])) continue;
          if (f3(e3[0])) continue;
          "(" === this.s[t4] && e3.length > 1 && e3.pop(), u3(e3);
          continue;
        }
        this.i++;
      }
      return this.s = e2, this.i = n2, this.l = r2, o3;
    }
  };
  var u2;
  function a2(t2, i2, s2, e2) {
    return `g('${t2}',${i2 ?? "null"},${s2 ?? "null"},o${e2 && "http://www.w3.org/1999/xhtml" !== e2 ? "," + JSON.stringify(e2) : ""})`;
  }
  function l2(t2, i2, s2) {
    if (s2) {
      let e2 = [];
      return s2.forEach((t3) => {
        e2.push("const " + t3.var + "=" + t3.gen + ";");
      }), "((o)=>{" + e2.join("") + "return " + t2 + "})" + (i2 ? "" : "(o)");
    }
    return "((o)=>" + t2 + ")" + (i2 ? "" : "(o)");
  }
  function f2(t2, i2, s2, e2) {
    let n2 = p2([t2], true);
    return n2 = n2.substring(0, n2.length - 1), n2 = n2 + ',"gen":' + (s2 || i2) + (e2 || "") + "}", n2;
  }
  function c2(t2, i2, s2, e2, n2, r2) {
    return t2.uid = i2, s2 ? ("" != e2 && (e2 += ","), e2 += f2(t2, i2, void 0, r2)) : ("" != n2 && (n2 += ","), n2 += f2(t2, i2, void 0, r2)), { jsonAttr2: e2, jsonAttr: n2 };
  }
  function d2(t2, i2, s2) {
    let r2 = null;
    switch (i2) {
      case "g-is":
        r2 = r2 || 12;
      case "g-binds":
        r2 = r2 || 11;
      case "g-bind":
        r2 = r2 || 10;
      case "g-attr":
        r2 = r2 || 7;
      case "g-if":
        r2 = r2 || 1;
      case "g-notif":
        r2 = r2 || 2;
      case "g-switch":
        r2 = r2 || 3;
      case "g-case":
        r2 = r2 || 4;
      case "g-for":
        r2 = r2 || 5;
      case "g-inner":
        if (r2 = r2 || 9, u2.setString(`{{${s2}}}`), u2.check()) {
          const i3 = { type: r2, link: u2.getSingleResult() };
          return t2.push(i3), true;
        }
        break;
      case "g-tpl":
        return r2 = r2 || 13, t2.push({ type: r2, link: { vorc: { ct: s2 } } }), true;
      case "g-style":
        s2.includes("{{") || (s2 = `{{${s2}}}`);
      case "style":
        let h3 = "";
        if (u2.setString(s2), u2.check()) {
          let i3 = u2.getResult();
          if (i3 && i3.length) {
            if (1 == i3.length) return t2.push({ type: 8, prop: "cssText", link: i3[0] }), true;
            const r3 = e(s2);
            for (const [s3, e2] of Object.entries(r3)) u2.setString(e2), u2.check() ? (i3 = u2.getSingleResult(), t2.push({ type: 8, prop: s3, link: i3 })) : (h3 += h3 ? ";" : "", h3 += `${t(s3)}:${e2}`);
            return "" != h3 && t2.push(["style", h3]), true;
          }
        }
        break;
      default:
        if (u2.setString(s2), u2.check()) {
          const s3 = u2.getResult();
          if (s3 && 1 == s3.length) {
            const e2 = i2.startsWith("on"), n2 = { type: e2 ? 6 : 7, prop: e2 ? i2.substring(2) : i2, link: s3[0] };
            return t2.push(n2), true;
          }
        }
    }
    return false;
  }
  function p2(t2, i2 = false) {
    const e2 = t2.map((t3) => {
      if (Array.isArray(t3) || "string" == typeof t3) return JSON.stringify(t3);
      {
        const i3 = t3;
        if (i3.link?.formula) {
          return `{${Object.entries(i3).map(([t4, i4]) => {
            if ("link" === t4) {
              return `"${t4}":{${Object.entries(i4).map(([t5, i5]) => {
                if ("formula" === t5) {
                  const { vars: e3, code: n2 } = i5;
                  if (null != n2) {
                    const i6 = e3?.map((t6) => t6[0]).join(",") || "", s2 = /\bawait\b/.test(n2) ? " async " : "", r2 = `{${n2}}`;
                    return `"${t5}":{"vars":${JSON.stringify(e3)},"fnc":${s2}function(${i6})${r2}}`;
                  }
                  s("formula without code");
                }
                return `"${t5}":${JSON.stringify(i5)}`;
              }).join(",")}}`;
            }
            return `"${t4}":${JSON.stringify(i4)}`;
          }).join(",")}}`;
        }
        return JSON.stringify(t3);
      }
    });
    return i2 ? e2.join(",") : `[${e2.join(",")}]`;
  }
  var m2 = 0;
  var g2 = 0;
  function $2() {
    g2 >= 60466176 && (g2 = 0, m2++, m2 >= 26 && (m2 = 0));
    const t2 = String.fromCharCode(97 + m2), i2 = g2.toString(36).padStart(5, "0");
    return g2++, t2 + i2;
  }
  function y2(t2, i2 = 0, s2 = null) {
    let e2 = 0;
    return { statements: [], nodes: [], nextId: t2 ?? (() => `$${i2}_${(e2++).toString(36)}`), depth: i2, methods: s2 };
  }
  var N2 = { createElement: "$e", createElementNS: "$n", createTextNode: "$t", createComment: "$c", appendChild: "$a", addAttributes: "$s", addBind: "$b" };
  function b2(t2, i2) {
    if (!t2.methods) return `.${i2}`;
    const s2 = N2[i2];
    return t2.methods.set(i2, s2), `[${s2}]`;
  }
  function x2(t2, i2 = true) {
    const s2 = i2 ? `[${t2.nodes.map((t3) => t3.name).join(",")}]` : t2.nodes[0].name, e2 = t2.statements.slice();
    for (const i3 of t2.nodes) for (const t3 of i3.statements) e2.push(t3);
    return `(o)=>{${e2.join("")}return ${s2};}`;
  }
  function w2(t2, i2, s2, e2, n2 = false, r2) {
    const h3 = n2 ? t2.nextId() : e2.nextId(), o3 = [];
    for (const t3 of e2.nodes) t3.eager && o3.push(...t3.statements);
    const u3 = r2 && "http://www.w3.org/1999/xhtml" !== r2;
    o3.push(`const ${h3}=d${b2(t2, u3 ? "createElementNS" : "createElement")}(${u3 ? JSON.stringify(r2) + "," : ""}${JSON.stringify(i2)});`);
    for (const i3 of e2.nodes) i3.eager ? o3.push(`${h3}${b2(t2, "appendChild")}(${i3.name});`) : o3.push("{", ...i3.statements, `${h3}${b2(t2, "appendChild")}(${i3.name});`, "}");
    return "[]" !== s2 && o3.push(`g${b2(t2, "addAttributes")}(${s2},${h3},o);`), t2.nodes.push({ name: h3, statements: o3, eager: n2 }), h3;
  }
  function v2(t2, s2, e2, n2, r2) {
    null == u2 && (u2 = new o2());
    let h3 = /* @__PURE__ */ (function() {
      const t3 = [];
      return { add(i2) {
        t3.push(i2);
      }, addComma(i2, s3) {
        if (t3.length) {
          let i3 = true;
          const e3 = t3[t3.length - 1];
          s3?.includes(e3) && (i3 = false), i3 && t3.push(",");
        }
        t3.push(i2);
      }, addCommaOnly(i2) {
        if (t3.length) {
          let s3 = true;
          const e3 = t3[t3.length - 1];
          i2?.includes(e3) && (s3 = false), s3 && t3.push(",");
        }
      }, toString: (i2 = "", s3 = "") => i2 + t3.join("") + s3 };
    })();
    const m3 = (t3, i2) => {
      if (!r2) return void h3.addComma(a2(t3, i2), ["["]);
      const s3 = r2.nextId(), e3 = "#text" === t3, n3 = !i2.startsWith("["), o3 = [`const ${s3}=d${b2(r2, e3 ? "createTextNode" : "createComment")}(${n3 ? i2 : '""'});`];
      if (!n3) {
        const t4 = i2.slice(1, -2);
        o3.push(`o${b2(r2, "addBind")}(${t4},${e3 ? "ele" : "mark"}:${s3}});`);
      }
      r2.nodes.push({ name: s3, statements: o3, eager: true });
    }, g3 = (t3) => {
      if (!r2) return void h3.add(t3);
      const i2 = r2.nextId();
      r2.nodes.push({ name: i2, statements: [`const ${i2}=${t3};`], eager: !s2 });
    };
    let N3, k3, C3, S2, A2, O2, j2, E2, R2, V2, J2, I2, L2, F2, T2, U2;
    for (var _2 = 0, G2 = t2.length; _2 < G2; _2++) {
      var z2 = t2[_2];
      switch (N3 = k3 = C3 = S2 = A2 = O2 = null, V2 = J2 = I2 = L2 = F2 = "", z2.nodeType) {
        case 1:
          {
            if ("script" == z2.nodeName.toLowerCase()) {
              r2 ? w2(r2, z2.nodeName, "[]", y2(r2.nextId), true) : h3.addComma(a2(z2.nodeName, JSON.stringify(z2.textContent)), ["["]);
              continue;
            }
            j2 = z2, T2 = [];
            for (let t4 = 0, i2 = j2.attributes.length, s3 = j2.attributes; t4 < i2; t4++) {
              const i3 = s3.item(t4);
              if (i3) if (d2(T2, i3.name, i3.value)) {
                if (T2.length) {
                  const t5 = T2[T2.length - 1];
                  if (t5) {
                    if (12 == t5.type && (A2 = t5, T2.pop()), 1 != t5.type && 2 != t5.type || (S2 = t5, T2.pop()), 5 == t5.type && (N3 = t5, T2.pop()), 3 == t5.type && (k3 = t5, T2.pop()), 4 == t5.type) {
                      if (!n2) throw new Error("not switch");
                      n2.case || (n2.case = []), n2.case.push(t5), C3 = t5, C3.index = n2.case.length - 1, T2.pop();
                    }
                    13 == t5.type && (O2 = t5, T2.pop());
                  }
                }
              } else T2.push([i3.name, i3.value]);
            }
            if (N3 && C3) throw new Error("not for and case " + Array.from(j2.attributes, (t4) => t4.name + '="' + t4.value + '"').join(" "));
            if (S2 && C3) throw new Error("not if and case " + Array.from(j2.attributes, (t4) => t4.name + '="' + t4.value + '"').join(" "));
            if (A2 && (C3 || k3 || O2)) throw new Error("not is and ( case or switch ot tpl ) " + Array.from(j2.attributes, (t4) => t4.name + "=" + t4.value + '"').join(" "));
            h3.addCommaOnly(["["]);
            const t3 = "template" == j2.nodeName.toLowerCase() && (A2 || S2 || C3 || N3 || k3), e3 = A2 || S2 || C3 || N3 || k3, o3 = !O2 && T2.every((t4) => Array.isArray(t4)) && Array.from(j2.childNodes).every((t4) => 3 === t4.nodeType && !(t4.nodeValue || "").includes("{{")), u3 = !s2 || o3, m4 = O2 && "template" === j2.nodeName.toLowerCase() && !t3, b3 = r2 ? e3 ? y2(void 0, 0, r2.methods) : u3 || m4 ? y2(r2.nextId, r2.depth, r2.methods) : y2(void 0, r2.depth + 1, r2.methods) : void 0;
            if (O2) {
              const e4 = O2.link.vorc.ct, n3 = T.document.getElementById(e4);
              n3 ? (E2 = "template" == j2.nodeName.toLowerCase() ? s2 : j2, R2 = "template" == n3.nodeName.toLowerCase() ? n3.content.childNodes : [n3], V2 = v2(R2, t3 || m4 && void 0 === E2 ? null : E2, !m4, k3, b3)) : console.error("template " + e4 + " undefined.");
            } else E2 = "template" == j2.nodeName.toLowerCase() ? j2.content : j2, R2 = E2.childNodes, V2 = v2(R2, t3 ? null : E2, true, k3, b3);
            if (A2 || S2 || C3 || N3 || k3) {
              U2 = $2(), J2 = "", I2 = "";
              const t4 = [];
              if (F2 = p2(T2), A2 && (A2.attrs = T2, { jsonAttr2: I2, jsonAttr: J2 } = c2(A2, U2, N3, I2, J2)), S2 && ({ jsonAttr2: I2, jsonAttr: J2 } = c2(S2, U2, N3, I2, J2)), k3) {
                k3.uid = U2;
                const i3 = k3.case;
                delete k3.case, L2 = "", i3 && i3.forEach((i4) => {
                  if (i4.common && (i4.common.forEach((i5) => t4.push(i5)), delete i4.common), i4.gen) {
                    const t5 = i4.gen;
                    delete i4.gen, "" != L2 && (L2 += ","), L2 += f2(i4, null, t5);
                  }
                }), { jsonAttr2: I2, jsonAttr: J2 } = c2(k3, U2, N3, I2, J2, ',"case":[' + L2 + "]");
              }
              let i2;
              if (r2 && b3) if ("template" === j2.nodeName.toLowerCase()) i2 = x2(b3);
              else {
                const t5 = y2(b3.nextId, b3.depth, r2.methods);
                w2(t5, j2.nodeName, F2, b3, false, j2.namespaceURI), i2 = x2(t5, false);
              }
              O2 ? "template" == j2.nodeName.toLowerCase() ? t4.push({ var: U2, gen: i2 ?? l2(V2, true) }) : t4.push({ var: U2, gen: i2 ?? l2(a2(j2.nodeName, F2, V2, j2.namespaceURI), true) }) : t4.push({ var: U2, gen: A2 ? "null" : i2 ?? ("template" == j2.nodeName.toLowerCase() ? l2(V2, true) : l2(a2(j2.nodeName, F2, V2, j2.namespaceURI), true)) }), C3 ? (C3.uid = U2, C3.gen = U2, C3.common = t4, g3(l2(a2("#comment", "[" + JSON.stringify(U2) + "," + J2 + "]"), r2 ? null : s2))) : N3 ? (S2 || A2 || k3 ? (N3.uid = $2(), "" != J2 && (J2 += ","), J2 += f2(N3, N3.uid), t4.push({ var: N3.uid, gen: l2(a2("#comment", "[" + JSON.stringify(U2) + "," + I2 + "]"), true) })) : (N3.uid = U2, "" != J2 && (J2 += ","), J2 += f2(N3, U2)), g3(l2(a2("#comment", "[" + JSON.stringify(N3.uid) + "," + J2 + "]"), r2 ? null : s2, t4))) : g3(l2(a2("#comment", "[" + JSON.stringify(U2) + "," + J2 + "]"), r2 ? null : s2, t4));
            } else if (r2 && b3) O2 && "template" === j2.nodeName.toLowerCase() ? (r2.statements.push(...b3.statements), r2.nodes.push(...b3.nodes)) : w2(r2, j2.nodeName, p2(T2), b3, u3, j2.namespaceURI);
            else if (O2 && "template" == j2.nodeName.toLowerCase()) h3.add(V2);
            else {
              const t4 = a2(j2.nodeName, p2(T2), V2, j2.namespaceURI);
              h3.add(o3 ? t4 : l2(t4, s2));
            }
          }
          break;
        case 3:
          {
            let t3 = true;
            if (z2.nodeValue && (u2.setString(z2.nodeValue), u2.check())) {
              t3 = false;
              const i2 = u2.getResult();
              i2 && i2.length && i2.forEach((t4) => {
                m3(z2.nodeName, "string" == typeof t4 ? JSON.stringify(t4) : p2([{ type: 0, prop: "textContent", link: t4 }]));
              });
            }
            t3 && m3(z2.nodeName, JSON.stringify(z2.nodeValue));
          }
          break;
        case 6:
          m3(z2.nodeName, JSON.stringify(z2.nodeValue));
      }
    }
    if (r2) return "";
    const B2 = h3.toString(false !== e2 ? "[" : "", false !== e2 ? "]" : "");
    return void 0 === s2 ? "(o)=>" + B2 : B2;
  }
  function k2(t2) {
    return new DOMParser().parseFromString("<body>" + t2.trim(), "text/html").body.childNodes;
  }
  var C2 = { ..._e, jit: { GCompile: function(i2, s2) {
    return new Function("g", `return ${i2};`)(s2 || H);
  }, GCode: function(t2) {
    return v2("string" == typeof t2 ? k2(t2) : t2 instanceof Node ? [t2] : t2);
  }, GCodeOptimized: function(t2, i2) {
    const s2 = y2(void 0, 0, i2?.methodAliases ? /* @__PURE__ */ new Map() : null);
    if (s2.statements.push("const d=g.getDocument();"), v2("string" == typeof t2 ? k2(t2) : t2 instanceof Node ? [t2] : t2, void 0, void 0, void 0, s2), s2.methods?.size) {
      const t3 = Array.from(s2.methods, ([t4, i3]) => `${i3}=${JSON.stringify(t4)}`);
      s2.statements.push(`const ${t3.join(",")};`);
    }
    return x2(s2);
  } } };

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
          if (!response.ok) {
            throw new Error(`Template request failed: ${response.status} ${response.statusText} (${classMeta.templateUrl})`);
          }
          html = await response.text();
        }
        const compiled = C2.jit.GCode(html);
        classMeta.templateFactory = C2.jit.GCompile(compiled);
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
    const gtplobj = new C2.GTpl(options);
    return gtplobj;
  }

  // src/decorators/component.decorator.ts
  var COMPONENT_REGISTRY = /* @__PURE__ */ new Map();
  function getRegisteredComponent(name) {
    return COMPONENT_REGISTRY.get(name);
  }
  function toKebabCase(x3) {
    return x3.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();
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
  var getFlags = (host) => host[COMP_FLAGS];
  var getMeta = (ctor) => ctor[CLASS_META];
  function getControllerFromComponent(component) {
    return component[COMP_CTRL];
  }
  function isHostCreated(ele) {
    return ele[HOST_CREATE] === true ? true : false;
  }
  function initComponentHost(host, ControllerClass, baseMeta, useWebComponent, ...args) {
    const ctrl = new ControllerClass(...args);
    defineHidden(host, COMP_CTRL, ctrl, { writable: true, configurable: true });
    defineHidden(ctrl, "$el", host);
    const flags = { firstRender: true, stylesApplied: false, destroyed: false };
    defineHidden(host, COMP_FLAGS, flags, { configurable: true });
    defineHidden(host, COMP_GTPL, null, { writable: true, configurable: true });
    defineHidden(ctrl, "destroy", function() {
      if (flags.destroyed) return;
      flags.destroyed = true;
      try {
        ctrl.onDestroy?.();
      } finally {
        const destroyChildren = (node) => {
          for (const child of Array.from(node.children)) {
            const childCtrl = getControllerFromComponent(child);
            if (childCtrl) {
              try {
                childCtrl.destroy?.();
              } catch (error) {
                console.error(error);
              }
            } else {
              destroyChildren(child);
              if (child.shadowRoot) destroyChildren(child.shadowRoot);
            }
          }
        };
        destroyChildren(host.$host ?? host);
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
        host[COMP_MOUNT] = null;
        host[COMP_CTRL] = null;
      }
    }.bind(ctrl));
    ctrl.onConstruct?.(...args);
    if (flags.destroyed) return host;
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
    defineHidden(host, COMP_MOUNT, mountTemplateIfReady, { writable: true, configurable: true });
    const loadTemplate = () => {
      const gtpl = instantiateTemplate(ctrl, classMeta.templateFactory);
      host[COMP_GTPL] = gtpl;
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
      if (flags.destroyed) return;
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
            getCtrl(this)?.onConnect?.();
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
              ele = C2.utils.globalObject.document.createElement("div");
              ele.setAttribute("g-component", tagName);
              defineHidden(ele, HOST_CREATE, true);
            }
            const host = initComponentHost(ele, ControllerClass, baseMeta, false, ...args);
            if (!getFlags(host).destroyed) host.appendChild(new GWatcher(getCtrl(host)));
            return host;
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
      this.completionListeners = /* @__PURE__ */ new WeakSet();
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
        listeners2.sort((a3, b3) => (b3.priority ?? 0) - (a3.priority ?? 0));
        global2.set(event, listeners2);
        return handler;
      }
      const ns = this.getNamespace(options.namespace);
      const listeners = ns.get(event) || [];
      listeners.push({ handler, once: options.once, priority: options.priority ?? 0 });
      listeners.sort((a3, b3) => (b3.priority ?? 0) - (a3.priority ?? 0));
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
    off(event, handler, namespace) {
      const nsName = namespace ?? (event === "*" ? "__GLOBAL__" : "default");
      const ns = this.namespaces.get(nsName);
      const handlers = ns?.get(event);
      if (!handlers) return;
      const remaining = handlers.filter((l3) => l3.handler !== handler);
      if (remaining.length) ns.set(event, remaining);
      else ns.delete(event);
      if (!ns.size) this.namespaces.delete(nsName);
    }
    offAll(event, namespace) {
      const nsName = namespace ?? (event === "*" ? "__GLOBAL__" : "default");
      if (event !== void 0) {
        const ns = this.namespaces.get(nsName);
        ns?.delete(event);
        if (ns && !ns.size) this.namespaces.delete(nsName);
      } else {
        this.removeAllListeners(nsName);
      }
    }
    removeListener(event, listener, namespace) {
      const ns = this.namespaces.get(namespace);
      const listeners = ns?.get(event);
      if (!listeners) return;
      const remaining = listeners.filter((candidate) => candidate !== listener);
      if (remaining.length) ns.set(event, remaining);
      else ns.delete(event);
      if (!ns.size) this.namespaces.delete(namespace);
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
      const ns = this.namespaces.get(namespace);
      const handlers = ns?.get(event);
      const wildcardLocal = ns?.get("*");
      const globalWildcardListeners = this.namespaces.get("__GLOBAL__")?.get("*") ?? [];
      const allHandlers = [
        ...(handlers ?? []).map((listener) => ({ listener, event, namespace, wildcard: event === "*" })),
        ...(event === "*" ? [] : wildcardLocal ?? []).map((listener) => ({ listener, event: "*", namespace, wildcard: true })),
        ...(namespace === "__GLOBAL__" ? [] : globalWildcardListeners).map((listener) => ({ listener, event: "*", namespace: "__GLOBAL__", wildcard: true }))
      ];
      if (allHandlers.length === 0) return;
      for (const entry of allHandlers) {
        if (entry.listener.once) this.removeListener(entry.event, entry.listener, entry.namespace);
      }
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
      };
      const ordinary = allHandlers.filter((entry) => !this.completionListeners.has(entry.listener));
      const completion = allHandlers.filter((entry) => this.completionListeners.has(entry.listener));
      const execute = (entry) => runHandler(entry.listener, entry.wildcard);
      if (!options?.sequential) {
        await Promise.all(ordinary.map(execute));
      } else {
        for (const entry of ordinary) await execute(entry);
      }
      await Promise.all(completion.map(execute));
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
        const handler = (payload) => {
          clearTimeout(timer);
          resolve(payload);
        };
        if (timeoutMs) {
          timer = setTimeout(() => {
            this.off(event, handler, namespace);
            reject(new Error(`Timeout esperando evento completo "${String(event)}" (${namespace})`));
          }, timeoutMs);
        }
        const listener = { handler, once: true };
        this.completionListeners.add(listener);
        const ns = this.getNamespace(namespace);
        const listeners = ns.get(event) ?? [];
        listeners.push(listener);
        ns.set(event, listeners);
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
      this.navigationSequence = 0;
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
        const m3 = route.url.match(/\*([A-Za-z0-9_]+)/);
        if (m3) {
          const key = m3[1];
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
        let m3;
        while (m3 = reToken.exec(pattern)) {
          const start = m3.index;
          const raw = m3[0];
          const name = m3[1];
          const isOptional = raw[1] === "?";
          built += this.escapeRegexLiteral(pattern.slice(cursor, start));
          paramKeys.push(name);
          if (isOptional) optional.add(name);
          const frag = route.regex?.[name] ?? "[^/]+";
          const capture = `(?<__gtpl_${paramKeys.length - 1}>${frag})`;
          if (isOptional && pattern[start - 1] === "/") {
            built = built.slice(0, -1) + `(?:/${capture})?`;
          } else {
            built += capture + (isOptional ? "?" : "");
          }
          cursor = start + raw.length;
        }
        built += this.escapeRegexLiteral(pattern.slice(cursor));
      }
      if (new RegExp(`^(?:${built})$`).test("")) built = `(?:${built}|/)`;
      const hasChildren = Array.isArray(route.childs) && route.childs.length > 0;
      const shouldAnchorLeaf = this.options.anchorLeafRoutes && !hasChildren && !isWildcard;
      const final = "^" + built + (shouldAnchorLeaf ? "$" : "");
      route.regexurl = new RegExp(final);
      route.paramKeys = paramKeys;
      route.optional = Array.from(optional);
      if (!route.params) route.params = {};
      for (const k3 of paramKeys) {
        if (!(k3 in route.params)) route.params[k3] = null;
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
        const group = `__gtpl_${idx - 1}`;
        const val = matchArray.groups && group in matchArray.groups ? matchArray.groups[group] : matchArray[idx];
        idx++;
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
      return [...routes].sort((a3, b3) => this.routeSpecificity(b3.url) - this.routeSpecificity(a3.url));
    }
    /** Resuelve un path (sin query), recursivo sobre childs */
    async resolvePath(path, routes, seedParams) {
      const normalRoutes = routes.filter((r2) => !r2.wildcard && r2.url !== "*" && r2.url !== "/*");
      const wildcardRoutes = routes.filter((r2) => r2.wildcard || r2.url === "*" || r2.url === "/*");
      const candidates = [...this.orderedRoutes(normalRoutes), ...wildcardRoutes];
      for (const r2 of candidates) {
        this.compilePattern(r2);
        const m3 = path.match(r2.regexurl);
        if (!m3) continue;
        const localParams = this.extractParams(r2, m3);
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
      const template = chain.map((r2) => r2.url).map((u3) => u3.startsWith("/") ? u3 : "/" + u3).join("");
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
      url = url.replace(/\*([A-Za-z0-9_]+)/g, (_m, key) => String(params?.[key] ?? ""));
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
      sp.forEach((v3, k3) => out[k3] = v3);
      return Object.keys(out).length ? out : null;
    }
    buildQueryString(query) {
      if (!query) return "";
      const sp = new URLSearchParams();
      for (const [k3, v3] of Object.entries(query)) {
        if (v3 == null) continue;
        sp.append(k3, String(v3));
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
        const [p4] = part.split("?");
        return this.normalizePath(p4 || "/");
      }
      const full = window.location.pathname;
      const base = this.options.base || "";
      let rel = full.startsWith(base) ? full.slice(base.length) : full;
      const [p3] = rel.split("?");
      return this.normalizePath(p3 || "/");
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
    retainDataFor(path) {
      for (const key of this.transientData.keys()) {
        if (key !== path) this.transientData.delete(key);
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
      const sequence = ++this.navigationSequence;
      const isCurrent = () => sequence === this.navigationSequence;
      const path = this.currentPathFromLocation();
      const query = ev.query ?? this.currentQueryFromLocation() ?? null;
      const isHistory = this.options.mode === "history";
      const isHash = this.options.mode === "hash";
      const base = this.options.base;
      const prev = this.active;
      let match = this.historyCache.get(path) || null;
      if (!match) {
        const res = await this.resolvePath(path, this.urls);
        if (!isCurrent()) return;
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
            if (!isCurrent()) return;
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
          this.retainDataFor(viewRoute.fullPath);
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
          this.retainDataFor(null);
          try {
            this.cb?.("notfound", null, prev ?? null);
          } catch (e2) {
            this.log("Callback error:", e2);
          }
          this.log("route notfound:", path);
          return;
        }
      } else {
        match = { ...match, params: { ...match.params }, query: query ? { ...query } : void 0 };
        const routeDef = this.ids.get(match.id);
        const mw = await this.runMiddlewareChain(routeDef, match);
        if (!isCurrent()) return;
        if (!mw.ok) {
          const redirectTo = match.redirect || mw.redirect;
          if (redirectTo) {
            this.setLocation(redirectTo, void 0, false);
            return;
          }
          this.active = null;
          this.retainDataFor(null);
          try {
            this.cb?.("notfound", null, prev ?? null);
          } catch (e2) {
            this.log("Callback error:", e2);
          }
          return;
        }
        if (this.beforeChange) {
          const ok = await this.beforeChange(prev ?? null, match);
          if (!isCurrent()) return;
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
        this.retainDataFor(match.fullPath);
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
      for (const [url, m3] of this.historyCache) {
        if (m3.object === gurldel.obj) {
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
      this.navigationSequence++;
      if (this.hashchangebind) window.removeEventListener("hashchange", this.hashchangebind);
      if (this.popstatebind) window.removeEventListener("popstate", this.popstatebind);
      this.historyCache.clear();
      this.transientData.clear();
      this.cb = void 0;
      this.beforeChange = void 0;
      this.afterChange = void 0;
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
     * usando una copia cuando la ruta ya existe en caché.
     * NO modifica el router ni dispara eventos.
     */
    async matchPath(pathOrUrl) {
      const [pathPart, queryPart] = pathOrUrl.split("?");
      const norm = this.normalizePath(pathPart || "/");
      const cached = this.historyCache.get(norm);
      if (cached) {
        const match2 = { ...cached, params: { ...cached.params } };
        const query = this.parseQueryString(queryPart ?? "");
        if (query) match2.query = query;
        else delete match2.query;
        const routeDef = this.ids.get(match2.id);
        const mw = await this.runMiddlewareChain(routeDef, match2);
        if (!mw.ok) {
          if (mw.redirect) return { ...match2, redirect: mw.redirect };
          return null;
        }
        return match2;
      }
      const match = await this.resolvePath(norm, this.urls);
      if (!match) return null;
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
      const success = C2.GregisterDirective(name, constructor);
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
      this.cls = Array.isArray(value) ? Array.from(value) : String(value || "").split(/\s+/);
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

@mpeliz/gtpl/dist/shared/runtime.esm.js:
@mpeliz/gtpl/dist/gtpl.esm.js:
  (*!
  * @mpeliz/gtpl v3.1.0
  * (c) 2024 Manuel Peliz
  * @license Apache-2.0
  * @repository [object Object]
  *)
*/
//# sourceMappingURL=gtplweb-docs.js.map
