/**
 * ======================================================================
 *  ANIMATIONS — Utility Class (Vanilla JS, Ultra Extended)
 * ----------------------------------------------------------------------
 *  ✔ Sistema genérico para animar CUALQUIER propiedad CSS con transiciones
 *  ✔ Fiable gracias a doble requestAnimationFrame
 *  ✔ Animaciones básicas, avanzadas, dinámicas y paramétricas
 *  ✔ Todas retornan Promise<void> → permiten await/encadenamiento
 *  ✔ No requiere frameworks ni dependencias
 *
 * ----------------------------------------------------------------------
 *  EJEMPLOS DE USO
 * ----------------------------------------------------------------------
 *
 *  1) Fade In
 *      await Animations.fadeIn(el);
 *
 *  2) Slide desde la izquierda
 *      await Animations.slideInX(el, "-100%");
 *
 *  3) Slide vertical + Fade
 *      await Animations.slideFadeInY(el, "30px", 400);
 *
 *  4) Entrada diagonal
 *      await Animations.diagonalIn(el, "-50%", "50%", 350);
 *
 *  5) Zoom + Fade
 *      await Animations.zoomIn(el, "0.5", 400);
 *
 *  6) Animación elástica
 *      await Animations.elasticIn(el);
 *
 *  7) Bounce (rebote)
 *      await Animations.bounceIn(el);
 *
 *  8) Flip 3D
 *      await Animations.flipIn(el, "-90deg", 500);
 *
 *  9) Animación paramétrica de entrada
 *      await Animations.enter(el, {
 *          xFrom: "-40px",
 *          yFrom: "20px",
 *          scaleFrom: "0.8",
 *          rotateFrom: "-8deg",
 *          duration: 350
 *      });
 *
 * 10) Animación paramétrica de salida
 *      await Animations.leave(el, {
 *          yTo: "40px",
 *          opacityTo: "0",
 *          rotateTo: "8deg"
 *      });
 *
 * 11) Usar un "queue" (cola de animaciones encadenadas)
 *      await Animations.queue(el, [
 *          () => Animations.fadeIn(el),
 *          () => Animations.slideInY(el, "50px"),
 *          () => Animations.bounceIn(el)
 *      ]);
 *
 * 12) Animación personalizada manual
 *
 *      Animations.setInitial(el, {
 *          opacity: "0",
 *          transform: "translateY(40px) scale(0.9)"
 *      });
 *
 *      await Animations.animateTo(el, {
 *          opacity: "1",
 *          transform: "translateY(0) scale(1)"
 *      }, 350);
 *
 * ----------------------------------------------------------------------
 *  NOTAS
 * ----------------------------------------------------------------------
 *  ✔ Todos los métodos DEBEN usarse con await si esperas sincronización.
 *  ✔ No se depende de CSS externo.
 *  ✔ transitions + doble rAF permite animaciones fiables incluso en DOM recién montado.
 *
 * ======================================================================
 */
export class Animations {

    static enabled = true;

    static enable() {
        Animations.enabled = true;
    }

    static disable() {
        Animations.enabled = false;
    }

    /** Define el estado inicial sin transición */
    static setInitial(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
        if (!Animations.enabled) return;
        element.style.transition = "none";
        element.style.pointerEvents = "none";
        Object.assign(element.style, styles);
    }

    static resetStyles(el: HTMLElement) {
        el.style.removeProperty("opacity");
        el.style.removeProperty("transform");
        el.style.removeProperty("transition");
        el.style.removeProperty("pointer-events");
    }

    /**
     * Aplica el estado final con transición
     * CON doble requestAnimationFrame para máxima fiabilidad
     */
    static animateTo(
        element: HTMLElement,
        styles: Partial<CSSStyleDeclaration>,
        duration: number = 300,
        easing: string = "ease"
    ): Promise<void> {
        if (!Animations.enabled) {
            Object.assign(element.style, styles);
            return Promise.resolve();
        }
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    element.style.transition = `all ${duration}ms ${easing}`;
                    Object.assign(element.style, styles);
                    const onEnd = (ev: Event) => {
                        if (ev.target !== element) return;
                        element.removeEventListener("transitionend", onEnd);
                        element.style.pointerEvents = "auto";
                        resolve();
                    };
                    element.addEventListener("transitionend", onEnd);
                });
            });
        });
    }

    /** Sleep util */
    static wait(ms: number) {
        return new Promise(res => setTimeout(res, ms));
    }

    /** Detiene una transición en curso */
    static stopTransition(el: HTMLElement) {
        const computed = getComputedStyle(el);
        el.style.transition = "none";
        el.style.transform = computed.transform;
        el.style.opacity = computed.opacity;
    }

    // =====================================================================
    // TRANSICIONES BÁSICAS
    // =====================================================================

    static fadeIn(el: HTMLElement, duration = 300) {
        this.setInitial(el, { opacity: "0" });
        return this.animateTo(el, { opacity: "1" }, duration);
    }

    static fadeOut(el: HTMLElement, duration = 300) {
        this.setInitial(el, { opacity: "1" });
        return this.animateTo(el, { opacity: "0" }, duration);
    }

    static slideInX(el: HTMLElement, from = "-100%", duration = 300) {
        this.setInitial(el, { transform: `translateX(${from})` });
        return this.animateTo(el, { transform: "translateX(0)" }, duration);
    }

    static slideOutX(el: HTMLElement, to = "-100%", duration = 300) {
        this.setInitial(el, { transform: "translateX(0)" });
        return this.animateTo(el, { transform: `translateX(${to})` }, duration);
    }

    static slideInY(el: HTMLElement, from = "100%", duration = 300) {
        this.setInitial(el, { transform: `translateY(${from})` });
        return this.animateTo(el, { transform: "translateY(0)" }, duration);
    }

    static slideOutY(el: HTMLElement, to = "100%", duration = 300) {
        this.setInitial(el, { transform: "translateY(0)" });
        return this.animateTo(el, { transform: `translateY(${to})` }, duration);
    }

    static scaleIn(el: HTMLElement, from = "0.6", duration = 300) {
        this.setInitial(el, { transform: `scale(${from})`, opacity: "0" });
        return this.animateTo(el, { transform: "scale(1)", opacity: "1" }, duration);
    }

    static scaleOut(el: HTMLElement, to = "0.6", duration = 300) {
        this.setInitial(el, { transform: "scale(1)", opacity: "1" });
        return this.animateTo(el, { transform: `scale(${to})`, opacity: "0" }, duration);
    }

    static rotateIn(el: HTMLElement, from = "-20deg", duration = 300) {
        this.setInitial(el, { transform: `rotate(${from})`, opacity: "0" });
        return this.animateTo(el, { transform: "rotate(0)", opacity: "1" }, duration);
    }

    static rotateOut(el: HTMLElement, to = "20deg", duration = 300) {
        this.setInitial(el, { transform: "rotate(0)", opacity: "1" });
        return this.animateTo(el, { transform: `rotate(${to})`, opacity: "0" }, duration);
    }

    // =====================================================================
    // AVANZADAS / COMBINADAS
    // =====================================================================

    static slideFadeInY(el: HTMLElement, from = "20px", duration = 300) {
        this.setInitial(el, { transform: `translateY(${from})`, opacity: "0" });
        return this.animateTo(el, { transform: "translateY(0)", opacity: "1" }, duration);
    }

    static slideFadeInX(el: HTMLElement, from = "-20px", duration = 300) {
        this.setInitial(el, { transform: `translateX(${from})`, opacity: "0" });
        return this.animateTo(el, { transform: "translateX(0)", opacity: "1" }, duration);
    }

    static diagonalIn(el: HTMLElement, dx = "-50%", dy = "50%", duration = 300) {
        this.setInitial(el, { transform: `translate(${dx}, ${dy})`, opacity: "0" });
        return this.animateTo(el, { transform: "translate(0, 0)", opacity: "1" }, duration);
    }

    static diagonalOut(el: HTMLElement, dx = "50%", dy = "-50%", duration = 300) {
        this.setInitial(el, { transform: "translate(0, 0)", opacity: "1" });
        return this.animateTo(el, { transform: `translate(${dx}, ${dy})`, opacity: "0" }, duration);
    }

    static zoomIn(el: HTMLElement, from = "0.4", duration = 350) {
        this.setInitial(el, { transform: `scale(${from})`, opacity: "0" });
        return this.animateTo(el, { transform: "scale(1)", opacity: "1" }, duration);
    }

    static zoomOut(el: HTMLElement, to = "0.4", duration = 350) {
        this.setInitial(el, { transform: "scale(1)", opacity: "1" });
        return this.animateTo(el, { transform: `scale(${to})`, opacity: "0" }, duration);
    }

    static flipIn(el: HTMLElement, from = "-90deg", duration = 400) {
        this.setInitial(el, {
            transform: `rotateY(${from})`,
            opacity: "0",
            transformStyle: "preserve-3d",
        });
        return this.animateTo(el, {
            transform: "rotateY(0deg)",
            opacity: "1",
        }, duration);
    }

    static flipOut(el: HTMLElement, to = "90deg", duration = 400) {
        this.setInitial(el, { transform: "rotateY(0deg)", opacity: "1" });
        return this.animateTo(el, { transform: `rotateY(${to})`, opacity: "0" }, duration);
    }

    // =====================================================================
    // EFECTOS DINÁMICOS (bounce, elastic)
    // =====================================================================

    static async bounceIn(el: HTMLElement, duration = 400) {
        this.setInitial(el, { transform: "scale(0.5)", opacity: "0" });
        await this.animateTo(el, { transform: "scale(1.1)", opacity: "1" }, duration * 0.5, "ease-out");
        return this.animateTo(el, { transform: "scale(1)" }, duration * 0.5, "ease-in-out");
    }

    static async elasticIn(el: HTMLElement, duration = 500) {
        this.setInitial(el, { transform: "scale(0.3)", opacity: "0" });

        await this.animateTo(el, { transform: "scale(1.2)", opacity: "1" }, duration * 0.4, "ease-out");
        return this.animateTo(el, { transform: "scale(1)" }, duration * 0.6, "ease-in-out");
    }

    // =====================================================================
    // SISTEMA PARAMÉTRICO
    // =====================================================================

    static slide(
        el: HTMLElement,
        axis: "x" | "y",
        distance: string,
        duration = 300,
        easing = "ease"
    ) {
        const prop = axis === "x" ? "translateX" : "translateY";
        this.setInitial(el, { transform: `${prop}(${distance})` });
        return this.animateTo(el, { transform: `${prop}(0)` }, duration, easing);
    }

    static enter(el: HTMLElement, opts: {
        opacityFrom?: string,
        xFrom?: string,
        yFrom?: string,
        scaleFrom?: string,
        rotateFrom?: string,
        duration?: number,
        easing?: string,
    } = {}) {

        const {
            opacityFrom = "0",
            xFrom = "0",
            yFrom = "20px",
            scaleFrom = "1",
            rotateFrom = "0deg",
            duration = 300,
            easing = "ease"
        } = opts;

        this.setInitial(el, {
            opacity: opacityFrom,
            transform: `translate(${xFrom}, ${yFrom}) scale(${scaleFrom}) rotate(${rotateFrom})`
        });

        return this.animateTo(el, {
            opacity: "1",
            transform: "translate(0,0) scale(1) rotate(0deg)"
        }, duration, easing);
    }

    static leave(el: HTMLElement, opts: {
        opacityTo?: string,
        xTo?: string,
        yTo?: string,
        scaleTo?: string,
        rotateTo?: string,
        duration?: number,
        easing?: string,
    } = {}) {

        const {
            opacityTo = "0",
            xTo = "0",
            yTo = "20px",
            scaleTo = "1",
            rotateTo = "0deg",
            duration = 300,
            easing = "ease"
        } = opts;

        this.setInitial(el, {
            opacity: "1",
            transform: "translate(0,0) scale(1) rotate(0deg)"
        });

        return this.animateTo(el, {
            opacity: opacityTo,
            transform: `translate(${xTo}, ${yTo}) scale(${scaleTo}) rotate(${rotateTo})`
        }, duration, easing);
    }

    // =====================================================================
    // ANIMATION QUEUE (encadenar animaciones)
    // =====================================================================

    static async queue(el: HTMLElement, animations: (() => Promise<void>)[]) {
        for (const anim of animations) {
            await anim();
        }
    }
}

