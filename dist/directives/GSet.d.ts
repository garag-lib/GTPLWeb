import { GDirectiveBase } from "../core/GDirectiveBase.js";
export declare class GSet extends GDirectiveBase {
    private path?;
    onInit(): void;
    private applyPathSet;
    setAttribute(name: string, value: any): void;
    getAttribute(name: string): string | null;
    removeAttribute(name: string): void;
}
