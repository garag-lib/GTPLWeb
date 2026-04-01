import type { GController, ControllerCtor, ComponentConfig, ComponentMeta, HostElement, WithGComponent, RegisteredComponent } from '../component.types';
export declare function getRegisteredComponent(name: string): RegisteredComponent | undefined;
export declare const getCtrl: (host: any) => any;
export declare const getFlags: (host: any) => any;
export declare const getGTPL: (host: any) => any;
export declare const getMeta: (ctor: any) => ComponentMeta;
export declare function getControllerFromComponent(component: any): GController | undefined;
export declare function getGtplFromComponent(component: any): any;
export declare function isHostCreated(ele: any): boolean;
export declare class GWatcher extends HTMLElement {
    ctrl?: any;
    constructor(ctrl?: any);
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export declare function Component<C extends GController, TBase extends ControllerCtor<C>>(config: ComponentConfig): (ControllerClass: TBase) => WithGComponent<TBase, HostElement>;
