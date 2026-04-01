import { ComponentMeta, HostElement } from '../component.types';
export declare function applyComponentStyles(cmp: HostElement, meta: ComponentMeta, mode?: ComponentMeta['styleMode']): void;
export declare function applyLazyStyles(cmp: HostElement, meta: ComponentMeta): void;
export declare function ensureCompiledTemplate(classMeta: ComponentMeta): Promise<void>;
export declare function instantiateTemplate(controller: any, generator: any): any;
