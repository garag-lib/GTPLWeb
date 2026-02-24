import { GDirectiveBase } from "../core/GDirectiveBase.js";
import { getControllerFromComponent, getRegisteredComponent, isHostCreated } from "../decorators/component.decorator";
import { Directive } from "../decorators/directive.decorator";

@Directive({
    name: "g-component",
})
export class GComponent extends GDirectiveBase {

    webc?: any;
    regc?: any;

    private destroyComponent() {
        if (this.webc) {
            const prevCtrl: any = getControllerFromComponent(this.webc);
            prevCtrl?.destroy();
            if (!this.regc.asWebComponent) {
                if (isHostCreated(this.webc)) this.webc.remove();
                else this.webc.setAttribute('g-component', '');
            }
            this.webc = undefined;
            this.regc = undefined;
        }
    }

    private createComponent(tagName: string) {

        if (this.value == tagName)
            return;

        this.destroyComponent();

        const regc = getRegisteredComponent(this.value);

        if (!regc) {
            console.warn(`[g-component] componente "${tagName}" no registrado`);
            return;
        }

        this.value = tagName;
        this.webc.setAttribute('g-component', this.value);

        this.ele.innerHTML = "";

        if (regc.asWebComponent) {
            const webc = new regc.ComponentClass();
            this.ele.appendChild(webc);
            this.webc = webc;
        } else {
            this.webc = new regc.ComponentClass(this.ele);
        }

        this.regc = regc;

    }

    onInit() {
        this.createComponent(this.value);
    }

    setAttribute(name: string, value: any) {
        if (this.value == value)
            return;
        this.destroyComponent();
        this.createComponent(value);
    }

    getAttribute(name: string): string | null {
        return this.value ?? '';
    }

    removeAttribute(name: string): void {
        this.destroyComponent();
        this.value = '';
    }

}
