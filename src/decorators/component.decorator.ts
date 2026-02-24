import type { GController, ControllerCtor, ComponentConfig, ComponentMeta, HostElement, WithGComponent, RegisteredComponent } from '../component.types';
import { applyComponentStyles, applyLazyStyles, instantiateTemplate, ensureCompiledTemplate } from './runtime-helpers.js';
import GTPL from '@mpeliz/gtpl';

// ---- 

const COMPONENT_REGISTRY = new Map<string, RegisteredComponent>();

export function getRegisteredComponent(name: string): RegisteredComponent | undefined {
  return COMPONENT_REGISTRY.get(name);
}

// ---- 

function toKebabCase(x: string): string {
  return x
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function defineHidden<T extends object, K extends PropertyKey>(target: T, key: K, value: any, opts?: {
  enumerable?: boolean;
  writable?: boolean;
  configurable?: boolean;
}
) {
  Object.defineProperty(target, key, {
    value,
    enumerable: opts?.enumerable ?? false,
    writable: opts?.writable ?? false,
    configurable: opts?.configurable ?? false,
  });
}

const isLikelyHtml = (s?: string | null): s is string => !!s && /^\s*</.test(s) && s.includes('>');

// ---- Estado interno oculto ----

const COMP_CTRL: unique symbol = Symbol('COMP_CTRL');
const COMP_FLAGS: unique symbol = Symbol('COMP_FLAGS');
const COMP_GTPL: unique symbol = Symbol('COMP_GTPL');
const CLASS_META: unique symbol = Symbol('CLASS_META');
const HOST_CREATE: unique symbol = Symbol('HOST_CREATE');

export const getCtrl = (host: any) => host[COMP_CTRL];
export const getFlags = (host: any) => host[COMP_FLAGS];
export const getGTPL = (host: any) => host[COMP_GTPL];
export const getMeta = (ctor: any) => ctor[CLASS_META] as ComponentMeta;

// ---- 

export function getControllerFromComponent(component: any): GController | undefined {
  return component[COMP_CTRL];
}

export function getGtplFromComponent(component: any) {
  return component[COMP_GTPL];
}

export function isHostCreated(ele: any) {
  return (ele[HOST_CREATE] === true) ? true : false;
}

function initComponentHost(host: any, ControllerClass: any, baseMeta: ComponentMeta, useWebComponent: boolean, ...args: any) {

  // --- 1. Controller ---
  const ctrl = new ControllerClass(...args);
  defineHidden(host, COMP_CTRL, ctrl);
  defineHidden(ctrl, "$el", host);

  // --- 2. Flags ---
  const flags = { firstRender: true, stylesApplied: false, destroyed: false };
  defineHidden(host, COMP_FLAGS, flags);

  // --- 3. destroy() ---
  defineHidden(ctrl, "destroy", function () {
    ctrl.onDestroy?.();
    flags.destroyed = true;
    try { host[COMP_GTPL]?.destroy?.(); } catch (ex) { console.error(ex); }
    flags.firstRender = false;
    if (!useWebComponent)
      host.innerHtml = '';
    if (useWebComponent || host[HOST_CREATE])
      host.remove();
    host[COMP_GTPL] = null;
  }.bind(ctrl));

  // --- 4. onConstruct ---
  ctrl.onConstruct?.(...args);

  // --- 5. META por clase ---
  const ctor = useWebComponent ? host.constructor : ControllerClass.__gcomponent__;
  if (!Object.prototype.hasOwnProperty.call(ctor, CLASS_META)) {
    defineHidden(ctor, CLASS_META, Object.freeze({ ...baseMeta }));
  }

  const classMeta = getMeta(ctor);

  // --- 6. Host / Shadow ---
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

  // --- 7. Template (AOT + async JIT) ---
  const loadTemplate = () => {
    const gtpl = instantiateTemplate(ctrl, classMeta.templateFactory);
    defineHidden(host, COMP_GTPL, gtpl, { writable: true });
    ctrl.onInit?.();
  };

  if (classMeta.templateFactory) {
    loadTemplate();
  } else {
    ensureCompiledTemplate(classMeta).then(() => {
      if (!flags.destroyed) loadTemplate();
    });
  }

  // --- 8. Styles + Render ---
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

// ---- 

export class GWatcher extends HTMLElement {

  ctrl?: any;

  constructor(ctrl?: any) {
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
    const host = this.parentNode as any;
    if (!host) return;
    const ctrl = getControllerFromComponent(host);
    ctrl?.onConnect?.();
  }

  disconnectedCallback() {
    if (this.ctrl) {
      this.ctrl.onConnect?.(this);
      return;
    }
    const host = this.parentNode as any;
    if (!host) return;
    const ctrl = getControllerFromComponent(host);
    ctrl?.onDisconnect?.();
  }
}

if (!customElements.get("g-watcher")) {
  customElements.define("g-watcher", GWatcher);
}

// ---- 

export function Component<C extends GController, TBase extends ControllerCtor<C>>(config: ComponentConfig) {

  return function (ControllerClass: TBase) {

    const options: ComponentConfig = config;

    const asWebComponent = options.asWebComponent != null ? options.asWebComponent : true;

    type Flags = { firstRender: boolean; stylesApplied: boolean; destroyed: boolean };
    type Ctrl = InstanceType<TBase>;

    // Tag inferido
    const inferredTag = toKebabCase(ControllerClass.name);
    const tagName = options.tag ?? inferredTag;
    if (!tagName.includes('-')) {
      throw new Error(`Custom element name "${tagName}" must contain a hyphen (-). Use 'tag' in @Component.`);
    }

    // Shadow normalizado
    let shadowOpt: boolean | ShadowRootInit = false;
    if (options.shadow === true) shadowOpt = { mode: 'open' };
    else if (options.shadow === false) shadowOpt = false;
    else if (typeof options.shadow === 'object') shadowOpt = options.shadow;

    // AOT?
    const aotTemplate = (ControllerClass as any).__gtemplate__ ?? null;
    const styleMode = options.styleMode ?? 'global';

    // Estilos y plantilla (AOT + config / JIT)
    let styleUrls: string[] = [];
    let stylesInline: string[] = [];
    let templateHtml: string | null = null;
    let templateUrl: string | null = null;

    if (aotTemplate) {
      styleUrls = (ControllerClass as any).__styleUrls__ ?? [];
      stylesInline = (ControllerClass as any).__stylesInline__ ?? [];
    } else {
      const tStr = typeof options.template === 'string' ? options.template : null;
      const tObj = typeof options.template === 'object' && options.template ? (options.template as any).html ?? null : null;
      if (tObj != null) templateHtml = tObj;
      else if (tStr != null) isLikelyHtml(tStr) ? (templateHtml = tStr) : (templateUrl = tStr);
      if (options.style) {
        const arr = Array.isArray(options.style) ? options.style : [options.style];
        for (const s of arr) {
          const t = s.trim();
          if (/\.(scss|sass)$/i.test(t)) continue;
          if (/\.css$/i.test(t)) styleUrls.push(t);
          else stylesInline.push(s);
        }
      }
    }

    const baseMeta: ComponentMeta = {
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

    let GeneratedComponent: any = null;

    if (asWebComponent) {

      GeneratedComponent = class extends HTMLElement implements HostElement {

        public $host!: Element | ShadowRoot;
        declare readonly [COMP_CTRL]: Ctrl;
        declare readonly [COMP_FLAGS]: Flags;
        declare [COMP_GTPL]: any;

        constructor(...args:any) {
          super();
          initComponentHost(this, ControllerClass, baseMeta, true, ...args);
        }

        connectedCallback(): void {
          getCtrl(this).onConnect?.();
        }

        disconnectedCallback(): void {
          getCtrl(this)?.onDisconnect?.()
        }

      }

      if (!customElements.get(tagName))
        customElements.define(tagName, GeneratedComponent);

    } else {

      GeneratedComponent = class {

        constructor(ele?: Element, ...args: any) {

          if (!ele) {
            ele = GTPL.utils.globalObject.document.createElement('div');
            (ele as any).setAttribute('g-component', tagName);
            defineHidden(ele as any, HOST_CREATE, true);
          }

          ele?.appendChild(new GWatcher(this));

          return initComponentHost(ele, ControllerClass, baseMeta, false, ...args);

        }

        connectedCallback(): void {
          getCtrl(this).onConnect?.();
        }

        disconnectedCallback(): void {
          getCtrl(this)?.onDisconnect?.()
        }

      }

    }

    defineHidden(ControllerClass, '__gcomponent__', GeneratedComponent);

    if (!COMPONENT_REGISTRY.has(tagName)) {
      COMPONENT_REGISTRY.set(tagName, {
        asWebComponent,
        ControllerClass: ControllerClass,
        ComponentClass: GeneratedComponent
      });
    } else {
      console.warn(`Component with name "${tagName}" is already defined.`);
    }

    return ControllerClass as unknown as WithGComponent<TBase, HostElement>;

  };

}

// ---- 
