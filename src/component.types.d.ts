
export interface RegisteredComponent {
    asWebComponent: boolean;
    ControllerClass: ControllerCtor<any>;
    ComponentClass: any;
}

export interface HostElement extends HTMLElement {
    $host: Element | ShadowRoot;
}

export type ComponentMeta = {
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

export interface ComponentConfig {
    template: string | { html: string };
    style?: string | string[];
    tag?: string;
    styleMode?: 'inline' | 'file' | 'global' | 'lazy';
    shadow?: boolean | ShadowRootInit;
    asWebComponent?: boolean;
}

export interface GController {
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
export type ControllerCtor<C extends GController = GController> =
    abstract new (...args: any[]) => C;

/** Clase decorada = la misma T + static __gcomponent__ */
export type WithGComponent<
    T extends ControllerCtor<any>,
    El extends HostElement = HostElement
> = T & { readonly __gcomponent__: new () => El };

/** Firma del decorador compatible con @Component(...) */
export declare function Component<
    C extends GController,
    T extends ControllerCtor<C>,
    El extends HostElement = HostElement
>(config: ComponentConfig): (ControllerClass: T) => WithGComponent<T, El>;

/** 🔸 Útil para tipar `current.classRef` */
export type ControllerClassWithStatic<
    C extends GController = GController,
    El extends HostElement = HostElement
> = WithGComponent<ControllerCtor<C>, El>;