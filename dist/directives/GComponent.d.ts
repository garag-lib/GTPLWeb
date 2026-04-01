import { GDirectiveBase } from "../core/GDirectiveBase.js";
export declare class GComponent extends GDirectiveBase {
    webc?: any;
    regc?: any;
    private destroyComponent;
    private createComponent;
    onInit(): void;
    setAttribute(name: string, value: any): void;
    getAttribute(name: string): string | null;
    removeAttribute(name: string): void;
}
