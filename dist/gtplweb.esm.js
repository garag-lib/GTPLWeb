import { __decorate } from 'tslib';
import GTPL from '@mpeliz/gtpl';

class GDirectiveBase {
    constructor(ele, value, root, arg) {
        this.ele = ele;
        this.value = value;
        this.root = root.Root;
        this.argument = arg;
        this.onInit?.();
    }
}

const SHEET_CACHE = new WeakMap();
function applyComponentStyles(cmp, meta, mode) {
    const styleMode = meta.styleMode;
    const sr = cmp.$host;
    const canAdopt = !!(sr && 'adoptedStyleSheets' in sr) && meta.stylesInline.length > 0;
    if (styleMode !== 'lazy' && canAdopt) {
        const key = cmp.constructor;
        let sheet = SHEET_CACHE.get(key);
        if (!sheet) {
            sheet = new CSSStyleSheet();
            sheet.replaceSync(meta.stylesInline.join('\n'));
            SHEET_CACHE.set(key, sheet);
        }
        const current = [...sr.adoptedStyleSheets];
        if (!current.includes(sheet)) {
            sr.adoptedStyleSheets = [...current, sheet];
        }
    }
    else {
        switch (styleMode) {
            case 'inline':
            case 'file': {
                for (const css of meta.stylesInline) {
                    const style = document.createElement('style');
                    style.textContent = css;
                    cmp.$host.appendChild(style);
                }
                for (const href of meta.styleUrls) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = href;
                    cmp.$host.appendChild(link);
                }
                break;
            }
        }
    }
}
async function ensureCompiledTemplate(classMeta) {
    if (classMeta.templateFactory)
        return;
    if (classMeta.compilePromise) {
        await classMeta.compilePromise;
        return;
    }
    classMeta.compilePromise = (async () => {
        try {
            const html = classMeta.templateHtml ?? (await (await fetch(classMeta.templateUrl)).text());
            const compiled = GTPL.jit.GCode(html);
            classMeta.templateFactory = GTPL.jit.GCompile(compiled);
        }
        catch (err) {
            console.error('[GTPL compile error]', { url: classMeta.templateUrl, err });
            throw err;
        }
        finally {
            classMeta.compilePromise = null;
        }
    })();
    await classMeta.compilePromise;
}
function instantiateTemplate(controller, generator) {
    const options = { root: controller, generator };
    const gtplobj = new GTPL.GTpl(options);
    return gtplobj;
}

const COMPONENT_REGISTRY = new Map();
function getRegisteredComponent(name) {
    return COMPONENT_REGISTRY.get(name);
}
function toKebabCase(x) {
    return x
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
}
function defineHidden(target, key, value, opts) {
    Object.defineProperty(target, key, {
        value,
        enumerable: opts?.enumerable ?? false,
        writable: opts?.writable ?? false,
        configurable: opts?.configurable ?? false,
    });
}
const isLikelyHtml = (s) => !!s && /^\s*</.test(s) && s.includes('>');
const COMP_CTRL = Symbol('COMP_CTRL');
const COMP_FLAGS = Symbol('COMP_FLAGS');
const COMP_GTPL = Symbol('COMP_GTPL');
const CLASS_META = Symbol('CLASS_META');
const HOST_CREATE = Symbol('HOST_CREATE');
const getCtrl = (host) => host[COMP_CTRL];
const getFlags = (host) => host[COMP_FLAGS];
const getGTPL = (host) => host[COMP_GTPL];
const getMeta = (ctor) => ctor[CLASS_META];
function getControllerFromComponent(component) {
    return component[COMP_CTRL];
}
function getGtplFromComponent(component) {
    return component[COMP_GTPL];
}
function isHostCreated(ele) {
    return (ele[HOST_CREATE] === true) ? true : false;
}
function initComponentHost(host, ControllerClass, baseMeta, useWebComponent, ...args) {
    const ctrl = new ControllerClass(...args);
    defineHidden(host, COMP_CTRL, ctrl);
    defineHidden(ctrl, "$el", host);
    const flags = { firstRender: true, stylesApplied: false, destroyed: false };
    defineHidden(host, COMP_FLAGS, flags);
    defineHidden(ctrl, "destroy", function () {
        ctrl.onDestroy?.();
        flags.destroyed = true;
        try {
            host[COMP_GTPL]?.destroy?.();
        }
        catch (ex) {
            console.error(ex);
        }
        flags.firstRender = false;
        if (!useWebComponent)
            host.innerHTML = '';
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
        }
        else if (classMeta.shadow === true) {
            host.$host = host.attachShadow({ mode: "open" });
        }
        else {
            host.$host = host.attachShadow(classMeta.shadow);
        }
    }
    else {
        host.$host = host;
    }
    const loadTemplate = () => {
        const gtpl = instantiateTemplate(ctrl, classMeta.templateFactory);
        defineHidden(host, COMP_GTPL, gtpl, { writable: true });
        ctrl.onInit?.();
    };
    if (classMeta.templateFactory) {
        loadTemplate();
    }
    else {
        ensureCompiledTemplate(classMeta).then(() => {
            if (!flags.destroyed)
                loadTemplate();
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
            flags.firstRender = false;
            host[COMP_GTPL]?.addTo(host.$host);
            ctrl.onTemplateReady?.();
        }
    };
    Promise.resolve().then(finishSetup);
    return host;
}
class GWatcher extends HTMLElement {
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
        if (!host)
            return;
        const ctrl = getControllerFromComponent(host);
        ctrl?.onConnect?.();
    }
    disconnectedCallback() {
        if (this.ctrl) {
            this.ctrl.onDisconnect?.(this);
            return;
        }
        const host = this.parentNode;
        if (!host)
            return;
        const ctrl = getControllerFromComponent(host);
        ctrl?.onDisconnect?.();
    }
}
if (!customElements.get("g-watcher")) {
    customElements.define("g-watcher", GWatcher);
}
function Component(config) {
    return function (ControllerClass) {
        const options = config;
        const asWebComponent = options.asWebComponent != null ? options.asWebComponent : true;
        const inferredTag = toKebabCase(ControllerClass.name);
        const tagName = options.tag ?? inferredTag;
        if (!tagName.includes('-')) {
            throw new Error(`Custom element name "${tagName}" must contain a hyphen (-). Use 'tag' in @Component.`);
        }
        let shadowOpt = false;
        if (options.shadow === true)
            shadowOpt = { mode: 'open' };
        else if (options.shadow === false)
            shadowOpt = false;
        else if (typeof options.shadow === 'object')
            shadowOpt = options.shadow;
        const aotTemplate = ControllerClass.__gtemplate__ ?? null;
        const styleMode = options.styleMode ?? 'global';
        let styleUrls = [];
        let stylesInline = [];
        let templateHtml = null;
        let templateUrl = null;
        if (aotTemplate) {
            styleUrls = ControllerClass.__styleUrls__ ?? [];
            stylesInline = ControllerClass.__stylesInline__ ?? [];
        }
        else {
            const tStr = typeof options.template === 'string' ? options.template : null;
            const tObj = typeof options.template === 'object' && options.template ? options.template.html ?? null : null;
            if (tObj != null)
                templateHtml = tObj;
            else if (tStr != null)
                isLikelyHtml(tStr) ? (templateHtml = tStr) : (templateUrl = tStr);
            if (options.style) {
                const arr = Array.isArray(options.style) ? options.style : [options.style];
                for (const s of arr) {
                    const t = s.trim();
                    if (/\.(scss|sass)$/i.test(t))
                        continue;
                    if (/\.css$/i.test(t))
                        styleUrls.push(t);
                    else
                        stylesInline.push(s);
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
                    getCtrl(this).onConnect?.();
                }
                disconnectedCallback() {
                    getCtrl(this)?.onDisconnect?.();
                }
            };
            if (!customElements.get(tagName))
                customElements.define(tagName, GeneratedComponent);
        }
        else {
            GeneratedComponent = class {
                constructor(ele, ...args) {
                    if (!ele) {
                        ele = GTPL.utils.globalObject.document.createElement('div');
                        ele.setAttribute('g-component', tagName);
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
        defineHidden(ControllerClass, '__gcomponent__', GeneratedComponent);
        if (!COMPONENT_REGISTRY.has(tagName)) {
            COMPONENT_REGISTRY.set(tagName, {
                asWebComponent,
                ControllerClass: ControllerClass,
                ComponentClass: GeneratedComponent
            });
        }
        else {
            console.warn(`Component with name "${tagName}" is already defined.`);
        }
        return ControllerClass;
    };
}

function isValidAttributeName(name) {
    return /^[a-zA-Z_][a-zA-Z0-9_\-:.]*$/.test(name);
}
function Directive(config) {
    return function (constructor) {
        const name = config?.name ??
            constructor.name
                .replace(/Directive$/, '')
                .replace(/([A-Z])/g, '-$1')
                .toLowerCase()
                .slice(1);
        if (!name) {
            throw new Error('@Directive() requiere un nombre válido');
        }
        if (!isValidAttributeName(name)) {
            throw new Error(`Nombre de directiva inválido: "${name}". Debe ser un nombre de atributo HTML válido.`);
        }
        const success = GTPL.GregisterDirective(name, constructor);
        if (!success) {
            console.warn(`⚠️ La directiva "${name}" ya está registrada.`);
        }
        return constructor;
    };
}

let GSet = class GSet extends GDirectiveBase {
    onInit() {
        if (this.argument && this.argument.trim()) {
            this.path = this.argument.trim().split('.');
            return;
        }
        const legacy = this.ele.getAttribute("g-set-var");
        if (legacy && legacy.trim()) {
            this.path = legacy.trim().split('.');
            this.ele.removeAttribute("g-set-var");
            return;
        }
        console.error('g-set: falta el nombre de la propiedad. ' +
            'Usa g-set:prop / g-set:obj.prop o g-set-var="prop".');
    }
    applyPathSet(target, value) {
        if (!target || !this.path || this.path.length === 0)
            return;
        const path = this.path;
        if (path.length > 1) {
            const reduce = (obj, index, fin) => {
                if (obj == null)
                    return undefined;
                if (index === fin)
                    return obj[path[index]];
                return reduce(obj[path[index]], index + 1, fin);
            };
            const parent = reduce(target, 0, path.length - 2);
            if (!parent)
                return;
            const lastKey = path[path.length - 1];
            parent[lastKey] = value;
        }
        else {
            const lastKey = path[0];
            target[lastKey] = value;
        }
    }
    setAttribute(name, value) {
        if (!this.path || this.path.length === 0)
            return;
        const controller = getControllerFromComponent(this.ele);
        if (!controller)
            return;
        this.applyPathSet(controller, value);
    }
    getAttribute(name) {
        return null;
    }
    removeAttribute(name) { }
};
GSet = __decorate([
    Directive({
        name: "g-set",
    })
], GSet);

let GClass = class GClass extends GDirectiveBase {
    onInit() {
        const current = this.ele.getAttribute('class');
        this.cls = current ? current.split(/\s+/).filter(Boolean) : [];
    }
    setAttribute(name, value) {
        const ele = this.ele;
        this.cls = Array.isArray(value) ? value : String(value || '').split(/\s+/);
        if (this.cls.length)
            ele.setAttribute('class', this.cls.join(' '));
        else
            ele.removeAttribute('class');
    }
    getAttribute(name) {
        return this.cls?.length ? this.cls.join(' ') : null;
    }
    removeAttribute(name) {
        const ele = this.ele;
        ele.removeAttribute('class');
        this.cls = [];
    }
};
GClass = __decorate([
    Directive({
        name: "g-class",
    })
], GClass);

let GComponent = class GComponent extends GDirectiveBase {
    destroyComponent() {
        if (this.webc) {
            const prevCtrl = getControllerFromComponent(this.webc);
            prevCtrl?.destroy();
            if (!this.regc?.asWebComponent) {
                if (isHostCreated(this.webc))
                    this.webc.remove();
                else
                    this.webc.setAttribute('g-component', '');
            }
            this.webc = undefined;
            this.regc = undefined;
        }
    }
    createComponent(tagName) {
        const nextTag = String(tagName ?? '').trim();
        if (!nextTag) {
            this.destroyComponent();
            this.value = '';
            this.ele.removeAttribute('g-component');
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
        this.ele.setAttribute('g-component', this.value);
        this.ele.innerHTML = "";
        if (regc.asWebComponent) {
            const webc = new regc.ComponentClass();
            this.ele.appendChild(webc);
            this.webc = webc;
        }
        else {
            this.webc = new regc.ComponentClass(this.ele);
        }
        this.regc = regc;
    }
    onInit() {
        this.createComponent(this.value);
    }
    setAttribute(name, value) {
        this.createComponent(String(value ?? ''));
    }
    getAttribute(name) {
        return this.value ?? '';
    }
    removeAttribute(name) {
        this.destroyComponent();
        this.value = '';
        this.ele.removeAttribute('g-component');
    }
};
GComponent = __decorate([
    Directive({
        name: "g-component",
    })
], GComponent);

class Animations {
    static enable() {
        Animations.enabled = true;
    }
    static disable() {
        Animations.enabled = false;
    }
    static setInitial(element, styles) {
        if (!Animations.enabled)
            return;
        element.style.transition = "none";
        element.style.pointerEvents = "none";
        Object.assign(element.style, styles);
    }
    static resetStyles(el) {
        el.style.removeProperty("opacity");
        el.style.removeProperty("transform");
        el.style.removeProperty("transition");
        el.style.removeProperty("pointer-events");
    }
    static animateTo(element, styles, duration = 300, easing = "ease") {
        if (!Animations.enabled) {
            Object.assign(element.style, styles);
            return Promise.resolve();
        }
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    element.style.transition = `all ${duration}ms ${easing}`;
                    Object.assign(element.style, styles);
                    const onEnd = (ev) => {
                        if (ev.target !== element)
                            return;
                        element.removeEventListener("transitionend", onEnd);
                        element.style.pointerEvents = "auto";
                        resolve();
                    };
                    element.addEventListener("transitionend", onEnd);
                });
            });
        });
    }
    static wait(ms) {
        return new Promise(res => setTimeout(res, ms));
    }
    static stopTransition(el) {
        const computed = getComputedStyle(el);
        el.style.transition = "none";
        el.style.transform = computed.transform;
        el.style.opacity = computed.opacity;
    }
    static fadeIn(el, duration = 300) {
        this.setInitial(el, { opacity: "0" });
        return this.animateTo(el, { opacity: "1" }, duration);
    }
    static fadeOut(el, duration = 300) {
        this.setInitial(el, { opacity: "1" });
        return this.animateTo(el, { opacity: "0" }, duration);
    }
    static slideInX(el, from = "-100%", duration = 300) {
        this.setInitial(el, { transform: `translateX(${from})` });
        return this.animateTo(el, { transform: "translateX(0)" }, duration);
    }
    static slideOutX(el, to = "-100%", duration = 300) {
        this.setInitial(el, { transform: "translateX(0)" });
        return this.animateTo(el, { transform: `translateX(${to})` }, duration);
    }
    static slideInY(el, from = "100%", duration = 300) {
        this.setInitial(el, { transform: `translateY(${from})` });
        return this.animateTo(el, { transform: "translateY(0)" }, duration);
    }
    static slideOutY(el, to = "100%", duration = 300) {
        this.setInitial(el, { transform: "translateY(0)" });
        return this.animateTo(el, { transform: `translateY(${to})` }, duration);
    }
    static scaleIn(el, from = "0.6", duration = 300) {
        this.setInitial(el, { transform: `scale(${from})`, opacity: "0" });
        return this.animateTo(el, { transform: "scale(1)", opacity: "1" }, duration);
    }
    static scaleOut(el, to = "0.6", duration = 300) {
        this.setInitial(el, { transform: "scale(1)", opacity: "1" });
        return this.animateTo(el, { transform: `scale(${to})`, opacity: "0" }, duration);
    }
    static rotateIn(el, from = "-20deg", duration = 300) {
        this.setInitial(el, { transform: `rotate(${from})`, opacity: "0" });
        return this.animateTo(el, { transform: "rotate(0)", opacity: "1" }, duration);
    }
    static rotateOut(el, to = "20deg", duration = 300) {
        this.setInitial(el, { transform: "rotate(0)", opacity: "1" });
        return this.animateTo(el, { transform: `rotate(${to})`, opacity: "0" }, duration);
    }
    static slideFadeInY(el, from = "20px", duration = 300) {
        this.setInitial(el, { transform: `translateY(${from})`, opacity: "0" });
        return this.animateTo(el, { transform: "translateY(0)", opacity: "1" }, duration);
    }
    static slideFadeInX(el, from = "-20px", duration = 300) {
        this.setInitial(el, { transform: `translateX(${from})`, opacity: "0" });
        return this.animateTo(el, { transform: "translateX(0)", opacity: "1" }, duration);
    }
    static diagonalIn(el, dx = "-50%", dy = "50%", duration = 300) {
        this.setInitial(el, { transform: `translate(${dx}, ${dy})`, opacity: "0" });
        return this.animateTo(el, { transform: "translate(0, 0)", opacity: "1" }, duration);
    }
    static diagonalOut(el, dx = "50%", dy = "-50%", duration = 300) {
        this.setInitial(el, { transform: "translate(0, 0)", opacity: "1" });
        return this.animateTo(el, { transform: `translate(${dx}, ${dy})`, opacity: "0" }, duration);
    }
    static zoomIn(el, from = "0.4", duration = 350) {
        this.setInitial(el, { transform: `scale(${from})`, opacity: "0" });
        return this.animateTo(el, { transform: "scale(1)", opacity: "1" }, duration);
    }
    static zoomOut(el, to = "0.4", duration = 350) {
        this.setInitial(el, { transform: "scale(1)", opacity: "1" });
        return this.animateTo(el, { transform: `scale(${to})`, opacity: "0" }, duration);
    }
    static flipIn(el, from = "-90deg", duration = 400) {
        this.setInitial(el, {
            transform: `rotateY(${from})`,
            opacity: "0",
            transformStyle: "preserve-3d",
        });
        return this.animateTo(el, {
            transform: "rotateY(0deg)",
            opacity: "1",
        }, duration);
    }
    static flipOut(el, to = "90deg", duration = 400) {
        this.setInitial(el, { transform: "rotateY(0deg)", opacity: "1" });
        return this.animateTo(el, { transform: `rotateY(${to})`, opacity: "0" }, duration);
    }
    static async bounceIn(el, duration = 400) {
        this.setInitial(el, { transform: "scale(0.5)", opacity: "0" });
        await this.animateTo(el, { transform: "scale(1.1)", opacity: "1" }, duration * 0.5, "ease-out");
        return this.animateTo(el, { transform: "scale(1)" }, duration * 0.5, "ease-in-out");
    }
    static async elasticIn(el, duration = 500) {
        this.setInitial(el, { transform: "scale(0.3)", opacity: "0" });
        await this.animateTo(el, { transform: "scale(1.2)", opacity: "1" }, duration * 0.4, "ease-out");
        return this.animateTo(el, { transform: "scale(1)" }, duration * 0.6, "ease-in-out");
    }
    static slide(el, axis, distance, duration = 300, easing = "ease") {
        const prop = axis === "x" ? "translateX" : "translateY";
        this.setInitial(el, { transform: `${prop}(${distance})` });
        return this.animateTo(el, { transform: `${prop}(0)` }, duration, easing);
    }
    static enter(el, opts = {}) {
        const { opacityFrom = "0", xFrom = "0", yFrom = "20px", scaleFrom = "1", rotateFrom = "0deg", duration = 300, easing = "ease" } = opts;
        this.setInitial(el, {
            opacity: opacityFrom,
            transform: `translate(${xFrom}, ${yFrom}) scale(${scaleFrom}) rotate(${rotateFrom})`
        });
        return this.animateTo(el, {
            opacity: "1",
            transform: "translate(0,0) scale(1) rotate(0deg)"
        }, duration, easing);
    }
    static leave(el, opts = {}) {
        const { opacityTo = "0", xTo = "0", yTo = "20px", scaleTo = "1", rotateTo = "0deg", duration = 300, easing = "ease" } = opts;
        this.setInitial(el, {
            opacity: "1",
            transform: "translate(0,0) scale(1) rotate(0deg)"
        });
        return this.animateTo(el, {
            opacity: opacityTo,
            transform: `translate(${xTo}, ${yTo}) scale(${scaleTo}) rotate(${rotateTo})`
        }, duration, easing);
    }
    static async queue(el, animations) {
        for (const anim of animations) {
            await anim();
        }
    }
}
Animations.enabled = true;

class GRouter {
    constructor(urlconfig, opts) {
        this.urls = [];
        this.ids = new Map();
        this.historyCache = new Map();
        this.active = null;
        this.suppressNextHashChange = false;
        this.options = {
            mode: "hash",
            base: "",
            debug: false,
            anchorLeafRoutes: true,
            strictErrors: true,
        };
        this.transientData = new Map();
        if (urlconfig)
            this.urls = urlconfig;
        if (opts)
            this.setOptions(opts);
        this.loadIds(this.urls);
    }
    setOptions(opts) {
        this.options = { ...this.options, ...opts, base: this.options.base };
        if (opts?.base != null) {
            this.options.base = this.normalizePath("/" + (opts.base || "") + "/");
        }
    }
    log(...args) {
        if (this.options.debug) {
            console.debug("[GRouter]", ...args);
        }
    }
    normalizePath(input) {
        if (!input)
            return "/";
        let s = input.replace(/\\/g, "/");
        if (!s.startsWith("/"))
            s = "/" + s;
        s = s.replace(/\/{2,}/g, "/");
        if (s.length > 1 && s.endsWith("/"))
            s = s.slice(0, -1);
        return s || "/";
    }
    escapeRegexLiteral(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    routeSpecificity(url) {
        const literals = url.replace(/:\??[A-Za-z0-9_]+/g, "");
        return literals.length;
    }
    compilePattern(route) {
        if (route.regexurl && route.paramKeys && route.optional)
            return;
        const isWildcard = route.wildcard === true || route.url.trim() === "*" || route.url.trim() === "/*";
        if (!route.wildcard && route.url.includes("*")) {
            const m = route.url.match(/\*([A-Za-z0-9_]+)/);
            if (m) {
                const key = m[1];
                route.paramKeys = [key];
                route.optional = [];
                route.regexurl = new RegExp("^" + this.escapeRegexLiteral(route.url.split("*")[0]) + "(.*)$");
                if (!route.params)
                    route.params = {};
                route.params[key] = null;
                return;
            }
        }
        const rawPattern = this.normalizePath(isWildcard ? "/*" : (route.url || "/"));
        const pattern = rawPattern;
        const reToken = /:\??([A-Za-z0-9_]+)/g;
        const paramKeys = [];
        const optional = new Set();
        let cursor = 0;
        let built = "";
        if (isWildcard) {
            built = ".*";
        }
        else {
            let m;
            while ((m = reToken.exec(pattern))) {
                const start = m.index;
                const raw = m[0];
                const name = m[1];
                const isOptional = raw[1] === "?";
                built += this.escapeRegexLiteral(pattern.slice(cursor, start));
                paramKeys.push(name);
                if (isOptional)
                    optional.add(name);
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
        if (!route.params)
            route.params = {};
        for (const k of paramKeys) {
            if (!(k in route.params))
                route.params[k] = null;
        }
        route.url = pattern;
    }
    loadIds(gurls, parent) {
        for (const r of gurls) {
            if (this.ids.has(r.id))
                throw Error(`${r.id} exits`);
            r.parent = parent ?? null;
            this.compilePattern(r);
            if (r.default)
                this.defaultRoute = r;
            this.ids.set(r.id, r);
            this.log("route loaded:", r.id, r.url);
            if (Array.isArray(r.childs) && r.childs.length) {
                this.loadIds(r.childs, r);
            }
        }
    }
    prepareGURL(gurl) {
        this.compilePattern(gurl);
        return !!gurl.regexurl;
    }
    getGurlFromId(id) {
        return this.ids.get(id);
    }
    extractParams(route, matchArray) {
        const out = {};
        if (!route.paramKeys || !route.paramKeys.length)
            return out;
        let idx = 1;
        for (const key of route.paramKeys) {
            const val = matchArray[idx++];
            if (val != null)
                out[key] = val;
        }
        return out;
    }
    async runMiddlewareChain(finalRoute, match) {
        const chain = [];
        const collect = (mw) => {
            if (!mw)
                return;
            if (Array.isArray(mw))
                chain.push(...mw);
            else
                chain.push(mw);
        };
        const stack = [];
        let cur = finalRoute;
        while (cur) {
            stack.unshift(cur);
            cur = cur.parent;
        }
        for (const r of stack)
            collect(r.middleware);
        for (const mw of chain) {
            const res = await mw(match);
            if (res === false)
                return { ok: false };
            if (res && typeof res === "object" && "ok" in res) {
                if (!res.ok)
                    return { ok: false, redirect: res.redirect };
            }
        }
        return { ok: true };
    }
    orderedRoutes(routes) {
        return [...routes].sort((a, b) => this.routeSpecificity(b.url) - this.routeSpecificity(a.url));
    }
    async resolvePath(path, routes, seedParams) {
        const normalRoutes = routes.filter(r => !r.wildcard && r.url !== "*" && r.url !== "/*");
        const wildcardRoutes = routes.filter(r => r.wildcard || r.url === "*" || r.url === "/*");
        const candidates = [...this.orderedRoutes(normalRoutes), ...wildcardRoutes];
        for (const r of candidates) {
            this.compilePattern(r);
            const m = path.match(r.regexurl);
            if (!m)
                continue;
            const localParams = this.extractParams(r, m);
            const params = { ...(seedParams ?? {}), ...localParams };
            let rest = path.replace(r.regexurl, "");
            rest = this.normalizePath(rest);
            if (rest === "/") {
                const fullPath = this.buildUrlFromRouteChain(r, params);
                const found = {
                    id: r.id,
                    url: r.url,
                    fullPath,
                    params,
                    classRef: r.classRef,
                    default: !!r.default,
                    redirect: r.redirect,
                    gurl: r
                };
                const mw = await this.runMiddlewareChain(r, found);
                if (!mw.ok) {
                    if (found.redirect || mw.redirect) {
                        return { ...found, redirect: mw.redirect || found.redirect };
                    }
                    return null;
                }
                return found;
            }
            if (r.childs && r.childs.length) {
                const childMatch = await this.resolvePath(rest, r.childs, params);
                if (childMatch)
                    return childMatch;
            }
        }
        return null;
    }
    async checkUrl(url, routes, params) {
        const norm = this.normalizePath(url);
        const baseRoutes = routes ?? this.urls;
        const match = await this.resolvePath(norm, baseRoutes, params);
        return match;
    }
    buildUrlFromRouteChain(route, params) {
        const chain = [];
        let cur = route;
        while (cur) {
            chain.unshift(cur);
            cur = cur.parent;
        }
        const template = chain
            .map(r => r.url)
            .map(u => u.startsWith("/") ? u : "/" + u)
            .join("");
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
    getUrlFromParams(id, params) {
        const r = this.ids.get(id);
        if (!r)
            return null;
        this.compilePattern(r);
        const url = this.buildUrlFromRouteChain(r, params);
        if (/:([A-Za-z0-9_]+)/.test(url))
            return null;
        return url;
    }
    parseQueryString(qs) {
        if (!qs)
            return null;
        const sp = new URLSearchParams(qs);
        const out = {};
        sp.forEach((v, k) => (out[k] = v));
        return Object.keys(out).length ? out : null;
    }
    buildQueryString(query) {
        if (!query)
            return "";
        const sp = new URLSearchParams();
        for (const [k, v] of Object.entries(query)) {
            if (v == null)
                continue;
            sp.append(k, String(v));
        }
        const s = sp.toString();
        return s ? `?${s}` : "";
    }
    currentPathFromLocation() {
        if (this.options.mode === "hash") {
            const raw = window.location.hash || "";
            const part = raw.startsWith("#") ? raw.slice(1) : raw;
            const [p] = part.split("?");
            return this.normalizePath(p || "/");
        }
        const full = window.location.pathname;
        const base = this.options.base || "";
        let rel = full.startsWith(base) ? full.slice(base.length) : full;
        const [p] = rel.split("?");
        return this.normalizePath(p || "/");
    }
    currentQueryFromLocation() {
        const raw = window.location.href;
        const qIndex = raw.indexOf("?");
        if (qIndex === -1)
            return null;
        return this.parseQueryString(raw.slice(qIndex + 1));
    }
    setLocation(path, query, replace = false) {
        const qs = this.buildQueryString(query);
        if (this.options.mode === "hash") {
            const target = "#" + this.normalizePath(path) + qs;
            if (replace)
                window.location.replace(target);
            else
                window.location.hash = target;
            return;
        }
        const target = (this.options.base || "") + this.normalizePath(path) + qs;
        if (replace)
            window.history.replaceState({}, "", target);
        else
            window.history.pushState({}, "", target);
        this.onLocationChange({ synthetic: true });
    }
    navigate(idOrPath, params, query) {
        if (idOrPath.startsWith("/")) {
            this.setLocation(idOrPath, query, false);
            return;
        }
        const url = this.getUrlFromParams(idOrPath, params);
        if (!url) {
            if (this.options.strictErrors)
                throw new Error(`No se pudo construir URL para id="${idOrPath}"`);
            return;
        }
        this.setLocation(url, query, false);
    }
    navigateWithData(idOrPath, data, params, query) {
        let path;
        if (idOrPath.startsWith("/")) {
            path = this.normalizePath(idOrPath);
        }
        else {
            path = this.getUrlFromParams(idOrPath, params);
            if (!path && this.options.strictErrors)
                throw new Error(`No se pudo construir URL para id="${idOrPath}"`);
        }
        if (!path)
            return;
        this.transientData.set(path, data);
        this.setLocation(path, query, false);
    }
    getDataForCurrent() {
        const currentPath = this.active?.fullPath ?? null;
        if (!currentPath)
            return null;
        return this.transientData.get(currentPath) ?? null;
    }
    getDataForMatch(match) {
        if (!match)
            return null;
        const path = this.normalizePath(match.fullPath);
        return this.transientData.get(path) ?? null;
    }
    clearData(path) {
        if (path) {
            this.transientData.delete(this.normalizePath(path));
        }
        else {
            this.transientData.clear();
        }
    }
    replace(idOrPath, params, query) {
        if (idOrPath.startsWith("/")) {
            this.setLocation(idOrPath, query, true);
            return;
        }
        const url = this.getUrlFromParams(idOrPath, params);
        if (!url) {
            if (this.options.strictErrors)
                throw new Error(`No se pudo construir URL para id="${idOrPath}"`);
            return;
        }
        this.setLocation(url, query, true);
    }
    back() {
        window.history.back();
    }
    removeListener() {
        this.cb = undefined;
    }
    setListener(cb) {
        this.cb = cb;
    }
    start(callback) {
        this.setListener(callback);
        this.historyCache = new Map();
        if (this.options.mode === "hash") {
            if (!this.hashchangebind)
                this.hashchangebind = (e) => this.hashchange(e);
            window.removeEventListener("hashchange", this.hashchangebind);
            window.addEventListener("hashchange", this.hashchangebind, false);
        }
        else {
            if (!this.popstatebind)
                this.popstatebind = (e) => this.onLocationChange({ synthetic: false });
            window.removeEventListener("popstate", this.popstatebind);
            window.addEventListener("popstate", this.popstatebind, false);
        }
        const path = this.currentPathFromLocation();
        const qs = this.currentQueryFromLocation();
        if (this.defaultRoute) {
            const defUrl = this.getUrlFromParams(this.defaultRoute.id);
            const isEmpty = (this.options.mode === "hash" && (!window.location.hash || window.location.hash === "#" || window.location.hash === "#/")) ||
                (this.options.mode === "history" && (path === "/" || path === ""));
            if (isEmpty && defUrl) {
                if (defUrl !== path)
                    this.setLocation(defUrl, undefined, true);
                this.onLocationChange({ synthetic: true });
                return;
            }
        }
        this.onLocationChange({ newURL: window.location.href, oldURL: "", query: qs ?? undefined });
    }
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
        this.options.mode === "history";
        this.options.mode === "hash";
        const base = this.options.base;
        const prev = this.active;
        let match = this.historyCache.get(path) || null;
        if (!match) {
            const res = await this.resolvePath(path, this.urls);
            if (res) {
                if (query)
                    res.query = { ...query };
                else
                    delete res.query;
                const redirectTo = res.redirect;
                if (redirectTo) {
                    this.setLocation(redirectTo, undefined, false);
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
                }
                catch (e) {
                    this.log("Callback error:", e);
                }
                if (this.afterChange) {
                    try {
                        await this.afterChange(prev ?? null, this.active);
                    }
                    catch (e) {
                        this.log("afterChange error:", e);
                    }
                }
                this.log("route new:", res);
                return;
            }
            else {
                this.active = null;
                try {
                    this.cb?.("notfound", null, prev ?? null);
                }
                catch (e) {
                    this.log("Callback error:", e);
                }
                this.log("route notfound:", path);
                return;
            }
        }
        else {
            if (query)
                match.query = { ...query };
            else
                delete match.query;
            const routeDef = this.ids.get(match.id);
            const mw = await this.runMiddlewareChain(routeDef, match);
            if (!mw.ok) {
                const redirectTo = match.redirect || mw.redirect;
                if (redirectTo) {
                    this.setLocation(redirectTo, undefined, false);
                    return;
                }
                this.active = null;
                try {
                    this.cb?.("notfound", null, prev ?? null);
                }
                catch (e) {
                    this.log("Callback error:", e);
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
            }
            catch (e) {
                this.log("Callback error:", e);
            }
            if (this.afterChange) {
                try {
                    await this.afterChange(prev ?? null, this.active);
                }
                catch (e) {
                    this.log("afterChange error:", e);
                }
            }
            this.log("route history:", match);
            return;
        }
    }
    cleanHist(gurl) {
        this.historyCache = new Map();
        if (gurl) {
            const full = this.buildUrlFromRouteChain(gurl);
            this.active = {
                id: gurl.id,
                url: gurl.url,
                fullPath: full,
                params: {},
                classRef: gurl.classRef,
                default: !!gurl.default,
                redirect: gurl.redirect,
            };
            this.historyCache.set(full, this.active);
        }
    }
    removeHist(gurldel) {
        let toRemove = null;
        for (const [url, m] of this.historyCache) {
            if (m.object === gurldel.obj) {
                toRemove = url;
                break;
            }
        }
        if (toRemove)
            this.historyCache.delete(toRemove);
    }
    getParams() {
        return this.active?.params ?? {};
    }
    addGurl(gurl, parentId) {
        if (this.ids.has(gurl.id))
            throw Error(`${gurl.id} exits`);
        let parent;
        if (parentId) {
            parent = this.ids.get(parentId);
            if (!parent)
                throw Error(`${parentId} not exits`);
        }
        this.compilePattern(gurl);
        this.ids.set(gurl.id, gurl);
        if (parent) {
            gurl.parent = parent;
            if (!parent.childs)
                parent.childs = [];
            parent.childs.push(gurl);
        }
        else {
            this.urls.push(gurl);
        }
        if (gurl.childs && gurl.childs.length)
            this.loadIds(gurl.childs, gurl);
    }
    destroy() {
        if (this.hashchangebind)
            window.removeEventListener("hashchange", this.hashchangebind);
        if (this.popstatebind)
            window.removeEventListener("popstate", this.popstatebind);
        this.historyCache.clear();
        this.cb = undefined;
        this.active = null;
    }
    escapeRegExp(str) {
        return this.escapeRegexLiteral(str);
    }
    tryGetUrlFromParams(id, params) {
        try {
            return this.getUrlFromParams(id, params);
        }
        catch {
            return null;
        }
    }
    getMatch() {
        return this.active;
    }
    getAllRoutes() {
        return [...this.ids.values()];
    }
    async matchPath(pathOrUrl) {
        const [pathPart, queryPart] = pathOrUrl.split("?");
        const norm = this.normalizePath(pathPart || "/");
        const cached = this.historyCache.get(norm);
        if (cached) {
            if (queryPart) {
                const q = this.parseQueryString(queryPart);
                if (q)
                    cached.query = q;
                else
                    delete cached.query;
            }
            return cached;
        }
        const match = await this.resolvePath(norm, this.urls);
        if (!match)
            return null;
        const routeDef = this.ids.get(match.id);
        const mw = await this.runMiddlewareChain(routeDef, match);
        if (!mw.ok) {
            if (mw.redirect)
                return { ...match, redirect: mw.redirect };
            return null;
        }
        if (queryPart) {
            const q = this.parseQueryString(queryPart);
            if (q)
                match.query = q;
            else
                delete match.query;
        }
        return match;
    }
    getRouteChain(match) {
        const r = match?.gurl ?? this.active?.gurl;
        if (!r)
            return [];
        const chain = [];
        let cur = r;
        while (cur) {
            chain.unshift(cur);
            cur = cur.parent ?? null;
        }
        return chain;
    }
}

class GEvents {
    constructor() {
        this.namespaces = new Map();
    }
    getNamespace(ns = "default") {
        if (!this.namespaces.has(ns)) {
            this.namespaces.set(ns, new Map());
        }
        return this.namespaces.get(ns);
    }
    addListener(event, handler, options = {}) {
        if (event === "*" && !options.namespace) {
            const global = this.getNamespace("__GLOBAL__");
            const listeners = global.get(event) || [];
            listeners.push({ handler, once: options.once, priority: options.priority ?? 0 });
            listeners.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
            global.set(event, listeners);
            return handler;
        }
        const ns = this.getNamespace(options.namespace);
        const listeners = ns.get(event) || [];
        listeners.push({ handler, once: options.once, priority: options.priority ?? 0 });
        listeners.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
        ns.set(event, listeners);
        return handler;
    }
    on(event, handler, options = {}) {
        return this.addListener(event, handler, options);
    }
    once(event, handler, options = {}) {
        return this.addListener(event, handler, { ...options, once: true });
    }
    subscribe(event, handler, options) {
        this.on(event, handler, options);
        return {
            off: () => this.off(event, handler, options?.namespace)
        };
    }
    off(event, handler, namespace = "default") {
        const ns = this.getNamespace(namespace);
        const handlers = ns.get(event);
        if (!handlers)
            return;
        ns.set(event, handlers.filter(l => l.handler !== handler));
    }
    offAll(event, namespace = "default") {
        if (event) {
            this.getNamespace(namespace).delete(event);
        }
        else {
            this.removeAllListeners(namespace);
        }
    }
    async emit(event, payload, namespace = "default", options) {
        const ns = this.getNamespace(namespace);
        const handlers = ns.get(event);
        const wildcardLocal = ns.get("*");
        const globalWildcardListeners = this.namespaces.get("__GLOBAL__")?.get("*") ?? [];
        const allHandlers = [
            ...(handlers ?? []),
            ...(wildcardLocal ?? []),
            ...(globalWildcardListeners ?? []),
        ];
        if (allHandlers.length === 0)
            return;
        const runHandler = async (listener, isWildcard = false) => {
            try {
                if (isWildcard) {
                    const handler = listener.handler;
                    await handler({ event, payload, namespace });
                }
                else {
                    const handler = listener.handler;
                    await handler(payload);
                }
            }
            catch (err) {
                console.error(`[GEvents] Error en handler "${String(event)}" (${namespace}):`, err);
            }
            if (listener.once) {
                const targetNs = (event === "*" && !namespace) ? "__GLOBAL__" : namespace;
                this.off(event, listener.handler, targetNs);
            }
        };
        const execute = async (listener) => {
            const isWildcard = (wildcardLocal?.includes(listener) ?? false) ||
                (globalWildcardListeners?.includes(listener) ?? false);
            await runHandler(listener, isWildcard);
        };
        if (!options?.sequential) {
            await Promise.all(allHandlers.map(execute));
        }
        else {
            for (const l of allHandlers)
                await execute(l);
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
    waitForComplete(event, timeoutMs, namespace = "default") {
        return new Promise((resolve, reject) => {
            let timer;
            const handler = async (payload) => {
                clearTimeout(timer);
                const ns = this.getNamespace(namespace);
                const handlers = ns.get(event);
                if (handlers && handlers.length > 0) {
                    try {
                        await Promise.all(handlers.map(async (listener) => {
                            try {
                                await listener.handler(payload);
                            }
                            catch (err) {
                                console.error(`[GEvents] Error en waitForComplete("${String(event)}"):`, err);
                            }
                        }));
                    }
                    catch (err) {
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
        }
        else {
            this.namespaces.clear();
        }
    }
    count(ns) {
        return [...ns.values()].reduce((acc, arr) => acc + (arr?.length ?? 0), 0);
    }
    listenerCount(namespace) {
        if (namespace)
            return this.count(this.namespaces.get(namespace) ?? new Map());
        let total = 0;
        for (const ns of this.namespaces.values())
            total += this.count(ns);
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
        return [...(this.namespaces.get(namespace)?.get(event) ?? [])];
    }
}

class GTplComponentBase {
    onConstruct() { }
    onInit() { }
    onTemplateReady() { }
    onConnect() { }
    onDisconnect() { }
    onDestroy() { }
}

const GBus = new GEvents();

class AppGTplComponent extends GTplComponentBase {
    onConstruct() {
        GBus.on("urlChanged", ({ state, current, prev }) => this.onRouteChange(state, current, prev), { namespace: "router" });
    }
    onRouteChange(state, current, prev) {
    }
}

class GRouterService {
    static init(urls, opts) {
        if (this._router)
            return this._router;
        this._router = new GRouter(urls, opts);
        this._router.start((state, current, prev) => GBus.emit("urlChanged", { state, current, prev }, "router"));
        return this._router;
    }
    static getRouter() {
        return this._router;
    }
}

export { Animations, AppGTplComponent, Component, Directive, GBus, GDirectiveBase, GEvents, GRouter, GRouterService, GTplComponentBase, GWatcher, getControllerFromComponent, getCtrl, getFlags, getGTPL, getGtplFromComponent, getMeta, getRegisteredComponent, isHostCreated };
//# sourceMappingURL=gtplweb.esm.js.map
