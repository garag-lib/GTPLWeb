export declare class GDirectiveBase {
    protected ele: HTMLElement;
    protected value: string;
    protected root: any;
    protected argument?: string;
    constructor(ele: HTMLElement, value: string, root: any, arg?: string);
    onInit?(): void;
}
