import { GDirectiveBase } from "../core/GDirectiveBase.js";
export declare class GClass extends GDirectiveBase {
    cls?: string[];
    onInit(): void;
    setAttribute(name: string, value: any): void;
    getAttribute(name: string): string | null;
    removeAttribute(name: string): void;
}
