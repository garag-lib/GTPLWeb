import { GDirectiveBase } from "../core/GDirectiveBase.js";
import { Directive } from "../decorators/directive.decorator";

@Directive({
    name: "g-class",
})
export class GClass extends GDirectiveBase {

    cls?: string[];

    onInit() {
        const current = this.ele.getAttribute('class');
        this.cls = current ? current.split(/\s+/).filter(Boolean) : [];
    }

    setAttribute(name: string, value: any) {
        const ele = this.ele as HTMLElement;
        this.cls = Array.isArray(value) ? value : String(value || '').split(/\s+/);
        if (this.cls.length) ele.setAttribute('class', this.cls.join(' '));
        else ele.removeAttribute('class');
    }

    getAttribute(name: string): string | null {
        return this.cls?.length ? this.cls.join(' ') : null;
    }

    removeAttribute(name: string): void {
        const ele = this.ele as HTMLElement;
        ele.removeAttribute('class');
        this.cls = [];
    }

}