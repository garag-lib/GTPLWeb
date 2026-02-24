import { GDirectiveBase } from "../core/GDirectiveBase.js";
import { getControllerFromComponent } from "../decorators/component.decorator";
import { Directive } from "../decorators/directive.decorator";

@Directive({
    name: "g-set",
})
export class GSet extends GDirectiveBase {

    private path?: string[] | null;

    onInit() {
        // 1) Sintaxis nueva: g-set:prop / g-set:obj.prop
        if (this.argument && this.argument.trim()) {
            this.path = this.argument.trim().split('.');
            return;
        }
        // 2) Sintaxis antigua: g-set-var="prop" / "obj.prop"
        const legacy = this.ele.getAttribute("g-set-var");
        if (legacy && legacy.trim()) {
            this.path = legacy.trim().split('.');
            this.ele.removeAttribute("g-set-var");
            return;
        }
        console.error(
            'g-set: falta el nombre de la propiedad. ' +
            'Usa g-set:prop / g-set:obj.prop o g-set-var="prop".'
        );
    }

    private applyPathSet(target: any, value: any) {
        if (!target || !this.path || this.path.length === 0) return;
        const path = this.path; // 👈 asegura a TS que no es undefined
        if (path.length > 1) {
            const reduce = (obj: any, index: number, fin: number): any => {
                if (obj == null) return undefined;
                if (index === fin) return obj[path[index]];
                return reduce(obj[path[index]], index + 1, fin);
            };
            const parent = reduce(target, 0, path.length - 2);
            if (!parent) return;
            const lastKey = path[path.length - 1];
            parent[lastKey] = value;
        } else {
            const lastKey = path[0];
            target[lastKey] = value;
        }
    }

    setAttribute(name: string, value: any) {
        if (!this.path || this.path.length === 0) return;
        const controller: any = getControllerFromComponent(this.ele);
        if (!controller) return;
        this.applyPathSet(controller, value);
    }

    getAttribute(name: string): string | null {
        return null;
    }

    removeAttribute(name: string): void { }
}
