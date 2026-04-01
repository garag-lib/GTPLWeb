/**
 * Clase base para todas las directivas de GTpl.
 * Define constructor, ciclo de vida y utilidades comunes.
 */
declare class GDirectiveBase {
    /** Elemento DOM al que está ligada la directiva */
    protected ele: HTMLElement;
    /** Expresión o valor literal asociado a la directiva */
    protected value: string;
    /** Contexto raíz del componente o plantilla */
    protected root: any;
    /** Argumento añadido a la directiva */
    protected argument?: string;
    constructor(ele: HTMLElement, value: string, root: any, arg?: string);
    /**
     * Hook llamado automáticamente al crear la directiva.
     */
    onInit?(): void;
}

/**
 * ======================================================================
 *  ANIMATIONS — Utility Class (Vanilla JS, Ultra Extended)
 * ----------------------------------------------------------------------
 *  ✔ Sistema genérico para animar CUALQUIER propiedad CSS con transiciones
 *  ✔ Fiable gracias a doble requestAnimationFrame
 *  ✔ Animaciones básicas, avanzadas, dinámicas y paramétricas
 *  ✔ Todas retornan Promise<void> → permiten await/encadenamiento
 *  ✔ No requiere frameworks ni dependencias
 *
 * ----------------------------------------------------------------------
 *  EJEMPLOS DE USO
 * ----------------------------------------------------------------------
 *
 *  1) Fade In
 *      await Animations.fadeIn(el);
 *
 *  2) Slide desde la izquierda
 *      await Animations.slideInX(el, "-100%");
 *
 *  3) Slide vertical + Fade
 *      await Animations.slideFadeInY(el, "30px", 400);
 *
 *  4) Entrada diagonal
 *      await Animations.diagonalIn(el, "-50%", "50%", 350);
 *
 *  5) Zoom + Fade
 *      await Animations.zoomIn(el, "0.5", 400);
 *
 *  6) Animación elástica
 *      await Animations.elasticIn(el);
 *
 *  7) Bounce (rebote)
 *      await Animations.bounceIn(el);
 *
 *  8) Flip 3D
 *      await Animations.flipIn(el, "-90deg", 500);
 *
 *  9) Animación paramétrica de entrada
 *      await Animations.enter(el, {
 *          xFrom: "-40px",
 *          yFrom: "20px",
 *          scaleFrom: "0.8",
 *          rotateFrom: "-8deg",
 *          duration: 350
 *      });
 *
 * 10) Animación paramétrica de salida
 *      await Animations.leave(el, {
 *          yTo: "40px",
 *          opacityTo: "0",
 *          rotateTo: "8deg"
 *      });
 *
 * 11) Usar un "queue" (cola de animaciones encadenadas)
 *      await Animations.queue(el, [
 *          () => Animations.fadeIn(el),
 *          () => Animations.slideInY(el, "50px"),
 *          () => Animations.bounceIn(el)
 *      ]);
 *
 * 12) Animación personalizada manual
 *
 *      Animations.setInitial(el, {
 *          opacity: "0",
 *          transform: "translateY(40px) scale(0.9)"
 *      });
 *
 *      await Animations.animateTo(el, {
 *          opacity: "1",
 *          transform: "translateY(0) scale(1)"
 *      }, 350);
 *
 * ----------------------------------------------------------------------
 *  NOTAS
 * ----------------------------------------------------------------------
 *  ✔ Todos los métodos DEBEN usarse con await si esperas sincronización.
 *  ✔ No se depende de CSS externo.
 *  ✔ transitions + doble rAF permite animaciones fiables incluso en DOM recién montado.
 *
 * ======================================================================
 */
declare class Animations {
    static enabled: boolean;
    static enable(): void;
    static disable(): void;
    /** Define el estado inicial sin transición */
    static setInitial(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void;
    static resetStyles(el: HTMLElement): void;
    /**
     * Aplica el estado final con transición
     * CON doble requestAnimationFrame para máxima fiabilidad
     */
    static animateTo(element: HTMLElement, styles: Partial<CSSStyleDeclaration>, duration?: number, easing?: string): Promise<void>;
    /** Sleep util */
    static wait(ms: number): Promise<unknown>;
    /** Detiene una transición en curso */
    static stopTransition(el: HTMLElement): void;
    static fadeIn(el: HTMLElement, duration?: number): Promise<void>;
    static fadeOut(el: HTMLElement, duration?: number): Promise<void>;
    static slideInX(el: HTMLElement, from?: string, duration?: number): Promise<void>;
    static slideOutX(el: HTMLElement, to?: string, duration?: number): Promise<void>;
    static slideInY(el: HTMLElement, from?: string, duration?: number): Promise<void>;
    static slideOutY(el: HTMLElement, to?: string, duration?: number): Promise<void>;
    static scaleIn(el: HTMLElement, from?: string, duration?: number): Promise<void>;
    static scaleOut(el: HTMLElement, to?: string, duration?: number): Promise<void>;
    static rotateIn(el: HTMLElement, from?: string, duration?: number): Promise<void>;
    static rotateOut(el: HTMLElement, to?: string, duration?: number): Promise<void>;
    static slideFadeInY(el: HTMLElement, from?: string, duration?: number): Promise<void>;
    static slideFadeInX(el: HTMLElement, from?: string, duration?: number): Promise<void>;
    static diagonalIn(el: HTMLElement, dx?: string, dy?: string, duration?: number): Promise<void>;
    static diagonalOut(el: HTMLElement, dx?: string, dy?: string, duration?: number): Promise<void>;
    static zoomIn(el: HTMLElement, from?: string, duration?: number): Promise<void>;
    static zoomOut(el: HTMLElement, to?: string, duration?: number): Promise<void>;
    static flipIn(el: HTMLElement, from?: string, duration?: number): Promise<void>;
    static flipOut(el: HTMLElement, to?: string, duration?: number): Promise<void>;
    static bounceIn(el: HTMLElement, duration?: number): Promise<void>;
    static elasticIn(el: HTMLElement, duration?: number): Promise<void>;
    static slide(el: HTMLElement, axis: "x" | "y", distance: string, duration?: number, easing?: string): Promise<void>;
    static enter(el: HTMLElement, opts?: {
        opacityFrom?: string;
        xFrom?: string;
        yFrom?: string;
        scaleFrom?: string;
        rotateFrom?: string;
        duration?: number;
        easing?: string;
    }): Promise<void>;
    static leave(el: HTMLElement, opts?: {
        opacityTo?: string;
        xTo?: string;
        yTo?: string;
        scaleTo?: string;
        rotateTo?: string;
        duration?: number;
        easing?: string;
    }): Promise<void>;
    static queue(el: HTMLElement, animations: (() => Promise<void>)[]): Promise<void>;
}

interface GMatch {
    id: string;
    url: string;
    fullPath: string;
    params: Record<string, string>;
    query?: Record<string, string>;
    classRef?: any;
    default?: boolean;
    redirect?: string;
    gurl?: GURL;
}
interface GURL {
    id: string;
    url: string;
    regex?: Record<string, string>;
    params?: Record<string, string | null>;
    optional?: string[];
    childs?: GURL[];
    parent?: GURL | null;
    default?: boolean;
    classRef?: any;
    middleware?: Middleware | Middleware[];
    redirect?: string;
    wildcard?: boolean;
    regexurl?: RegExp;
    paramKeys?: string[];
}
/** Resultado de middleware: mantiene compatibilidad con boolean. */
type MiddlewareResult = boolean | {
    ok: boolean;
    redirect?: string;
};
type Middleware = (match: GMatch) => MiddlewareResult | Promise<MiddlewareResult>;
interface RouterOptions {
    mode?: "hash" | "history";
    base?: string;
    debug?: boolean;
    anchorLeafRoutes?: boolean;
    strictErrors?: boolean;
}
declare class GRouter {
    private urls;
    private ids;
    private defaultRoute?;
    private historyCache;
    private active;
    private suppressNextHashChange;
    private cb?;
    private options;
    private hashchangebind?;
    private popstatebind?;
    private transientData;
    beforeChange?: (prev: GMatch | null, next: GMatch) => boolean | Promise<boolean>;
    afterChange?: (prev: GMatch | null, current: GMatch) => void;
    constructor(urlconfig?: GURL[], opts?: RouterOptions);
    /** Permite actualizar opciones (ej. para pasar a history). Llama antes de loadEvents/start */
    setOptions(opts: RouterOptions): void;
    private log;
    private normalizePath;
    private escapeRegexLiteral;
    /** Calcula una "especificidad" simple: más literal y más largo = más específico */
    private routeSpecificity;
    /** Compila el patrón de ruta a RegExp y detecta claves y opcionales */
    private compilePattern;
    /** Registra rutas, compila regex y crea el índice de ids */
    loadIds(gurls: GURL[], parent?: GURL): void;
    /** Compatibilidad con tu API */
    prepareGURL(gurl: GURL): boolean;
    getGurlFromId(id: string): GURL | undefined;
    private extractParams;
    private runMiddlewareChain;
    /** Itera rutas en orden de mayor especificidad para evitar colisiones */
    private orderedRoutes;
    /** Resuelve un path (sin query), recursivo sobre childs */
    private resolvePath;
    /** Compatibilidad con tu API: checkUrl(url, urls?, params?) */
    checkUrl(url: string, routes?: GURL[], params?: Record<string, string>): Promise<GMatch | null>;
    private buildUrlFromRouteChain;
    private buildUrlFromTemplate;
    /** Compatibilidad con tu API: getUrlFromParams(id, params?) */
    getUrlFromParams(id: string, params?: Record<string, any>): string | null;
    private parseQueryString;
    private buildQueryString;
    private currentPathFromLocation;
    private currentQueryFromLocation;
    private setLocation;
    /** Navegación programática (compat) */
    navigate(idOrPath: string, params?: Record<string, any>, query?: Record<string, any>): void;
    /**
     * Navega a una ruta (por id o path) adjuntando datos en memoria.
     * Los datos no van en la URL ni en sessionStorage.
     * Se mantienen hasta que el usuario recargue o cambie de ruta.
     */
    navigateWithData(idOrPath: string, data: any, params?: Record<string, any>, query?: Record<string, any>): void;
    getDataForCurrent(): any;
    getDataForMatch(match: GMatch | null): any;
    /**
     * Limpia los datos asociados a una ruta (o todos).
     */
    clearData(path?: string): void;
    /** Replace en el historial (compat) */
    replace(idOrPath: string, params?: Record<string, any>, query?: Record<string, any>): void;
    back(): void;
    removeListener(): void;
    setListener(cb: (state: "new" | "history" | "notfound", current: GMatch | null, prev: GMatch | null) => void): void;
    /** Compatibilidad con tu API: loadEvents(callback) */
    start(callback: (state: "new" | "history" | "notfound", current: GMatch | null, prev: GMatch | null) => void): void;
    /** Compatibilidad con tu API (sólo en modo hash) */
    hashchange(event: HashChangeEvent & {
        newURL?: string;
        oldURL?: string;
    }): Promise<void>;
    private onLocationChange;
    /** Compatibilidad con tu API: limpia toda la caché (y opcionalmente fija active) */
    cleanHist(gurl?: GURL): void;
    /** Compatibilidad con tu API: elimina de la caché según objeto asociado */
    removeHist(gurldel: any): void;
    /** Compatibilidad con tu API */
    getParams(): Record<string, string>;
    /** Añade una ruta en caliente (corrige bug: this.urls.get → this.ids.get) */
    addGurl(gurl: GURL, parentId?: string): void;
    /** Liberar listeners y cachés */
    destroy(): void;
    escapeRegExp(str: string): string;
    /** Devuelve null en vez de lanzar si falta param obligatorio (útil en UI) */
    tryGetUrlFromParams(id: string, params?: Record<string, any>): string | null;
    getMatch(): GMatch | null;
    getAllRoutes(): GURL[];
    /**
     * Devuelve el GMatch que resultaría de navegar a un path dado,
     * pero si existe en caché se devuelve directamente el objeto cacheado.
     * NO modifica el router ni dispara eventos.
     */
    matchPath(pathOrUrl: string): Promise<GMatch | null>;
    /**
      * Devuelve la cadena de GURL desde la raíz hasta la ruta actual (o una ruta dada).
      * Útil para breadcrumbs, títulos, etc.
      */
    getRouteChain(match?: GMatch): GURL[];
}

/**
 * GEvents — Event Bus tipado, con namespaces y soporte para async/await.
 *
 * ✅ Características principales:
 * - Tipado fuerte opcional con genéricos.
 * - Namespaces (agrupación por canal: "core", "ui", "pluginX").
 * - Soporta handlers asíncronos y prioridades.
 * - API tipo EventEmitter (`on`, `once`, `off`, `emit`, `waitFor`, etc.).
 * - Limpieza y monitoreo (`removeAllListeners`, `listenerCount`, `listNamespaces`).
 *
 * 💡 Ideal para frameworks, SDKs, sistemas modulares y arquitecturas plugin-based.
 */
interface WildcardPayload<EvMap> {
    event: keyof EvMap;
    payload: EvMap[keyof EvMap];
    namespace: string;
}
type EventHandler<T = any> = (payload: T) => void | Promise<void>;
type WildcardHandler<Events extends Record<string, any>> = (payload: WildcardPayload<Events>) => void | Promise<void>;
interface EventListener<T = any> {
    handler: EventHandler<T> | WildcardHandler<any>;
    once?: boolean;
    priority?: number;
}
interface EventBusInterface<Events extends Record<string, any> = Record<string, any>> {
    /**
     * Suscribe un listener a un evento.
     * @param event Nombre del evento.
     * @param handler Función que se ejecutará cuando se emita el evento.
     * @param options priority: número para controlar el orden, namespace: canal opcional.
     */
    on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>, options?: {
        priority?: number;
        namespace?: string;
    }): void;
    /**
     * Suscribe un listener que se ejecutará una sola vez.
     */
    once<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>, options?: {
        priority?: number;
        namespace?: string;
    }): void;
    /**
     * Elimina un listener específico.
     */
    off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>, namespace?: string): void;
    /**
     * Emite un evento (ejecuta todos los listeners).
     * Retorna una promesa si alguno de los handlers es async.
     */
    emit<K extends keyof Events>(event: K, payload: Events[K], namespace?: string): Promise<void>;
    /**
     * Espera un evento como una promesa (útil con async/await).
     * Opcionalmente puede fallar con timeout.
     */
    waitFor<K extends keyof Events>(event: K, timeoutMs?: number, namespace?: string): Promise<Events[K]>;
    /**
     * Elimina todos los listeners de un namespace o de todos.
     */
    removeAllListeners(namespace?: string): void;
    /**
     * Devuelve la cantidad de listeners activos.
     * Puede filtrar por namespace.
     */
    listenerCount(namespace?: string): number;
    /**
     * Lista los namespaces activos.
     */
    listNamespaces(): string[];
}
/**
 * GEvents — implementación base del bus de eventos con namespaces.
 */
declare class GEvents<Events extends Record<string, any> = Record<string, any>> implements EventBusInterface<Events> {
    private namespaces;
    constructor();
    private getNamespace;
    /**
     * Registra un listener (interno). Usado por on() y once().
     */
    private addListener;
    /**
     * Suscribe un listener a un evento.
     */
    on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>, options?: {
        priority?: number;
        namespace?: string;
    }): EventHandler<Events[K]>;
    /**
     * Suscribe un listener que se ejecutará una sola vez.
     */
    once<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>, options?: {
        priority?: number;
        namespace?: string;
    }): EventHandler<Events[K]>;
    /**
     * Suscribe un listener y devuelve un objeto con `.off()` para cancelarlo fácilmente.
     *
     * @example
     * const sub = bus.subscribe("update", data => console.log(data));
     * sub.off(); // 👈 elimina el listener
     */
    subscribe<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>, options?: {
        priority?: number;
        namespace?: string;
    }): {
        off: () => void;
    };
    off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>, namespace?: string): void;
    offAll<K extends keyof Events>(event?: K, namespace?: string): void;
    /**
     * Emite un evento (ejecuta todos los listeners).
     *
     * @param event Nombre del evento.
     * @param payload Datos asociados al evento.
     * @param namespace Namespace opcional (por defecto "default").
     * @param options
     *    - sequential: fuerza la ejecución en orden (por defecto es paralelo).
     */
    emit<K extends keyof Events>(event: K, payload: Events[K], namespace?: string, options?: {
        sequential?: boolean;
    }): Promise<void>;
    waitFor<K extends keyof Events>(event: K, timeoutMs?: number, namespace?: string): Promise<Events[K]>;
    /**
   * Espera a que un evento se emita y **todos los listeners terminen** (incluidos los async).
   *
   * @param event Nombre del evento a esperar.
   * @param timeoutMs Tiempo máximo de espera (opcional).
   * @param namespace Namespace opcional (por defecto "default").
   *
   * @returns Una promesa que se resuelve con el payload cuando todos los handlers hayan terminado.
   */
    waitForComplete<K extends keyof Events>(event: K, timeoutMs?: number, namespace?: string): Promise<Events[K]>;
    removeAllListeners(namespace?: string): void;
    private count;
    listenerCount(namespace?: string): number;
    listNamespaces(): string[];
    hasListeners<K extends keyof Events>(event: K, namespace?: string): boolean;
    getListeners<K extends keyof Events>(event: K, namespace?: string): EventListener<Events[K]>[];
}

interface RegisteredComponent {
    asWebComponent: boolean;
    ControllerClass: ControllerCtor<any>;
    ComponentClass: any;
}

interface HostElement extends HTMLElement {
    $host: Element | ShadowRoot;
}

type ComponentMeta = {
    templateHtml?: string | null;
    templateUrl?: string | null;
    templateFactory?: any | null;           // AOT o JIT compilado
    styleMode: 'inline' | 'file' | 'global' | 'lazy';
    styleUrls: string[];
    stylesInline: string[];
    shadow: boolean | ShadowRootInit;
    asWebComponent: boolean;
    /** Lock para compilar JIT una sola vez por clase */
    compilePromise?: Promise<void> | null;
};

interface ComponentConfig {
    template: string | { html: string };
    style?: string | string[];
    tag?: string;
    styleMode?: 'inline' | 'file' | 'global' | 'lazy';
    shadow?: boolean | ShadowRootInit;
    asWebComponent?: boolean;
}

interface GController {
    declare static readonly __gcomponent__?: new () => HostElement;
    readonly $el?: HostElement;
    readonly destroy?(): void;
    // Lifecycles (todos opcionales)
    onConstruct?(...args?:any): void;
    onInit?(): void;
    onTemplateReady?(): void;
    onConnect?(): void;
    onDisconnect?(): void;
    onDestroy?(): void;
}

/** Constructor de controladores */
type ControllerCtor<C extends GController = GController> =
    abstract new (...args: any[]) => C;

/** Clase decorada = la misma T + static __gcomponent__ */
type WithGComponent<
    T extends ControllerCtor<any>,
    El extends HostElement = HostElement
> = T & { readonly __gcomponent__: new () => El };

declare abstract class GTplComponentBase implements GController {
    static readonly __gcomponent__?: GController['__gcomponent__'];
    readonly $el?: GController['$el'];
    readonly destroy?: GController['destroy'];
    onConstruct?(): void;
    onInit?(): void;
    onTemplateReady?(): void;
    onConnect?(): void;
    onDisconnect?(): void;
    onDestroy?(): void;
}

type RoutedMatch = (GMatch & {
    classRef?: any;
}) | GMatch | null;
interface GlobalEvents {
    message: string;
    error: {
        message: string;
        code?: number;
    };
    urlChanged: {
        state: "new" | "history" | "notfound";
        current: RoutedMatch;
        prev: RoutedMatch;
    };
    [key: string]: any;
}
declare const GBus: GEvents<GlobalEvents>;

declare abstract class AppGTplComponent extends GTplComponentBase {
    onConstruct(): void;
    onRouteChange(state: "new" | "history" | "notfound", current: RoutedMatch, prev: RoutedMatch): void;
}

declare class GRouterService {
    private static _router?;
    static init(urls: GURL[], opts?: RouterOptions): GRouter;
    static getRouter(): GRouter | undefined;
}

declare function getRegisteredComponent(name: string): RegisteredComponent | undefined;
declare const getCtrl: (host: any) => any;
declare const getFlags: (host: any) => any;
declare const getGTPL: (host: any) => any;
declare const getMeta: (ctor: any) => ComponentMeta;
declare function getControllerFromComponent(component: any): GController | undefined;
declare function getGtplFromComponent(component: any): any;
declare function isHostCreated(ele: any): boolean;
declare class GWatcher extends HTMLElement {
    ctrl?: any;
    constructor(ctrl?: any);
    connectedCallback(): void;
    disconnectedCallback(): void;
}
declare function Component<C extends GController, TBase extends ControllerCtor<C>>(config: ComponentConfig): (ControllerClass: TBase) => WithGComponent<TBase, HostElement>;

/**
 * Configuración del decorador @Directive()
 */
interface DirectiveConfig {
    /**
     * Nombre de la directiva (debe ser un nombre de atributo HTML válido).
     * Si no se define, se genera automáticamente a partir del nombre de la clase.
     */
    name?: string;
}
/**
 * 🧭 Decorador para registrar una directiva en GTpl
 */
declare function Directive(config?: DirectiveConfig): (constructor: any) => any;

export { Animations, AppGTplComponent, Component, Directive, GBus, GDirectiveBase, GEvents, GRouter, GRouterService, GTplComponentBase, GWatcher, getControllerFromComponent, getCtrl, getFlags, getGTPL, getGtplFromComponent, getMeta, getRegisteredComponent, isHostCreated };
export type { DirectiveConfig, EventBusInterface, EventHandler, EventListener, GController, GMatch, GURL, GlobalEvents, HostElement, Middleware, MiddlewareResult, RoutedMatch, RouterOptions, WildcardHandler, WildcardPayload };
