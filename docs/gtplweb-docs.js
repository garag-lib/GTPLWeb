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
      if ('"' === o2 || "'" === o2) {
        let n3 = 0;
        for (let i3 = t3 - 1; i3 >= 0 && "\\" === e2[i3]; i3--) n3++;
        n3 % 2 == 0 && (i2 === o2 ? i2 = null : i2 || (i2 = o2));
      }
      i2 || ("(" === o2 && s2++, ")" === o2 && s2--), i2 || 0 !== s2 || ";" !== o2 ? n2 += o2 : (r2(n2), n2 = "");
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
  function s(e2) {
    if (null === e2) return true;
    return "function" === typeof e2 || ("undefined" != typeof Window && e2 instanceof Window || ("undefined" != typeof Node && e2 instanceof Node || ("undefined" != typeof DOMTokenList && e2 instanceof DOMTokenList || ("undefined" != typeof NodeList && e2 instanceof NodeList || ("undefined" != typeof HTMLCollection && e2 instanceof HTMLCollection || (!!(e2 instanceof Date || e2 instanceof RegExp || e2 instanceof Map || e2 instanceof Set || e2 instanceof WeakMap || e2 instanceof WeakSet || e2 instanceof ArrayBuffer || ArrayBuffer.isView(e2)) || !Object.isExtensible(e2)))))));
  }
  function r(...e2) {
    console.log("%c----------", "font-weight:bold"), console.log(...e2), console.log("%c----------", "font-weight:bold");
  }
  function o(e2, ...t2) {
    const n2 = new Error(e2);
    console.error("%cSTACK ERROR:", "color:red;font-weight:bold", e2), r(n2.stack, ...t2);
  }
  var l = /* @__PURE__ */ Symbol("is proxy");
  var a = /* @__PURE__ */ Symbol("proxy target");
  var c = /* @__PURE__ */ new WeakMap();
  var h = /* @__PURE__ */ new WeakMap();
  var f = /* @__PURE__ */ new WeakMap();
  var u = /* @__PURE__ */ new WeakMap();
  var d = /* @__PURE__ */ new WeakMap();
  function p() {
    return { children: /* @__PURE__ */ new Map(), targets: /* @__PURE__ */ new Set() };
  }
  function g(e2) {
    return "object" == typeof e2 && null !== e2 || "function" == typeof e2;
  }
  function m(e2, t2, n2, i2) {
    let s2 = f.get(e2);
    s2 || (s2 = [], f.set(e2, s2));
    const r2 = Array.isArray(i2) ? i2.slice() : [];
    if (!s2.some((e3) => {
      return e3.event === t2 && e3.objRef === n2 && (i3 = e3.parentPath, s3 = r2, i3.length === s3.length && i3.every((e4, t3) => e4 === s3[t3]));
      var i3, s3;
    })) {
      const i3 = { event: t2, objRef: n2, parentPath: r2 };
      s2.push(i3), (function(e3, t3) {
        if (!g(t3.objRef)) return;
        let n3 = d.get(t3.objRef);
        n3 || d.set(t3.objRef, n3 = /* @__PURE__ */ new Map());
        let i4 = n3.get(t3.event) || p();
        n3.set(t3.event, i4);
        for (const e4 of t3.parentPath) {
          let t4 = i4.children.get(e4);
          t4 || i4.children.set(e4, t4 = p()), i4 = t4;
        }
        i4.targets.add(e3);
      })(e2, i3);
    }
    if (g(n2)) {
      let t3 = u.get(n2);
      t3 || (t3 = /* @__PURE__ */ new Set(), u.set(n2, t3)), t3.add(e2);
    }
  }
  function y(e2, t2, n2) {
    if (i(t2) || E(t2) || s(t2)) return t2;
    let r2 = t2;
    return (f.get(e2)?.slice() ?? []).forEach((e3) => {
      r2 = w(t2, e3.event, e3.objRef, [...e3.parentPath, n2]);
    }), r2;
  }
  function v(e2, t2, n2, i2) {
    E(e2) && (e2 = e2[a]);
    const s2 = f.get(e2);
    if (!s2) return;
    const r2 = s2.filter((e3) => e3.event === t2 && (void 0 === n2 || e3.objRef === n2) && (!i2 || e3.parentPath.length >= i2.length && i2.every((t3, n3) => e3.parentPath[n3] === t3)));
    if (!r2.length) return;
    const o2 = s2.filter((e3) => !r2.includes(e3));
    if (r2.forEach((t3) => {
      if ((function(e3, t4) {
        if (!g(t4.objRef)) return;
        const n4 = d.get(t4.objRef);
        let i3 = n4?.get(t4.event);
        if (!i3) return;
        const s3 = [i3];
        for (const e4 of t4.parentPath) {
          if (i3 = i3.children.get(e4), !i3) return;
          s3.push(i3);
        }
        i3.targets.delete(e3);
        for (let e4 = s3.length - 1; e4 > 0 && !s3[e4].targets.size && !s3[e4].children.size; e4--) s3[e4 - 1].children.delete(t4.parentPath[e4 - 1]);
        s3[0].targets.size || s3[0].children.size || n4.delete(t4.event), n4.size || d.delete(t4.objRef);
      })(e2, t3), !g(t3.objRef)) return;
      if (o2.some((e3) => e3.objRef === t3.objRef)) return;
      const n3 = u.get(t3.objRef);
      n3?.delete(e2), 0 === n3?.size && u.delete(t3.objRef);
    }), o2.length > 0) f.set(e2, o2);
    else {
      f.delete(e2);
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
  function k(e2, t2) {
    for (const n2 of e2) {
      if (!g(n2.objRef)) continue;
      const e3 = [...n2.parentPath, t2];
      let i2 = d.get(n2.objRef)?.get(n2.event);
      for (const t3 of e3) i2 = i2?.children.get(t3);
      if (!i2) continue;
      const s2 = /* @__PURE__ */ new Set(), r2 = [i2];
      for (; r2.length; ) {
        const e4 = r2.pop();
        e4.targets.forEach((e5) => s2.add(e5)), e4.children.forEach((e5) => r2.push(e5));
      }
      for (const t3 of s2) v(t3, n2.event, n2.objRef, e3);
    }
  }
  function b(e2, t2, n2) {
    if (E(e2) && (e2 = e2[a]), void 0 === n2) {
      return new Set((f.get(e2) ?? []).filter((e3) => e3.event === t2 && g(e3.objRef)).map((e3) => e3.objRef)).forEach((n3) => b(e2, t2, n3)), void v(e2, t2);
    }
    if (void 0 !== n2 && g(n2)) {
      const e3 = u.get(n2);
      if (e3) return Array.from(e3).forEach((e4) => v(e4, t2, n2)), void (0 === e3.size && u.delete(n2));
    }
    v(e2, t2, n2);
  }
  function E(e2) {
    return !!e2 && "object" == typeof e2 && true === e2[l];
  }
  function w(e2, t2, n2, r2 = []) {
    if (i(e2) || s(e2)) return e2;
    m(e2, t2, n2, r2);
    const o2 = c.get(e2);
    if (o2) return o2.proxy;
    const u2 = (d2 = e2, { get(e3, t3, n3) {
      if (t3 === l) return true;
      if (t3 === a) return d2;
      if (t3 === Symbol.iterator) {
        const t4 = e3[Symbol.iterator];
        return "function" != typeof t4 ? t4 : function* () {
          if (Array.isArray(e3) && t4 === Array.prototype[Symbol.iterator]) for (let t5 = 0; t5 < e3.length; t5++) yield y(d2, e3[t5], String(t5));
          else for (const n4 of t4.call(e3)) yield y(d2, n4, Symbol.iterator);
        };
      }
      const i2 = Reflect.get(e3, t3, n3);
      return y(d2, i2, t3);
    }, set(e3, t3, n3, s2) {
      n3 = C(n3);
      const r3 = Reflect.get(e3, t3, s2);
      if (i(r3) && Object.is(r3, n3)) {
        const n4 = Reflect.getOwnPropertyDescriptor(e3, t3);
        if (n4 && "value" in n4 && n4.writable && s2 === c.get(d2)?.proxy) return true;
      }
      const o3 = Array.isArray(e3) ? e3.length : void 0, l2 = void 0 !== o3 && "length" === t3 && ("number" != typeof n3 || n3 < o3) ? Reflect.ownKeys(e3) : void 0, a2 = Reflect.set(e3, t3, n3, s2), h2 = void 0 === o3 ? void 0 : e3.length;
      if (a2 || void 0 !== o3 && h2 !== o3) {
        const i2 = l2?.filter((t4) => !Reflect.getOwnPropertyDescriptor(e3, t4)), c2 = f.get(d2)?.slice() ?? [];
        a2 && g(r3) && C(r3) !== C(Reflect.get(e3, t3, s2)) && k(c2, t3), i2?.forEach((e4) => k(c2, e4)), c2.forEach((i3) => i3.event(0, [...i3.parentPath, t3], a2 ? n3 : Reflect.get(e3, t3, s2), i3.objRef)), "length" !== t3 && void 0 !== o3 && h2 !== o3 && c2.forEach((e4) => e4.event(0, [...e4.parentPath, "length"], h2, e4.objRef)), i2?.forEach((e4) => c2.forEach((t4) => t4.event(1, [...t4.parentPath, e4], void 0, t4.objRef)));
      }
      return a2;
    }, deleteProperty(e3, t3) {
      const n3 = Reflect.getOwnPropertyDescriptor(e3, t3), i2 = Reflect.deleteProperty(e3, t3);
      if (i2) {
        const e4 = f.get(d2)?.slice() ?? [];
        n3 && k(e4, t3), e4.forEach((e5) => e5.event(1, [...e5.parentPath, t3], void 0, e5.objRef));
      }
      return i2;
    }, has: (e3, t3) => Reflect.has(e3, t3), ownKeys: (e3) => Reflect.ownKeys(e3), getOwnPropertyDescriptor: (e3, t3) => Reflect.getOwnPropertyDescriptor(e3, t3) });
    var d2;
    const { proxy: p2, revoke: v2 } = Proxy.revocable(e2, u2);
    return c.set(e2, { proxy: p2, revoke: v2 }), h.set(p2, e2), p2;
  }
  function R(e2, t2, n2) {
    const i2 = C(e2);
    return b(i2, t2, n2), i2;
  }
  function C(e2) {
    let t2 = e2;
    for (; g(t2); ) {
      const e3 = h.get(t2);
      if (e3) t2 = e3;
      else {
        if (!E(t2)) break;
        t2 = t2[a];
      }
    }
    return t2;
  }
  var A = null;
  function x(e2) {
    return e2 && e2.Math === Math && e2;
  }
  try {
    A = x("object" == typeof globalThis && globalThis) || x("object" == typeof window && window) || x("object" == typeof self && self) || x("object" == typeof global && global) || /* @__PURE__ */ (function() {
      return this;
    })() || Function("return this")();
  } catch (e2) {
  }
  var P = A;
  var N = null;
  try {
    const e2 = { get passive() {
      return N = true, false;
    } };
    P.addEventListener("test", null, e2), P.removeEventListener("test", null, e2);
  } catch (e2) {
    N = false;
  }
  var S = N;
  var j = /* @__PURE__ */ new Map();
  var $ = /* @__PURE__ */ new WeakMap();
  function D(e2, t2, n2, i2, s2) {
    const r2 = j.get(t2);
    if (!r2) return false;
    const o2 = new r2(e2, n2, i2, s2);
    let l2 = $.get(e2);
    return l2 || (l2 = [], $.set(e2, l2)), l2.push(o2), o2;
  }
  function O(e2, t2, n2) {
    return n2 && (e2.mark = n2), t2 && (e2.ele = t2), e2;
  }
  function B(e2, t2, n2, i2) {
    Array.isArray(t2) ? t2.forEach((t3) => B(e2, t3, n2, i2)) : "function" != typeof t2 ? null != t2 && (Array.isArray(e2) ? e2.push(t2) : i2(e2, t2)) : B(e2, t2(n2), n2, i2);
  }
  function T(e2, t2, n2) {
    let i2 = t2;
    const s2 = [];
    for (; ; ) if ("function" != typeof i2) {
      if (Array.isArray(i2)) for (let e3 = i2.length - 1; e3 >= 0; e3--) s2.push(i2[e3]);
      else null != i2 && (Array.isArray(e2) ? e2.push(i2) : e2.appendChild(i2));
      if (0 === s2.length) return;
      i2 = s2.pop();
    } else i2 = i2(n2);
  }
  function M(e2, t2, n2, i2, s2) {
    let r2 = null;
    switch (e2) {
      case "#text":
        null == r2 && (r2 = P.document.createTextNode("")), "string" == typeof t2 && (r2.textContent = t2);
      case "#comment":
        return null == r2 && (r2 = P.document.createComment("")), "string" == typeof t2 ? r2.textContent = t2 : t2.forEach((e3) => {
          "string" != typeof e3 ? Array.isArray(e3) ? console.error(r2, e3) : 0 == e3.type ? i2.addBind(O(e3, r2)) : i2.addBind(O(e3, void 0, r2)) : r2.textContent = e3;
        }), r2;
      default:
        const o2 = s2 && "http://www.w3.org/1999/xhtml" !== s2 ? P.document.createElementNS(s2, e2) : P.document.createElement(e2);
        return T(o2, n2, i2), L(t2, o2, i2), o2;
    }
  }
  function G(e2) {
    if (j.has(e2)) return { dirName: e2, arg: null };
    const [t2, n2] = e2.split(":");
    return j.has(t2) ? { dirName: t2, arg: n2 } : null;
  }
  function L(e2, t2, n2) {
    if (!Array.isArray(e2)) return;
    const i2 = [];
    e2.forEach((e3) => {
      if (Array.isArray(e3)) {
        const n3 = G(e3[0]);
        n3 ? i2.push([e3, n3]) : t2.setAttribute(e3[0], e3[1]);
      } else {
        const s2 = e3;
        let r2 = null;
        s2.prop && (r2 = G(s2.prop), r2 && i2.push([s2, r2])), r2 || n2.addBind(O(s2, t2));
      }
    }), i2.forEach((e3) => {
      const i3 = e3[0], s2 = e3[1];
      if (Array.isArray(i3)) {
        const [e4, r2] = i3;
        D(t2, s2.dirName, r2, n2, s2.arg);
      } else {
        const e4 = i3, r2 = D(t2, s2.dirName, "", n2, s2.arg);
        n2.addBind(O(e4, r2));
      }
    });
  }
  var V = Object.assign(M, { getDocument: () => P.document, addAttributes: L });
  var W = T;
  var I = function(e2, t2, n2) {
    B(e2, t2, n2, (e3, t3) => {
      const n3 = e3.parentNode;
      n3 && n3.insertBefore(t3, e3);
    });
  };
  var z = function(e2, t2, n2) {
    B(e2, t2, n2, (e3, t3) => {
      const n3 = e3.parentNode;
      if (!n3) return;
      const i2 = e3.nextSibling;
      i2 ? n3.insertBefore(t3, i2) : n3.appendChild(t3);
    });
  };
  var F = function(e2, t2) {
    return new Function("g", `return ${e2};`)(t2 || M);
  };
  var q = function(e2, t2) {
    return !j.has(e2) && (j.set(e2, t2), true);
  };
  var _ = L;
  var J = /* @__PURE__ */ Symbol("ElementReferenceIndex");
  var U = /* @__PURE__ */ new WeakMap();
  var H = /* @__PURE__ */ new WeakMap();
  var K = /* @__PURE__ */ new WeakSet();
  var X = /* @__PURE__ */ new Map();
  var Y = /* @__PURE__ */ new WeakMap();
  var Z;
  var Q = false;
  function ee(e2) {
    return null != e2 && ("object" == typeof e2 || "function" == typeof e2) && "function" == typeof e2.then;
  }
  function te(e2) {
    e2.reportErrors && e2.promise && !e2.observingErrors && (e2.observingErrors = true, e2.promise.catch((e3) => console.error("[GTPL] Binding update failed:", e3)));
  }
  function ne(e2, t2, n2) {
    const i2 = Y.get(e2) === t2;
    i2 && Y.delete(e2), n2 && i2 && !t2.context.isDestroyed && !e2.gtpl?.isDestroyed ? t2.reject ? t2.reject(n2.error) : t2.reportErrors && console.error("[GTPL] Binding update failed:", n2.error) : t2.resolve?.();
  }
  var ie = { binitChangeEvents: false, changeEventsCount: 0, changeEventsHandler: null };
  var se = class _se {
    static globalVar = /* @__PURE__ */ new WeakMap();
    static init(e2) {
      _se.globalVar.has(e2) || _se.globalVar.set(e2, { GenerationFinish: false, MarkEle: /* @__PURE__ */ new WeakMap(), memValues: /* @__PURE__ */ new WeakMap(), renderElements: /* @__PURE__ */ new Set() });
    }
    static getProperty(e2, t2) {
      _se.init(e2);
      return _se.globalVar.get(e2)[t2];
    }
    static setProperty(e2, t2, n2) {
      _se.init(e2);
      _se.globalVar.get(e2)[t2] = n2;
    }
  };
  var re = /* @__PURE__ */ new WeakMap();
  var oe = /* @__PURE__ */ new WeakMap();
  function le() {
    !(function() {
      if (ie.binitChangeEvents) return;
      ie.binitChangeEvents = true, ie.changeEventsHandler = function(e2) {
        const t2 = e2.target, n2 = re.get(t2);
        if (n2 && n2.size) for (const e3 of n2) {
          const n3 = e3.prop || "value";
          let i2;
          i2 = n3 in t2 ? t2[n3] : t2.getAttribute(n3), he(e3.va, e3.ctx, i2);
        }
      };
    })(), ie.changeEventsCount++, ie.changeEventsCount > 1 || P && "function" == typeof P.addEventListener && (P.addEventListener("input", ie.changeEventsHandler), P.addEventListener("change", ie.changeEventsHandler), P.addEventListener("toggle", ie.changeEventsHandler));
  }
  function ae(e2, t2) {
    const n2 = se.getProperty(e2, "renderElements");
    n2.has(t2) || n2.add(t2);
  }
  function ce(e2, t2) {
    const n2 = se.getProperty(e2, "renderElements");
    if (!n2.has(t2)) return;
    (Array.isArray(e2.Elements) ? e2.Elements : [e2.Elements]).forEach((t3, i2) => {
      const s2 = e2.RenderElements[i2];
      if (s2 && n2.has(s2)) {
        let e3 = true;
        if (s2.ele) {
          const t4 = Array.isArray(s2.ele) ? s2.ele[0] : s2.ele;
          s2.mark.parentNode || t4.parentNode ? s2.mark.parentNode && !t4.parentNode && (Pe(s2), s2.eles && (s2.eles[0].refresh(), s2.eles[0].refCase && Pe(s2.eles[0].refCase))) : e3 = false;
        } else if (s2.eles) if (s2.mark.parentNode) {
          let e4 = null;
          const t4 = [];
          s2.eles.forEach((n3) => {
            const i3 = [];
            n3.refresh(), n3.addTo(i3), i3.forEach((n4) => {
              n4.parentNode ? e4 || (e4 = n4) : t4.push(n4);
            });
          }), t4.length && Pe({ type: s2.type, link: s2.link, ele: t4, mark: e4 || s2.mark }, false);
        } else e3 = false;
        e3 && n2.delete(s2);
      }
    });
  }
  function he(e2, t2, n2, i2 = false) {
    if (e2.length) if (e2.length > 1) {
      const s2 = (t3, n3, i3) => n3 === i3 ? t3[e2[n3]] : s2(t3[e2[n3]], ++n3, i3), r2 = s2(t2.Root, 0, e2.length - 2), o2 = e2[e2.length - 1];
      (i2 || r2[o2] !== n2) && (r2[o2] = n2);
    } else {
      const s2 = e2[0];
      (i2 || t2.Root[s2] !== n2) && (t2.Root[s2] = n2);
    }
  }
  function fe(e2, t2, n2, i2, s2) {
    null == i2 && (i2 = 0);
    const r2 = null == n2 ? e2.getValue(t2[i2++]) : n2[t2[i2++]];
    return i2 >= t2.length ? r2 : fe(e2, t2, r2, i2);
  }
  function ue(e2, t2, n2 = 0, i2) {
    for (; n2 < t2.length; n2++) {
      if (e2.isDestroyed) return;
      const s2 = t2[n2], r2 = e2.getContext(s2.name[0]), l2 = fe(r2, s2.name);
      if (l2) {
        const o2 = [];
        if (s2.params) for (const t3 of s2.params) null != t3.ct ? o2.push(t3.ct) : null != t3.va && o2.push(fe(e2, t3.va));
        if (null != i2 && o2.push(i2), ee(i2 = l2.apply(r2.Root, o2))) {
          const s3 = n2 + 1;
          return Promise.resolve(i2).then((n3) => ue(e2, t2, s3, n3));
        }
      } else o("fnc undefined", n2, t2);
    }
    return i2;
  }
  function de(e2, t2, n2, i2) {
    const s2 = t2.gtpl || e2;
    if (t2.link.formula?.fnc) {
      const e3 = [];
      if (t2.link.formula.vars) for (const n3 of t2.link.formula.vars) e3.push(s2.getValue(n3[0]));
      return i2 && e3.push(i2), t2.link.formula.fnc.apply(s2.Root, e3);
    }
    let r2;
    return t2.link.vorc && (null != t2.link.vorc.va && (r2 = void 0 !== n2 ? n2 : fe(s2, t2.link.vorc.va)), null != t2.link.vorc.ct && (r2 = t2.link.vorc.ct)), t2.link.functions ? ue(s2, t2.link.functions, 0, r2) : r2;
  }
  function pe(e2, t2) {
    let n2 = e2;
    if (t2.link.vorc && t2.link.vorc.va) n2 = e2.getContext(t2.link.vorc.va[0]);
    else if (t2.link.functions) {
      const i2 = t2.link.functions[0];
      n2 = e2.getContext(i2.name[0]);
    }
    return n2;
  }
  function ge(e2, t2, n2) {
    const s2 = t2[0];
    if (null != e2.BindTree[s2]) return;
    const r2 = { key: s2, val: e2.getValue(s2), pro: void 0 };
    e2.BindDef.add(r2);
    try {
      const t3 = Object.getOwnPropertyDescriptor(e2.Root, s2);
      t3 && "value" in t3 && (t3.value = void 0), e2.Root.hasOwnProperty(s2) || (e2.Root[s2] = null);
      const n3 = function() {
        return void 0 !== r2.pro ? r2.pro : i(r2.val) ? r2.val : (r2.val = C(r2.val), r2.pro = w(r2.val, e2.BoundEventProxy, r2, [r2.key]), r2.pro);
      };
      Object.defineProperty(e2.Root, s2, { get: n3, set: function(t4) {
        const n4 = C(t4);
        R(r2.val, e2.BoundEventProxy, r2), r2.val = n4;
        const s3 = i(n4) ? (delete r2.pro, r2.val) : (r2.val = C(r2.val), r2.pro = w(r2.val, e2.BoundEventProxy, r2, [r2.key]), r2.pro);
        return e2.eventPRoxy(0, [r2.key], n4, r2), s3;
      } });
      const o2 = { original: t3, get: n3, active: true };
      U.set(r2, o2), H.set(n3, o2);
      const l2 = t3?.get && H.get(t3.get);
      l2 && (l2.successors || (l2.successors = /* @__PURE__ */ new Set())).add(o2);
    } catch (t3) {
      o(t3.message, s2, e2.Root);
    }
  }
  function me(e2, t2, n2) {
    if (0 == t2.length || 1 == t2.length && "this" == t2[0]) return;
    let i2 = e2.BindTree;
    for (let s2 = 0, r2 = t2.length; s2 < r2; s2++) {
      const o2 = t2[s2];
      if (0 == s2) {
        const i3 = e2.getContext(o2);
        if (ge(i3, t2), i3 != e2) return n2.gtpl = e2, e2.BindMap || (e2.BindMap = /* @__PURE__ */ new Map()), e2.BindMap.set(n2, i3), void me(i3, t2, n2);
      }
      null == i2[o2] && (i2[o2] = {}), s2 < r2 - 1 ? (i2 = i2[o2], null == i2.tree && (i2.tree = {}), i2 = i2.tree) : i2 = i2[o2];
    }
    null == i2.me && (i2.me = /* @__PURE__ */ new Set()), i2.me.add(n2);
  }
  function ye(e2, t2, n2) {
    if (0 == t2.length || 1 == t2.length && "this" == t2[0]) return null;
    let i2 = e2.BindTree;
    for (let e3 = 0, n3 = t2.length; e3 < n3; e3++) {
      const s2 = t2[e3];
      if (!i2 || null == i2[s2]) return null;
      if (i2 = i2[s2], e3 < n3 - 1) {
        if (null == i2.tree) return null;
        i2 = i2.tree;
      }
    }
    return i2?.me ?? null;
  }
  function ve(e2, t2) {
    if ((function(e3) {
      Y.get(e3)?.resolve?.(), X.delete(e3), Y.delete(e3);
    })(t2), t2.link.vorc && t2.link.vorc.va && ye(e2, t2.link.vorc.va)?.delete(t2), t2.link.formula?.vars && t2.link.formula.vars.forEach((n2) => {
      ye(e2, n2)?.delete(t2);
    }), t2.link.functions?.forEach((n2) => n2.params?.forEach((n3) => {
      n3.va && ye(e2, n3.va)?.delete(t2);
    })), t2.simetric && t2.ele) {
      const n2 = re.get(t2.ele);
      if (n2) {
        const i2 = t2._simetricEntry;
        if (i2 && n2.has(i2)) n2.delete(i2), n2.size || re.delete(t2.ele);
        else {
          const i3 = new Set(Array.from(n2).filter((t3) => t3.ctx !== e2));
          i3.size ? re.set(t2.ele, i3) : re.delete(t2.ele);
        }
      }
      t2._simetricRefTracked && (ie.changeEventsCount && (ie.changeEventsCount--, ie.changeEventsCount > 0 || P && "function" == typeof P.removeEventListener && ie.changeEventsHandler && (P.removeEventListener("input", ie.changeEventsHandler), P.removeEventListener("change", ie.changeEventsHandler), P.removeEventListener("toggle", ie.changeEventsHandler))), delete t2._simetricRefTracked), (function(e3) {
        if (!e3.ele) return;
        const t3 = e3._simetricPatchProp;
        if (!t3) return;
        const n3 = oe.get(e3.ele);
        if (!n3) return void delete e3._simetricPatchProp;
        const i2 = n3.get(t3);
        i2 ? (i2.count--, i2.count <= 0 && (i2.restore(), n3.delete(t3), n3.size || oe.delete(e3.ele)), delete e3._simetricPatchProp) : delete e3._simetricPatchProp;
      })(t2), delete t2._simetricEntry;
    }
  }
  function ke(e2, t2) {
    let n2 = false;
    if (t2.link.vorc && t2.link.vorc.va && ye(e2, t2.link.vorc.va)?.has(t2) && (n2 = true), t2.link.formula?.vars && t2.link.formula.vars.forEach((i2) => {
      ye(e2, i2)?.has(t2) && (n2 = true);
    }), !n2) {
      const n3 = se.getProperty(e2, "renderElements");
      n3.has(t2) && n3.delete(t2);
    }
    return n2;
  }
  function be(e2, t2) {
    if (7 == t2.type && t2.prop && t2.link && t2.link.vorc && t2.link.vorc.va) {
      const { prop: n2 } = t2;
      if (n2.startsWith("[") && n2.endsWith("]")) {
        t2._simetricRefTracked || (le(), t2._simetricRefTracked = true), t2.simetric = true, t2.prop = n2.slice(1, -1);
        const i2 = t2.link.vorc.va, s2 = e2.getContext(i2[0]);
        re.has(t2.ele) || re.set(t2.ele, /* @__PURE__ */ new Set());
        const r2 = { va: i2, ctx: s2, prop: t2.prop };
        re.get(t2.ele)?.add(r2), t2._simetricEntry = r2, (function(e3, t3, n3) {
          if (!e3.ele || !e3.prop) return;
          const i3 = e3.ele, s3 = e3.prop;
          let r3 = oe.get(i3);
          r3 || (r3 = /* @__PURE__ */ new Map(), oe.set(i3, r3));
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
              return a2.get.call(this) == e4 ? he(t3, n3, e4) : console.error("select value not valid", e4 + " not in options"), i4;
            }
            return he(t3, n3, e4), a2.set.call(this, e4);
          } }), r3.set(s3, { count: 1, restore: () => {
            c2 && h2 ? Object.defineProperty(i3, s3, h2) : delete i3[s3];
          } }), e3._simetricPatchProp = s3;
        })(t2, i2, s2);
      }
    }
  }
  function Ee(e2, t2) {
    e2 && (e2.me && e2.me.forEach((e3) => t2.add(e3)), e2.tree && Object.keys(e2.tree).forEach((n2) => {
      Ee(e2.tree[n2], t2);
    }));
  }
  function we(e2) {
    if (Array.isArray(e2)) xe(e2).forEach((e3) => {
      we(e3);
    });
    else {
      if (e2[J]) {
        for (const { type: t2, handler: n2, options: i2 } of e2[J]) e2.removeEventListener(t2, n2, i2);
        delete e2[J];
      }
      if ("undefined" != typeof Element && e2 instanceof Element) for (; e2.attributes.length > 0; ) e2.removeAttribute(e2.attributes[0].name);
      e2.destroy ? e2.isDestroyed || e2.destroy(true) : e2.parentNode?.removeChild(e2);
    }
  }
  function Re(e2, t2, n2) {
    if (n2 || K.has(t2.mark)) {
      const n3 = se.getProperty(e2, "MarkEle"), i2 = se.getProperty(e2, "memValues");
      t2.ele ? n3.has(t2.mark) && t2.ele != n3.get(t2.mark) && (t2.ele = n3.get(t2.mark), i2.delete(t2)) : t2.mark && (t2.gen ? (n3.has(t2.mark) ? t2.ele = n3.get(t2.mark) : ("function" == typeof t2.gen ? t2.ele = t2.gen(t2.gtpl ? t2.gtpl : e2) : (t2.ele = [], W(t2.ele, t2.gen, t2.gtpl ? t2.gtpl : e2)), n3.set(t2.mark, t2.ele)), delete t2.gen) : n3.has(t2.mark) && (t2.ele = n3.get(t2.mark), i2.delete(t2)));
    }
  }
  var Ce = /* @__PURE__ */ new WeakMap();
  function Ae(e2) {
    if (!Array.isArray(e2.ele) || Ce.has(e2.ele) || 5 === e2.type) return;
    const t2 = 1 === e2.ele.length ? e2.ele[0] : void 0;
    if (1 === t2?.nodeType || 3 === t2?.nodeType) return;
    const n2 = e2.mark?.ownerDocument || P.document;
    if (!n2?.createComment || !n2?.createDocumentFragment) return;
    const i2 = n2.createComment(""), s2 = n2.createComment("");
    e2.ele.unshift(i2), e2.ele.push(s2);
    const r2 = n2.createDocumentFragment();
    e2.ele.forEach((e3) => r2.appendChild(e3)), Ce.set(e2.ele, { start: i2, end: s2, storage: r2, hidden: true });
  }
  function xe(e2) {
    const t2 = Ce.get(e2);
    if (!t2 || !t2.start.parentNode || t2.start.parentNode !== t2.end.parentNode) return e2;
    const n2 = [];
    for (let e3 = t2.start; e3; e3 = e3.nextSibling) if (n2.push(e3), e3 === t2.end) return n2;
    return e2;
  }
  function Pe(e2, t2 = true) {
    if (e2.ele) {
      if (Array.isArray(e2.ele)) {
        Ae(e2), xe(e2.ele).forEach((t4) => {
          e2.mark.parentNode.insertBefore(t4, e2.mark);
        });
        const t3 = Ce.get(e2.ele);
        t3 && (t3.hidden = false);
      } else e2.mark.parentNode.insertBefore(e2.ele, e2.mark);
      t2 && !K.has(e2.mark) && e2.mark.remove();
    }
  }
  function Ne(e2, t2 = true) {
    if (e2.ele) if (Array.isArray(e2.ele)) {
      const n2 = Ce.get(e2.ele);
      if (n2?.hidden) return;
      const i2 = xe(e2.ele);
      t2 && !e2.mark.parentNode && i2[0]?.parentNode && i2[0].parentNode.insertBefore(e2.mark, i2[0]), i2.forEach((e3) => {
        n2 ? n2.storage.appendChild(e3) : e3.remove();
      }), n2 && (n2.hidden = true);
    } else t2 && !e2.mark.parentNode && e2.ele.parentNode && e2.ele.parentNode.insertBefore(e2.mark, e2.ele), e2.ele.remove();
  }
  function Se(e2, t2, n2) {
    Ae(t2);
    const i2 = $e(e2, t2), s2 = (function(e3) {
      let t3 = true;
      if (e3.mark.checks) {
        for (let n3 in e3.mark.checks) if (!e3.mark.checks[n3]) {
          t3 = false;
          break;
        }
      }
      return t3;
    })(t2);
    if (n2 && s2) i2 >= 0 && (e2.RenderElements[i2] = t2), t2.mark.parentNode ? Pe(t2) : i2 >= 0 && ke(e2, t2) && ae(e2, t2);
    else {
      i2 >= 0 && delete e2.RenderElements[i2];
      const n3 = Array.isArray(t2.ele) ? t2.ele[0] : t2.ele;
      n3?.parentNode ? Ne(t2) : i2 >= 0 && ke(e2, t2) && ae(e2, t2);
    }
    return !(n2 && !s2);
  }
  function je(e2, t2) {
    if (!e2) return;
    if (Array.isArray(e2)) return void e2.forEach((e3) => je(e3, t2));
    if (8 === e2.nodeType && 6 == e2.textContent?.length) return void (t2[e2.textContent] = e2);
    const n2 = e2.content?.childNodes || e2.childNodes;
    if (n2) for (let e3 = 0, i2 = n2.length; e3 < i2; e3++) je(n2[e3], t2);
  }
  function $e(e2, t2) {
    const n2 = e2.Elements.indexOf(t2.mark);
    return n2 >= 0 && (e2.RenderElements || (e2.RenderElements = {})), n2;
  }
  function De(e2, t2, n2, i2, s2, r2) {
    const o2 = { parent: t2.gtpl ? t2.gtpl : e2, generator: t2.gen };
    if (n2 && i2) {
      const e3 = {};
      e3[n2.index] = i2.length, e3[n2.target] = s2, o2.context = [n2.index, n2.target], o2.root = e3;
    }
    return void 0 !== r2 && (o2.refresh = r2), new Be(o2);
  }
  async function Oe(e2, t2, n2, i2, s2, r2) {
    const o2 = n2.gtpl || t2;
    t2 = pe(t2, n2);
    const l2 = null != i2;
    if (n2.mark.checks || (n2.mark.checks = {}), n2.mark.checks[n2.type] = l2, Re(t2, n2, l2), n2.mark.checks || (n2.mark.checks = {}), n2.mark.checks[n2.type] = null != i2, !n2.ele) return t2;
    const a2 = se.getProperty(t2, "memValues");
    if (a2.has(n2) && a2.get(n2) === i2) return t2;
    if (a2.delete(n2), n2.case && n2.case.length) {
      if (n2.eles && n2.eles.length && (n2.eles.forEach((e3) => {
        Ne(e3.refCase), e3.destroy(), o2.GtplChilds.delete(e3);
      }), delete n2.eles), !ke(t2, n2)) return t2;
      if (l2) {
        if (!n2.case[0].mark) {
          const e3 = {};
          je(n2.ele, e3);
          for (let t3 = 0, i3 = n2.case.length; t3 < i3; t3++) {
            const i4 = n2.case[t3];
            !i4.mark && i4.uid && (i4.mark = e3[i4.uid]);
          }
        }
        for (let e3 = 0, s3 = n2.case.length; e3 < s3; e3++) {
          const s4 = n2.case[e3], l3 = de(t2, s4), a3 = ee(l3) ? await l3 : l3;
          if (t2.isDestroyed || n2.gtpl?.isDestroyed || Y.get(n2) !== r2) return t2;
          if (a3 == i2) {
            const e4 = De(t2, s4, void 0, void 0, void 0, false);
            s4.ele = e4.Elements, s4.eles = [e4], e4.refCase = s4, o2.GtplChilds.add(e4), n2.eles = s4.eles;
            break;
          }
        }
      }
    }
    const c2 = Se(t2, n2, l2);
    if (l2 && n2.eles?.length) {
      const e3 = n2.eles[0];
      (c2 || e3.refCase.mark.parentNode) && (e3.refresh(), Pe(e3.refCase));
    }
    return a2.set(n2, i2), t2;
  }
  var Be = class _Be {
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
    initialUpdates = /* @__PURE__ */ new Set();
    initialFailure;
    initialReady;
    initialReject;
    initialRenderSettled = false;
    bindingDepth = 0;
    constructor(e2) {
      this.ID = Math.random().toString(16).slice(2), this.BindTree = {}, this.BindConst = /* @__PURE__ */ new Set(), this.BindDef = /* @__PURE__ */ new Set(), this.GtplChilds = /* @__PURE__ */ new Set(), this.cleanupCallbacks = /* @__PURE__ */ new Set(), this.watchers = /* @__PURE__ */ new Map(), this.BoundEventProxy = this.eventPRoxy.bind(this), this.loadOptions(e2);
    }
    loadOptions(e2) {
      e2 && (this.Root = e2.root, e2.parent && (this.Parent = e2.parent, this.bindingDepth = (e2.parent.bindingDepth || 0) + 1), e2.context && (this.Context = new Set(e2.context)), e2.generator && (this.FncElements = e2.generator, this.Elements = [], W(this.Elements, this.FncElements, this)), se.setProperty(this, "GenerationFinish", true), void 0 !== e2.refresh && true !== e2.refresh || this.refresh());
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
      this.checkDestroyed("addBind") || (12 === e2.type && e2.mark && K.add(e2.mark), (function(e3, t2) {
        if (10 === t2.type && t2.link?.vorc?.va && t2.ele) {
          const n2 = t2.link.vorc.va;
          return he(n2, e3, t2.ele, true), e3.onCleanup(() => {
            fe(e3, n2) === t2.ele && he(n2, e3, null);
          }), true;
        }
        if (11 === t2.type && t2.link?.vorc?.va && t2.ele) {
          const n2 = t2.link.vorc.va;
          let i2 = fe(e3, n2);
          if (Array.isArray(i2) || (he(n2, e3, [], true), i2 = fe(e3, n2)), !i2.includes(t2.ele)) {
            i2.push(t2.ele);
            const s2 = C(i2);
            e3.onCleanup(() => {
              let i3 = s2;
              try {
                const t3 = fe(e3, n2);
                C(t3) === s2 && (i3 = t3);
              } catch {
              }
              const r2 = i3.indexOf(t2.ele);
              -1 !== r2 && i3.splice(r2, 1);
            });
          }
          return true;
        }
        return false;
      })(this, e2) || (function(e3, t2) {
        if (6 == t2.type && t2.prop) {
          const n2 = { gtpl: pe(e3, t2), bind: t2 }, i2 = { passive: false }, s2 = function(t3) {
            const i3 = (i4) => {
              if (!e3.isDestroyed && !n2.gtpl.isDestroyed) if ("function" == typeof i4) if (n2.bind.link.params) {
                const s4 = [];
                n2.bind.link.params.forEach((t4) => {
                  null != t4.ct ? s4.push(t4.ct) : null != t4.va && s4.push(fe(e3, t4.va));
                }), i4.apply(n2.gtpl.Root, [t3, ...s4]);
              } else i4.apply(n2.gtpl.Root, [t3]);
              else false === i4 && (t3.preventDefault && t3.preventDefault(), t3.stopPropagation && t3.stopPropagation());
            }, s3 = de(n2.gtpl, n2.bind, void 0, t3);
            ee(s3) ? Promise.resolve(s3).then(i3).catch((e4) => console.error("[GTPL] Event handler failed:", e4)) : i3(s3);
          };
          t2.ele.addEventListener(t2.prop, s2, !!S && i2), t2.ele[J] || (t2.ele[J] = []);
          const r2 = { type: t2.prop, handler: s2, options: !!S && i2 };
          return t2.ele[J].push(r2), e3.onCleanup(() => {
            t2.ele.removeEventListener(r2.type, r2.handler, r2.options);
            const e4 = t2.ele[J];
            if (!e4) return;
            const n3 = e4.indexOf(r2);
            -1 !== n3 && e4.splice(n3, 1), e4.length || delete t2.ele[J];
          }), true;
        }
        return false;
      })(this, e2) || (function(e3, t2) {
        let n2 = false;
        return t2.link.formula && t2.link.formula.vars && t2.link.formula.vars.length && (n2 = true, t2.link.formula.vars.forEach((n3) => {
          me(e3, n3, t2);
        })), n2;
      })(this, e2) || (function(e3, t2) {
        let n2 = false;
        return t2.link.vorc && t2.link.vorc.va && (n2 = true, be(e3, t2), me(e3, t2.link.vorc.va, t2)), t2.link.functions && t2.link.functions.forEach((i2) => {
          i2.params && i2.params.forEach((i3) => {
            i3.va && (n2 = true, me(e3, i3.va, t2));
          });
        }), n2;
      })(this, e2) || this.BindConst.add(e2), se.getProperty(this, "GenerationFinish") && this.queueChange(4, e2, void 0, void 0, true));
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
          const t3 = U.get(e3);
          if (t3) {
            t3.active = false;
            const e4 = t3.original?.get && H.get(t3.original.get);
            e4?.successors?.delete(t3), t3.successors?.forEach((n3) => {
              n3.original = t3.original, e4 && (e4.successors || (e4.successors = /* @__PURE__ */ new Set())).add(n3);
            }), t3.successors?.clear();
          }
          if (t3 && this.Root && Object.getOwnPropertyDescriptor(this.Root, e3.key)?.get === t3.get) {
            let n3 = t3.original;
            for (; n3?.get; ) {
              const e4 = H.get(n3.get);
              if (!e4 || e4.active) break;
              n3 = e4.original;
            }
            try {
              Object.defineProperty(this.Root, e3.key, n3 && !("value" in n3) ? n3 : { configurable: true, enumerable: true, writable: true, ...n3, value: C(e3.val) }), n3?.set && n3.set.call(this.Root, C(e3.val));
            } catch (e4) {
              console.error("[GTPL] Error restoring reactive property:", e4);
            }
          }
          U.delete(e3), R(e3.val, this.BoundEventProxy, e3);
        }
        this.BindDef.clear();
      }
      const t2 = /* @__PURE__ */ new Set(), n2 = /* @__PURE__ */ new Set(), i2 = (t3) => {
        !e2 || t3.gtpl && t3.gtpl !== this || !t3.ele || 1 !== t3.type && 2 !== t3.type && 3 !== t3.type && 12 !== t3.type || n2.add(t3.ele);
      };
      if (this.BindTree && Object.keys(this.BindTree).forEach((e3) => {
        Ee(this.BindTree[e3], t2);
      }), this.BindConst && this.BindConst.forEach((e3) => t2.add(e3)), t2.forEach((e3) => {
        i2(e3), ve(this, e3);
      }), this.BindMap) {
        for (const [e3, t3] of this.BindMap) i2(e3), ve(t3, e3);
        this.BindMap.clear();
      }
      if (e2 && (we(this.Elements), n2.forEach((e3) => we(e3)), this.RenderElements)) {
        const e3 = Array.isArray(this.Elements) ? this.Elements.length : 1;
        for (let t3 = 0; t3 < e3; t3++) {
          const e4 = this.RenderElements[t3];
          e4 && (e4.ele && we(e4.ele), e4.eles && we(e4.eles));
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
      if (this.BindConst) for (let e2 of this.BindConst) this.queueChange(6, e2, void 0, void 0, true);
    }
    ready() {
      return this.initialReady || (this.initialReady = new Promise((e2, t2) => {
        const n2 = (n3) => {
          this.initialRenderSettled || (this.initialRenderSettled = true, this.initialReject = void 0, this.cleanupCallbacks.delete(i2), n3 ? t2(n3.error) : e2());
        }, i2 = () => n2({ error: new Error("[GTPL] Component destroyed before ready") });
        this.initialReject = (e3) => n2({ error: e3 }), this.onCleanup(i2), this.waitInitialRender().then(() => n2(), (e3) => n2({ error: e3 }));
      })), this.initialReady;
    }
    async waitInitialRender() {
      for (; ; ) {
        if (this.isDestroyed) throw new Error("[GTPL] Component destroyed before ready");
        if (this.initialFailure) throw this.initialFailure.error;
        if (!this.initialUpdates.size) return;
        await Promise.all(this.initialUpdates);
      }
    }
    trackInitialUpdate(e2, t2) {
      if (this.getGtplRoot().initialRenderSettled && t2.getGtplRoot().initialRenderSettled) return;
      const n2 = /* @__PURE__ */ new Set(), i2 = (e3) => {
        if (!e3.getGtplRoot().initialRenderSettled) for (; e3; ) e3.initialRenderSettled || n2.add(e3), e3 = e3.Parent;
      };
      if (i2(this), i2(t2), !n2.size) return;
      const s2 = e2.then(() => {
        n2.forEach((e3) => e3.initialUpdates.delete(s2));
      }, (e3) => {
        n2.forEach((t3) => {
          t3.initialFailure || (t3.initialFailure = { error: e3 }), t3.initialUpdates.delete(s2), t3.initialReject?.(e3);
        });
      });
      n2.forEach((e3) => e3.initialUpdates.add(s2));
    }
    processRenderAndApply(e2, t2) {
      if (!this.checkDestroyed("addBind")) if (this.RenderElements) {
        const n2 = [];
        (Array.isArray(this.Elements) ? this.Elements : [this.Elements]).forEach((e3, t3) => {
          const i2 = this.RenderElements[t3];
          if (i2) if (i2.ele) {
            const e4 = Array.isArray(i2.ele) ? Ce.get(i2.ele) : void 0;
            e4 && (e4.hidden = false), n2.push(Array.isArray(i2.ele) ? xe(i2.ele) : i2.ele), K.has(i2.mark) && n2.push(i2.mark);
          } else i2.eles && (i2.eles.forEach((e4) => e4.addTo(n2)), n2.push(i2.mark));
          else n2.push(e3);
        }), t2(e2, n2, this);
      } else t2(e2, xe(this.Elements), this);
    }
    addTo(e2) {
      this.processRenderAndApply(e2, W);
    }
    insertAfterTo(e2) {
      this.processRenderAndApply(e2, z);
    }
    insertBeforeTo(e2) {
      this.processRenderAndApply(e2, I);
    }
    watch(e2, t2) {
      if (this.isDestroyed) return () => {
      };
      const n2 = Array.isArray(e2) ? e2.join(".") : e2;
      let i2 = this.watchers.get(n2);
      i2 || this.watchers.set(n2, i2 = /* @__PURE__ */ new Set()), i2.add(t2);
      const s2 = () => {
        if (this.cleanupCallbacks.delete(s2), !this.watchers) return;
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
        if (this.isDestroyed) return;
        const r3 = this.watchers?.get(t3);
        if (r3) for (const o3 of r3) {
          if (this.isDestroyed) return;
          try {
            o3({ type: e2, path: s2, value: n2, objRef: i2, watch: t3 });
          } catch (e3) {
            console.error("[GTPL watch] error", e3);
          }
        }
      };
      r2(s2);
      const o2 = s2.split(".");
      for (let e3 = o2.length - 1; e3 >= 1; e3--) r2(o2.slice(0, e3).join("."));
      for (let e3 = o2.length - 1; e3 >= 1; e3--) r2(o2.slice(0, e3).join(".") + ".*");
      r2("*");
    }
    eventPRoxy(e2, t2, n2, i2) {
      if (this.isDestroyed) return;
      if (this.emitWatchers(e2, t2, n2, i2), this.isDestroyed) return;
      const s2 = Array.isArray(t2) ? t2 : [];
      _Be.queueBindings(this, this.BindTree[i2.key], e2, s2, 1);
    }
    static queueBindings(e2, t2, n2, i2, s2) {
      if (t2) {
        if (t2.me) for (const r2 of t2.me) e2.queueChange(n2, r2, i2, void 0, true, s2);
        if (t2.tree) {
          const r2 = i2[s2];
          for (const o2 in t2.tree) void 0 !== r2 && r2 !== o2 || _Be.queueBindings(e2, t2.tree[o2], n2, i2, s2 + 1);
        }
      }
    }
    launchChange(e2, t2, n2, i2) {
      return this.queueChange(e2, t2, n2, i2);
    }
    queueChange(e2, t2, n2, i2, s2 = false, r2 = 0) {
      if (this.isDestroyed || t2.gtpl?.isDestroyed || 6 === t2.type) return s2 ? void 0 : Promise.resolve();
      let o2 = X.get(t2);
      const l2 = n2 ? n2.length - r2 : 0;
      if (o2) {
        5 === t2.type && 0 === e2 && 0 === o2.type && l2 > 0 && o2.path?.length && n2[r2] === o2.path[0] && /^(0|[1-9]\d*)$/.test(String(n2[r2])) ? 1 !== o2.path.length && 1 !== l2 || (o2.path = [n2[r2]]) : (o2.type = 4, o2.path = void 0), o2.value = void 0;
      } else Y.get(t2)?.resolve?.(), o2 = { context: this, type: e2, path: l2 > 0 ? n2.slice(r2) : void 0, value: i2, reportErrors: false }, X.set(t2, o2), Y.set(t2, o2);
      const a2 = t2.gtpl || this, c2 = !this.getGtplRoot().initialRenderSettled || a2 !== this && !a2.getGtplRoot().initialRenderSettled;
      return s2 && !c2 || (function(e3) {
        e3.promise || (e3.promise = new Promise((t3, n3) => {
          e3.resolve = t3, e3.reject = n3;
        })), te(e3), e3.promise;
      })(o2), c2 && (o2.callers || (o2.callers = /* @__PURE__ */ new Set()), o2.callers.has(this) || (o2.callers.add(this), this.trackInitialUpdate(o2.promise, a2))), s2 && !c2 && (o2.reportErrors = true, te(o2)), Z && !Z.seen.has(t2) && _Be.enqueueFlushBinding(t2, o2), Z || Q || (Q = true, queueMicrotask(_Be.flushChanges)), o2.promise;
    }
    static flushChanges() {
      Q = false, Z = { queues: [], positions: [], seen: /* @__PURE__ */ new Set(), depth: 0 };
      for (const [e2, t2] of X) _Be.enqueueFlushBinding(e2, t2);
      for (; Z.depth < Z.queues.length; ) {
        const e2 = Z.depth, t2 = Z.queues[e2], n2 = Z.positions[e2] || 0;
        if (!t2 || n2 >= t2.length) {
          Z.depth++;
          continue;
        }
        const i2 = t2[n2];
        Z.positions[e2] = n2 + 1;
        const s2 = X.get(i2);
        if (s2) if (X.delete(i2), s2.context.isDestroyed || i2.gtpl?.isDestroyed) ne(i2, s2);
        else try {
          const e3 = s2.context.applyChange(s2.type, i2, s2.path, s2.value, s2);
          ee(e3) ? Promise.resolve(e3).then(() => ne(i2, s2), (e4) => ne(i2, s2, { error: e4 })) : ne(i2, s2);
        } catch (e3) {
          ne(i2, s2, { error: e3 });
        }
      }
      Z = void 0, X.size && !Q && (Q = true, queueMicrotask(_Be.flushChanges));
    }
    static enqueueFlushBinding(e2, t2) {
      const n2 = Z, i2 = (e2.gtpl || t2.context).bindingDepth;
      (n2.queues[i2] || (n2.queues[i2] = [])).push(e2), n2.seen.add(e2), i2 < n2.depth && (n2.depth = i2);
    }
    applyChange(e2, t2, n2, i2, s2) {
      const r2 = de(this, t2, i2);
      return ee(r2) ? Promise.resolve(r2).then((i3) => this.applyResult(e2, t2, n2, i3, s2)) : this.applyResult(e2, t2, n2, r2, s2);
    }
    applyResult(e2, t2, n2, i2, s2) {
      if (this.isDestroyed || t2.gtpl?.isDestroyed || Y.get(t2) !== s2) return;
      if (5 === t2.type) {
        const e3 = C(i2);
        Array.isArray(e3) && (i2 = Array.from(e3, (e4) => C(e4)));
      }
      let r2 = this;
      switch (t2.type) {
        case 0:
          r2 = (function(e3, t3, n3, i3) {
            t3 = pe(t3, n3);
            const s3 = se.getProperty(t3, "memValues");
            if (null != i3) {
              if (s3.has(n3) && s3.get(n3) == i3) return t3;
              s3.set(n3, i3);
            }
            return n3.ele.textContent = i3, t3;
          })(0, this, t2, i2);
          break;
        case 7:
          r2 = (function(e3, t3, n3, i3) {
            t3 = pe(t3, n3);
            const s3 = (e4, t4) => {
              if (void 0 !== n3.ele[e4] && null !== n3.ele[e4]) {
                if (null == t4) "" !== n3.ele[e4] && (n3.ele[e4] = null);
                else if (n3.ele[e4] != t4) try {
                  n3.ele[e4] = t4;
                } catch (t5) {
                  o(t5.message, n3.ele, e4);
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
          })(0, this, t2, i2);
          break;
        case 9:
          r2 = (function(e3, t3, n3, i3) {
            return t3 = pe(t3, n3), void 0 !== i3 && n3.ele.innerHTML != i3 && (n3.ele.innerHTML = i3), t3;
          })(0, this, t2, i2);
          break;
        case 8:
          r2 = (function(e3, t3, n3, i3) {
            t3 = pe(t3, n3);
            const s3 = se.getProperty(t3, "memValues");
            return s3.has(n3) && s3.get(n3) == i3 || (s3.set(n3, i3), n3.prop && (n3.ele.style[n3.prop] = i3)), t3;
          })(0, this, t2, i2);
          break;
        case 1:
        case 2:
          r2 = (function(e3, t3, n3, i3) {
            t3 = pe(t3, n3);
            const s3 = 2 == n3.type ? !i3 : !!i3;
            if (n3.mark.checks || (n3.mark.checks = {}), n3.mark.checks[n3.type] = s3, Re(t3, n3, s3), !n3.ele) return t3;
            const r3 = se.getProperty(t3, "memValues");
            return r3.has(n3) && r3.get(n3) === s3 || Se(t3, n3, s3) && r3.set(n3, s3), t3;
          })(0, this, t2, i2);
          break;
        case 5:
          r2 = (function(e3, t3, n3, i3, s3) {
            const r3 = n3.gtpl || t3;
            t3 = pe(t3, n3), n3.eles || (n3.eles = []);
            const o2 = n3.eles, l2 = n3.link.index, a2 = [], c2 = [], h2 = Array.isArray(s3) && s3.length ? s3[0] : void 0;
            if ("symbol" == typeof h2 || isNaN(h2)) if (i3 && i3.length) {
              if ("length" == h2 && o2.length == i3.length) return t3;
              i3.forEach((e4, i4) => {
                if (i4 >= o2.length) {
                  const s4 = De(t3, n3, l2, o2, e4, false);
                  o2.push(s4), a2.push([s4, i4]);
                } else o2[i4].Root[l2.target] = e4;
              }), o2.length > i3.length && o2.splice(i3.length, o2.length - i3.length).forEach((e4, t4) => {
                c2.push([e4, t4]);
              });
            } else o2.length && (o2.forEach((e4, t4) => {
              c2.push([e4, t4]);
            }), o2.length = 0);
            else {
              const r4 = s3;
              if (0 == e3) {
                let e4 = false;
                if (r4.length > 1) e4 = true;
                else if (1 == r4.length && o2.length == i3.length) return o2[h2].Root[l2.target] = i3[h2], t3;
                if (e4) {
                  const e5 = o2[h2];
                  if (C(e5.Root[l2.target]) === i3[h2]) return t3;
                  r4.shift(), he(r4, { Root: e5.Root[l2.target] }, fe(t3, r4, i3[h2]), true);
                } else {
                  const e5 = De(t3, n3, l2, o2, i3[h2], false);
                  o2.push(e5), a2.push([e5, h2]);
                }
              }
              if (1 == e3) if (r4.length > 1) {
                const e4 = o2[h2];
                if (C(e4.Root[l2.target]) === i3[h2]) return t3;
                e4.Root[l2.target] = i3[h2];
              } else {
                const e4 = o2.splice(h2, 1)[0];
                c2.push([e4, h2]);
              }
            }
            if (c2.length && c2.forEach((e4) => {
              const [t4, n4] = e4;
              t4.destroy(), r3.GtplChilds.delete(t4);
            }), a2.length) {
              const e4 = $e(t3, n3);
              e4 >= 0 && (t3.RenderElements[e4] || (t3.RenderElements[e4] = n3));
              const i4 = [];
              a2.forEach((e5) => {
                const [t4, n4] = e5;
                t4.addTo(i4), r3.GtplChilds.add(t4);
              }), n3.mark.parentNode ? (Pe({ type: n3.type, link: n3.link, ele: i4, mark: n3.mark }, false), a2.forEach((e5) => {
                e5[0].refresh();
              })) : e4 >= 0 && ke(t3, n3) && ae(t3, n3);
            }
            return t3;
          })(e2, this, t2, i2, n2);
          break;
        case 3:
          r2 = Oe(0, this, t2, i2, 0, s2);
          break;
        case 12:
          r2 = (function(e3, t3, n3, i3) {
            const s3 = n3.gtpl || t3;
            t3 = pe(t3, n3);
            const r3 = null != i3, o2 = se.getProperty(t3, "memValues");
            if (o2.has(n3) && o2.get(n3) == i3) return t3;
            o2.set(n3, i3), n3.mark.checks || (n3.mark.checks = {}), n3.mark.checks[n3.type] = r3;
            let l2 = false;
            if (n3.eles) l2 = true, n3.eles[0].destroy(), s3.GtplChilds.delete(n3.eles[0]), delete n3.eles;
            else if (n3.ele && (Ne(n3), n3.attrs)) for (const e4 of n3.attrs) Array.isArray(e4) || ve(t3, e4);
            if (s3.isDestroyed || t3.isDestroyed) return t3;
            if (!r3) return delete n3.ele, se.getProperty(t3, "MarkEle").delete(n3.mark), Se(t3, n3, false), t3;
            if (l2 && !ke(t3, n3)) return t3;
            const a2 = 11 === i3.nodeType ? Array.from(i3.childNodes) : i3;
            if (Array.isArray(a2) || "function" == typeof a2) {
              const e4 = De(t3, { link: n3.link, type: n3.type, gtpl: n3.gtpl, gen: a2 });
              n3.eles = [e4], s3.GtplChilds.add(e4), n3.ele = e4.Elements;
            } else {
              const e4 = C(i3);
              n3.attrs && _(n3.attrs, e4, t3), n3.ele = e4;
            }
            return se.getProperty(t3, "MarkEle").set(n3.mark, n3.ele), Se(t3, n3, r3), t3;
          })(0, this, t2, i2);
      }
      if (ee(r2)) return Promise.resolve(r2).then((e3) => {
        e3.isDestroyed || this.isDestroyed || t2.gtpl?.isDestroyed || Y.get(t2) !== s2 || ce(e3, t2);
      });
      r2.isDestroyed || Y.get(t2) !== s2 || ce(r2, t2);
    }
  };
  var Te = ["abstract", "await", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "default", "delete", "do", "double", "else", "enum", "export", "extends", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import", "in", "instanceof", "int", "interface", "let", "long", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield", "arguments", "async", "eval", "undefined"];
  var Me = class {
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
    startsRegex() {
      const e2 = this.s.substring(0, this.i).trimEnd();
      return "" === e2 || /[({\[=,:;!?&|~%^<>*]$/.test(e2) || /(?:^|[^\w.$])(?:return|throw|case|yield|await|typeof|void|delete|in|of|instanceof)$/.test(e2) || /(?:^|[^+])\+$/.test(e2) || /(?:^|[^-])-$/.test(e2);
    }
    skipRegex() {
      this.i++;
      let e2 = false;
      for (; this.i < this.l; ) {
        const t2 = this.s[this.i++];
        if ("\\" === t2) this.i++;
        else if ("[" === t2) e2 = true;
        else if ("]" === t2) e2 = false;
        else if ("/" === t2 && !e2 || "\n" === t2) return;
      }
    }
    searchFormula(e2) {
      this.i = e2;
      const t2 = (e3) => {
        for (this.i++; this.i < this.l; ) {
          const t3 = this.s[this.i++];
          if ("\\" === t3) this.i++;
          else {
            if (t3 === e3) return;
            "`" === e3 && "$" === t3 && "{" === this.s[this.i] && (this.i++, n2(true));
          }
        }
      }, n2 = (e3) => {
        let n3 = 0;
        for (; this.i < this.l; ) {
          const i3 = this.s[this.i];
          if ('"' !== i3 && "'" !== i3 && "`" !== i3) if ("/" !== i3 || "/" !== this.s[this.i + 1]) if ("/" !== i3 || "*" !== this.s[this.i + 1]) if ("/" === i3 && this.startsRegex()) this.skipRegex();
          else {
            if ("{" === i3) n3++;
            else if ("}" === i3) if (n3 > 0) n3--;
            else {
              if (e3) return this.i++, true;
              if (this.checkEnd()) return true;
            }
            this.i++;
          }
          else {
            for (this.i += 2; this.i < this.l && "*/" !== this.s.substring(this.i, this.i + 2); ) this.i++;
            this.i += 2;
          }
          else for (this.i += 2; this.i < this.l && "\n" !== this.s[this.i]; ) this.i++;
          else t2(i3);
        }
        return false;
      };
      if (!n2(false)) return false;
      const i2 = this.s.substring(e2, this.i);
      return this.i++, this.r.push({ formula: { code: i2, vars: this.findVars(i2) } }), true;
    }
    findVars(e2) {
      let t2 = e2.trim();
      const n2 = this.s, i2 = this.i, s2 = this.l;
      this.s = t2, this.l = t2.length, this.i = 0;
      let r2 = [];
      const o2 = (e3) => {
        const t3 = r2.find((t4) => t4[0] === e3[0]);
        if (!t3) return void r2.push(e3);
        let n3 = 1;
        for (; n3 < t3.length && n3 < e3.length && t3[n3] === e3[n3]; ) n3++;
        t3.length = n3;
      };
      let l2 = [[]];
      const a2 = (e3) => {
        l2[l2.length - 1].push(e3);
      }, c2 = (e3) => l2.some((t3) => t3.indexOf(e3) >= 0), h2 = () => {
        for (; this.i < this.l && /\s/.test(this.s[this.i]); ) this.i++;
      }, f2 = (e3) => {
        for (this.i++; this.i < this.l; ) if ("\\" === this.s[this.i]) this.i += 2;
        else {
          if (this.s[this.i] === e3) {
            this.i++;
            break;
          }
          this.i++;
        }
      }, u2 = () => {
        for (this.i++; this.i < this.l; ) if ("\\" === this.s[this.i]) this.i += 2;
        else if ("$" === this.s[this.i] && "{" === this.s[this.i + 1]) {
          this.i += 2;
          let e3 = 1;
          const t3 = this.i;
          for (; this.i < this.l && e3 > 0; ) "{" === this.s[this.i] ? e3++ : "}" === this.s[this.i] && e3--, this.i++;
          const n3 = this.s.substring(t3, this.i - 1);
          this.findVars(n3).forEach((e4) => {
            c2(e4[0]) || o2(e4);
          });
        } else {
          if ("`" === this.s[this.i]) {
            this.i++;
            break;
          }
          this.i++;
        }
      }, d2 = () => {
        const e3 = this.i, t3 = this.getVOrC();
        if (t3 && t3.va) {
          let n3 = e3 - 1;
          for (; n3 >= 0 && /\s/.test(this.s[n3]); ) n3--;
          return n3 >= 0 && "." === this.s[n3] ? null : t3.va;
        }
        return null;
      }, p2 = () => {
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
        return this.i++, h2(), "=>" === this.s.substr(this.i, 2) && (n3.split(",").forEach((e4) => {
          const t4 = e4.trim();
          t4 && a2(t4);
        }), this.i += 2, true);
      }, g2 = () => {
        if ("catch" === this.s.substr(this.i, 5) && !this.isAN(this.s[this.i + 5])) {
          if (this.i += 5, h2(), "(" === this.s[this.i]) {
            this.i++, h2();
            const e3 = d2();
            for (e3 && a2(e3[0]); this.i < this.l && ")" !== this.s[this.i]; ) this.i++;
            ")" === this.s[this.i] && this.i++;
          }
          return true;
        }
        return false;
      }, m2 = () => {
        if ("function" === this.s.substr(this.i, 8) && !this.isAN(this.s[this.i + 8])) {
          this.i += 8, h2();
          const e3 = d2();
          if (e3 && a2(e3[0]), h2(), "(" === this.s[this.i]) {
            this.i++;
            let e4 = "";
            for (; this.i < this.l && ")" !== this.s[this.i]; ) e4 += this.s[this.i], this.i++;
            ")" === this.s[this.i] && this.i++, e4.split(",").forEach((e5) => {
              const t3 = e5.trim();
              t3 && a2(t3);
            });
          }
          return true;
        }
        return false;
      }, y2 = ["const", "var", "let", "function"];
      for (; this.i < this.l && (h2(), !(this.i >= this.l)); ) {
        const e3 = this.s[this.i];
        if ("catch" === this.s.substr(this.i, 5) && !this.isAN(this.s[this.i + 5])) {
          g2();
          continue;
        }
        if ("function" === this.s.substr(this.i, 8) && !this.isAN(this.s[this.i + 8])) {
          m2();
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
        if ("/" === e3 && this.startsRegex()) {
          this.skipRegex();
          continue;
        }
        if ('"' === e3 || "'" === e3) {
          f2(e3);
          continue;
        }
        if ("`" === e3) {
          u2();
          continue;
        }
        if ("{" === e3) {
          l2.push([]), this.i++;
          continue;
        }
        if ("}" === e3) {
          l2.pop(), this.i++;
          continue;
        }
        if ("(" === e3) {
          const e4 = this.i;
          if (p2()) continue;
          this.i = e4;
        }
        const t3 = this.i, n3 = d2();
        if (n3) {
          if (y2.indexOf(n3[0]) >= 0) {
            h2();
            const e5 = d2();
            e5 && a2(e5[0]);
            continue;
          }
          if (void 0 !== P[n3[0]]) continue;
          if (Te.indexOf(n3[0]) >= 0) continue;
          let e4 = this.i;
          for (; e4 < this.l && /\s/.test(this.s[e4]); ) e4++;
          let i3 = t3 - 1;
          for (; i3 >= 0 && /\s/.test(this.s[i3]); ) i3--;
          if (":" === this.s[e4] && ("{" === this.s[i3] || "," === this.s[i3])) continue;
          if (c2(n3[0])) continue;
          "(" === this.s[e4] && n3.length > 1 && n3.pop(), o2(n3);
          continue;
        }
        this.i++;
      }
      return this.s = n2, this.i = i2, this.l = s2, r2;
    }
  };
  var Ge;
  function Le(e2, t2, n2, i2) {
    return `g('${e2}',${t2 ?? "null"},${n2 ?? "null"},o${i2 && "http://www.w3.org/1999/xhtml" !== i2 ? "," + JSON.stringify(i2) : ""})`;
  }
  function Ve(e2, t2, n2) {
    if (n2) {
      let i2 = [];
      return n2.forEach((e3) => {
        i2.push("const " + e3.var + "=" + e3.gen + ";");
      }), "((o)=>{" + i2.join("") + "return " + e2 + "})" + (t2 ? "" : "(o)");
    }
    return "((o)=>" + e2 + ")" + (t2 ? "" : "(o)");
  }
  function We(e2, t2, n2, i2) {
    let s2 = Fe([e2], true);
    return s2 = s2.substring(0, s2.length - 1), s2 = s2 + ',"gen":' + (n2 || t2) + (i2 || "") + "}", s2;
  }
  function Ie(e2, t2, n2, i2, s2, r2) {
    return e2.uid = t2, n2 ? ("" != i2 && (i2 += ","), i2 += We(e2, t2, void 0, r2)) : ("" != s2 && (s2 += ","), s2 += We(e2, t2, void 0, r2)), { jsonAttr2: i2, jsonAttr: s2 };
  }
  function ze(n2, i2, s2) {
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
        if (r2 = r2 || 9, Ge.setString(`{{${s2}}}`), Ge.check()) {
          const e2 = { type: r2, link: Ge.getSingleResult() };
          return n2.push(e2), true;
        }
        break;
      case "g-tpl":
        return r2 = r2 || 13, n2.push({ type: r2, link: { vorc: { ct: s2 } } }), true;
      case "g-style":
        s2.includes("{{") || (s2 = `{{${s2}}}`);
      case "style":
        let o2 = "";
        if (Ge.setString(s2), Ge.check()) {
          let i3 = Ge.getResult();
          if (i3 && i3.length) {
            if (1 == i3.length) return n2.push({ type: 8, prop: "cssText", link: i3[0] }), true;
            const r3 = e(s2);
            for (const [e2, s3] of Object.entries(r3)) Ge.setString(s3), Ge.check() ? (i3 = Ge.getSingleResult(), n2.push({ type: 8, prop: e2, link: i3 })) : (o2 += o2 ? ";" : "", o2 += `${t(e2)}:${s3}`);
            return "" != o2 && n2.push(["style", o2]), true;
          }
        }
        break;
      default:
        if (Ge.setString(s2), Ge.check()) {
          const e2 = Ge.getResult();
          if (e2 && 1 == e2.length) {
            const t2 = i2.startsWith("on"), s3 = { type: t2 ? 6 : 7, prop: t2 ? i2.substring(2) : i2, link: e2[0] };
            return n2.push(s3), true;
          }
        }
    }
    return false;
  }
  function Fe(e2, t2 = false) {
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
                  r("formula without code");
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
  var qe = 0;
  var _e = 0;
  function Je() {
    _e >= 60466176 && (_e = 0, qe++, qe >= 26 && (qe = 0));
    const e2 = String.fromCharCode(97 + qe), t2 = _e.toString(36).padStart(5, "0");
    return _e++, e2 + t2;
  }
  function Ue(e2, t2 = 0, n2 = null) {
    let i2 = 0;
    return { statements: [], nodes: [], nextId: e2 ?? (() => `$${t2}_${(i2++).toString(36)}`), depth: t2, methods: n2 };
  }
  var He = { createElement: "$e", createElementNS: "$n", createTextNode: "$t", createComment: "$c", appendChild: "$a", addAttributes: "$s", addBind: "$b" };
  function Ke(e2, t2) {
    if (!e2.methods) return `.${t2}`;
    const n2 = He[t2];
    return e2.methods.set(t2, n2), `[${n2}]`;
  }
  function Xe(e2, t2 = true) {
    const n2 = t2 ? `[${e2.nodes.map((e3) => e3.name).join(",")}]` : e2.nodes[0].name, i2 = e2.statements.slice();
    for (const t3 of e2.nodes) for (const e3 of t3.statements) i2.push(e3);
    return `(o)=>{${i2.join("")}return ${n2};}`;
  }
  function Ye(e2, t2, n2, i2, s2 = false, r2) {
    const o2 = s2 ? e2.nextId() : i2.nextId(), l2 = [];
    for (const e3 of i2.nodes) e3.eager && l2.push(...e3.statements);
    const a2 = r2 && "http://www.w3.org/1999/xhtml" !== r2;
    l2.push(`const ${o2}=d${Ke(e2, a2 ? "createElementNS" : "createElement")}(${a2 ? JSON.stringify(r2) + "," : ""}${JSON.stringify(t2)});`);
    for (const t3 of i2.nodes) t3.eager ? l2.push(`${o2}${Ke(e2, "appendChild")}(${t3.name});`) : l2.push("{", ...t3.statements, `${o2}${Ke(e2, "appendChild")}(${t3.name});`, "}");
    return "[]" !== n2 && l2.push(`g${Ke(e2, "addAttributes")}(${n2},${o2},o);`), e2.nodes.push({ name: o2, statements: l2, eager: s2 }), o2;
  }
  function Ze(e2, t2, n2, i2, s2) {
    null == Ge && (Ge = new Me());
    let r2 = /* @__PURE__ */ (function() {
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
    const o2 = (e3, t3) => {
      if (!s2) return void r2.addComma(Le(e3, t3), ["["]);
      const n3 = s2.nextId(), i3 = "#text" === e3, o3 = !t3.startsWith("["), l3 = [`const ${n3}=d${Ke(s2, i3 ? "createTextNode" : "createComment")}(${o3 ? t3 : '""'});`];
      if (!o3) {
        const e4 = t3.slice(1, -2);
        l3.push(`o${Ke(s2, "addBind")}(${e4},${i3 ? "ele" : "mark"}:${n3}});`);
      }
      s2.nodes.push({ name: n3, statements: l3, eager: true });
    }, l2 = (e3) => {
      if (!s2) return void r2.add(e3);
      const n3 = s2.nextId();
      s2.nodes.push({ name: n3, statements: [`const ${n3}=${e3};`], eager: !t2 });
    };
    let a2, c2, h2, f2, u2, d2, p2, g2, m2, y2, v2, k2, b2, E2, w2, R2;
    for (var C2 = 0, A2 = e2.length; C2 < A2; C2++) {
      var x2 = e2[C2];
      switch (a2 = c2 = h2 = f2 = u2 = d2 = null, y2 = v2 = k2 = b2 = E2 = "", x2.nodeType) {
        case 1:
          {
            if ("script" == x2.nodeName.toLowerCase()) {
              s2 ? Ye(s2, x2.nodeName, "[]", Ue(s2.nextId), true) : r2.addComma(Le(x2.nodeName, JSON.stringify(x2.textContent)), ["["]);
              continue;
            }
            p2 = x2, w2 = [];
            for (let e4 = 0, t3 = p2.attributes.length, n4 = p2.attributes; e4 < t3; e4++) {
              const t4 = n4.item(e4);
              if (t4) if (ze(w2, t4.name, t4.value)) {
                if (w2.length) {
                  const e5 = w2[w2.length - 1];
                  if (e5) {
                    if (12 == e5.type && (u2 = e5, w2.pop()), 1 != e5.type && 2 != e5.type || (f2 = e5, w2.pop()), 5 == e5.type && (a2 = e5, w2.pop()), 3 == e5.type && (c2 = e5, w2.pop()), 4 == e5.type) {
                      if (!i2) throw new Error("not switch");
                      i2.case || (i2.case = []), i2.case.push(e5), h2 = e5, h2.index = i2.case.length - 1, w2.pop();
                    }
                    13 == e5.type && (d2 = e5, w2.pop());
                  }
                }
              } else w2.push([t4.name, t4.value]);
            }
            if (a2 && h2) throw new Error("not for and case " + Array.from(p2.attributes, (e4) => e4.name + '="' + e4.value + '"').join(" "));
            if (f2 && h2) throw new Error("not if and case " + Array.from(p2.attributes, (e4) => e4.name + '="' + e4.value + '"').join(" "));
            if (u2 && (h2 || c2 || d2)) throw new Error("not is and ( case or switch ot tpl ) " + Array.from(p2.attributes, (e4) => e4.name + "=" + e4.value + '"').join(" "));
            r2.addCommaOnly(["["]);
            const e3 = "template" == p2.nodeName.toLowerCase() && (u2 || f2 || h2 || a2 || c2), n3 = u2 || f2 || h2 || a2 || c2, o3 = !d2 && w2.every((e4) => Array.isArray(e4)) && Array.from(p2.childNodes).every((e4) => 3 === e4.nodeType && !(e4.nodeValue || "").includes("{{")), C3 = !t2 || o3, A3 = d2 && "template" === p2.nodeName.toLowerCase() && !e3, N3 = s2 ? n3 ? Ue(void 0, 0, s2.methods) : C3 || A3 ? Ue(s2.nextId, s2.depth, s2.methods) : Ue(void 0, s2.depth + 1, s2.methods) : void 0;
            if (d2) {
              const n4 = d2.link.vorc.ct, i3 = P.document.getElementById(n4);
              i3 ? (g2 = "template" == p2.nodeName.toLowerCase() ? t2 : p2, m2 = "template" == i3.nodeName.toLowerCase() ? i3.content.childNodes : [i3], y2 = Ze(m2, e3 || A3 && void 0 === g2 ? null : g2, !A3, c2, N3)) : console.error("template " + n4 + " undefined.");
            } else g2 = "template" == p2.nodeName.toLowerCase() ? p2.content : p2, m2 = g2.childNodes, y2 = Ze(m2, e3 ? null : g2, true, c2, N3);
            if (u2 || f2 || h2 || a2 || c2) {
              R2 = Je(), v2 = "", k2 = "";
              const e4 = [];
              if (E2 = Fe(w2), u2 && (u2.attrs = w2, { jsonAttr2: k2, jsonAttr: v2 } = Ie(u2, R2, a2, k2, v2)), f2 && ({ jsonAttr2: k2, jsonAttr: v2 } = Ie(f2, R2, a2, k2, v2)), c2) {
                c2.uid = R2;
                const t3 = c2.case;
                delete c2.case, b2 = "", t3 && t3.forEach((t4) => {
                  if (t4.common && (t4.common.forEach((t5) => e4.push(t5)), delete t4.common), t4.gen) {
                    const e5 = t4.gen;
                    delete t4.gen, "" != b2 && (b2 += ","), b2 += We(t4, null, e5);
                  }
                }), { jsonAttr2: k2, jsonAttr: v2 } = Ie(c2, R2, a2, k2, v2, ',"case":[' + b2 + "]");
              }
              let n4;
              if (s2 && N3) if ("template" === p2.nodeName.toLowerCase()) n4 = Xe(N3);
              else {
                const e5 = Ue(N3.nextId, N3.depth, s2.methods);
                Ye(e5, p2.nodeName, E2, N3, false, p2.namespaceURI), n4 = Xe(e5, false);
              }
              d2 ? "template" == p2.nodeName.toLowerCase() ? e4.push({ var: R2, gen: n4 ?? Ve(y2, true) }) : e4.push({ var: R2, gen: n4 ?? Ve(Le(p2.nodeName, E2, y2, p2.namespaceURI), true) }) : e4.push({ var: R2, gen: u2 ? "null" : n4 ?? ("template" == p2.nodeName.toLowerCase() ? Ve(y2, true) : Ve(Le(p2.nodeName, E2, y2, p2.namespaceURI), true)) }), h2 ? (h2.uid = R2, h2.gen = R2, h2.common = e4, l2(Ve(Le("#comment", "[" + JSON.stringify(R2) + "," + v2 + "]"), s2 ? null : t2))) : a2 ? (f2 || u2 || c2 ? (a2.uid = Je(), "" != v2 && (v2 += ","), v2 += We(a2, a2.uid), e4.push({ var: a2.uid, gen: Ve(Le("#comment", "[" + JSON.stringify(R2) + "," + k2 + "]"), true) })) : (a2.uid = R2, "" != v2 && (v2 += ","), v2 += We(a2, R2)), l2(Ve(Le("#comment", "[" + JSON.stringify(a2.uid) + "," + v2 + "]"), s2 ? null : t2, e4))) : l2(Ve(Le("#comment", "[" + JSON.stringify(R2) + "," + v2 + "]"), s2 ? null : t2, e4));
            } else if (s2 && N3) d2 && "template" === p2.nodeName.toLowerCase() ? (s2.statements.push(...N3.statements), s2.nodes.push(...N3.nodes)) : Ye(s2, p2.nodeName, Fe(w2), N3, C3, p2.namespaceURI);
            else if (d2 && "template" == p2.nodeName.toLowerCase()) r2.add(y2);
            else {
              const e4 = Le(p2.nodeName, Fe(w2), y2, p2.namespaceURI);
              r2.add(o3 ? e4 : Ve(e4, t2));
            }
          }
          break;
        case 3:
          {
            let e3 = true;
            if (x2.nodeValue && (Ge.setString(x2.nodeValue), Ge.check())) {
              e3 = false;
              const t3 = Ge.getResult();
              t3 && t3.length && t3.forEach((e4) => {
                o2(x2.nodeName, "string" == typeof e4 ? JSON.stringify(e4) : Fe([{ type: 0, prop: "textContent", link: e4 }]));
              });
            }
            e3 && o2(x2.nodeName, JSON.stringify(x2.nodeValue));
          }
          break;
        case 6:
          o2(x2.nodeName, JSON.stringify(x2.nodeValue));
      }
    }
    if (s2) return "";
    const N2 = r2.toString(false !== n2 ? "[" : "", false !== n2 ? "]" : "");
    return void 0 === t2 ? "(o)=>" + N2 : N2;
  }
  function Qe(e2) {
    return new DOMParser().parseFromString("<body>" + e2.trim(), "text/html").body.childNodes;
  }
  var et = { GTpl: Be, GAddTo: W, GInsertAfterTo: z, GInsertBeforeTo: I, GregisterDirective: q, GGenerator: V, GProxy: w, unGProxy: R, jit: { GCompile: F, GCode: function(e2) {
    return Ze("string" == typeof e2 ? Qe(e2) : e2 instanceof Node ? [e2] : e2);
  }, GCodeOptimized: function(e2, t2) {
    const n2 = Ue(void 0, 0, t2?.methodAliases ? /* @__PURE__ */ new Map() : null);
    if (n2.statements.push("const d=g.getDocument();"), Ze("string" == typeof e2 ? Qe(e2) : e2 instanceof Node ? [e2] : e2, void 0, void 0, void 0, n2), n2.methods?.size) {
      const e3 = Array.from(n2.methods, ([e4, t3]) => `${t3}=${JSON.stringify(e4)}`);
      n2.statements.push(`const ${e3.join(",")};`);
    }
    return Xe(n2);
  } }, utils: { log: r, stack: o, css2obj: e, style2css: t, globalObject: P, passiveSupported: S, isGProxy: E, toRaw: C, PROXYTARGET: a, ISPROXY: l } };

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
        const compiled = et.jit.GCode(html);
        classMeta.templateFactory = et.jit.GCompile(compiled);
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
    const gtplobj = new et.GTpl(options);
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
              ele = et.utils.globalObject.document.createElement("div");
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
    off(event, handler, namespace) {
      const nsName = namespace ?? (event === "*" ? "__GLOBAL__" : "default");
      const ns = this.namespaces.get(nsName);
      const handlers = ns?.get(event);
      if (!handlers) return;
      const remaining = handlers.filter((l2) => l2.handler !== handler);
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
      const success = et.GregisterDirective(name, constructor);
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

@mpeliz/gtpl/dist/gtpl.esm.js:
  (*!
  * @mpeliz/gtpl v3.0.0
  * (c) 2024 Manuel Peliz
  * @license Apache-2.0
  * @repository [object Object]
  *)
*/
//# sourceMappingURL=gtplweb-docs.js.map
