/**
 * Clase base para todas las directivas de GTpl.
 * Define constructor, ciclo de vida y utilidades comunes.
 */
export class GDirectiveBase {

    /** Elemento DOM al que está ligada la directiva */
    protected ele: HTMLElement;

    /** Expresión o valor literal asociado a la directiva */
    protected value: string;

    /** Contexto raíz del componente o plantilla */
    protected root: any;

    /** Argumento añadido a la directiva */
    protected argument?: string;

    constructor(ele: HTMLElement, value: string, root: any, arg?: string) {
        this.ele = ele;
        this.value = value;
        this.root = root.Root;
        this.argument = arg;
        (this as any).onInit?.();
    }

    /**
     * Hook llamado automáticamente al crear la directiva.
     */
    onInit?(): void;

}
