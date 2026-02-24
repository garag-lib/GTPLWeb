/**
 * GEvents — Event Bus tipado, con namespaces y soporte para async/await.
 * 
 * ✅ Características principales:
 * - Tipado fuerte opcional con genéricos.
 * - Namespaces (agrupación por canal: "core", "ui", "pluginX").
 * - Soporta handlers asíncronos y prioridades.
 * - API tipo EventEmitter (`on`, `once`, `off`, `emit`, `waitFor`, etc.).
 * - Limpieza y monitoreo (`removeAllListeners`, `listenerCount`, `listNamespaces`).
 * 
 * 💡 Ideal para frameworks, SDKs, sistemas modulares y arquitecturas plugin-based.
 */

export interface WildcardPayload<EvMap> {
  event: keyof EvMap;
  payload: EvMap[keyof EvMap];
  namespace: string;
}

export type EventHandler<T = any> = (payload: T) => void | Promise<void>;

export type WildcardHandler<Events extends Record<string, any>> = (
  payload: WildcardPayload<Events>
) => void | Promise<void>;

export interface EventListener<T = any> {
  handler: EventHandler<T> | WildcardHandler<any>;
  once?: boolean;
  priority?: number;
}

export interface EventBusInterface<Events extends Record<string, any> = Record<string, any>> {

  /**
   * Suscribe un listener a un evento.
   * @param event Nombre del evento.
   * @param handler Función que se ejecutará cuando se emita el evento.
   * @param options priority: número para controlar el orden, namespace: canal opcional.
   */
  on<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>,
    options?: { priority?: number; namespace?: string }
  ): void;

  /**
   * Suscribe un listener que se ejecutará una sola vez.
   */
  once<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>,
    options?: { priority?: number; namespace?: string }
  ): void;

  /**
   * Elimina un listener específico.
   */
  off<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>,
    namespace?: string
  ): void;

  /**
   * Emite un evento (ejecuta todos los listeners).
   * Retorna una promesa si alguno de los handlers es async.
   */
  emit<K extends keyof Events>(
    event: K,
    payload: Events[K],
    namespace?: string
  ): Promise<void>;

  /**
   * Espera un evento como una promesa (útil con async/await).
   * Opcionalmente puede fallar con timeout.
   */
  waitFor<K extends keyof Events>(
    event: K,
    timeoutMs?: number,
    namespace?: string
  ): Promise<Events[K]>;

  /**
   * Elimina todos los listeners de un namespace o de todos.
   */
  removeAllListeners(namespace?: string): void;

  /**
   * Devuelve la cantidad de listeners activos.
   * Puede filtrar por namespace.
   */
  listenerCount(namespace?: string): number;

  /**
   * Lista los namespaces activos.
   */
  listNamespaces(): string[];
}

/**
 * GEvents — implementación base del bus de eventos con namespaces.
 */
export class GEvents<Events extends Record<string, any> = Record<string, any>>
  implements EventBusInterface<Events> {

  private namespaces: Map<string, Map<keyof Events, EventListener<any>[]>> = new Map();

  constructor() {
  }

  private getNamespace(ns = "default"): Map<keyof Events, EventListener<any>[]> {
    if (!this.namespaces.has(ns)) {
      this.namespaces.set(ns, new Map());
    }
    return this.namespaces.get(ns)!;
  }

  /**
   * Registra un listener (interno). Usado por on() y once().
   */
  private addListener<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>,
    options: { priority?: number; namespace?: string; once?: boolean } = {}
  ): EventHandler<Events[K]> {
    // Wildcard global (sin namespace)
    if (event === "*" && !options.namespace) {
      const global = this.getNamespace("__GLOBAL__");
      const listeners = global.get(event) || [];
      listeners.push({ handler, once: options.once, priority: options.priority ?? 0 });
      listeners.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
      global.set(event, listeners);
      return handler;
    }

    // Namespace específico o default
    const ns = this.getNamespace(options.namespace);
    const listeners = ns.get(event) || [];
    listeners.push({ handler, once: options.once, priority: options.priority ?? 0 });
    listeners.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    ns.set(event, listeners);
    return handler;
  }

  /**
   * Suscribe un listener a un evento.
   */
  on<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>,
    options: { priority?: number; namespace?: string } = {}
  ): EventHandler<Events[K]> {
    return this.addListener(event, handler, options);
  }

  /**
   * Suscribe un listener que se ejecutará una sola vez.
   */
  once<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>,
    options: { priority?: number; namespace?: string } = {}
  ): EventHandler<Events[K]> {
    return this.addListener(event, handler, { ...options, once: true });
  }

  /**
   * Suscribe un listener y devuelve un objeto con `.off()` para cancelarlo fácilmente.
   * 
   * @example
   * const sub = bus.subscribe("update", data => console.log(data));
   * sub.off(); // 👈 elimina el listener
   */
  subscribe<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>,
    options?: { priority?: number; namespace?: string }
  ): { off: () => void } {
    this.on(event, handler, options);
    return {
      off: () => this.off(event, handler, options?.namespace)
    };
  }

  off<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>,
    namespace = "default"
  ): void {
    const ns = this.getNamespace(namespace);
    const handlers = ns.get(event);
    if (!handlers) return;
    ns.set(event, handlers.filter(l => l.handler !== handler));
  }

  offAll<K extends keyof Events>(event?: K, namespace = "default"): void {
    if (event) {
      this.getNamespace(namespace).delete(event);
    } else {
      this.removeAllListeners(namespace);
    }
  }

  /**
   * Emite un evento (ejecuta todos los listeners).
   * 
   * @param event Nombre del evento.
   * @param payload Datos asociados al evento.
   * @param namespace Namespace opcional (por defecto "default").
   * @param options 
   *    - sequential: fuerza la ejecución en orden (por defecto es paralelo).
   */
  async emit<K extends keyof Events>(
    event: K,
    payload: Events[K],
    namespace = "default",
    options?: { sequential?: boolean }
  ): Promise<void> {
    const ns = this.getNamespace(namespace);
    const handlers = ns.get(event);
    const wildcardLocal = ns.get("*" as keyof Events); // wildcard solo de este namespace

    // --- NEW: buscar listeners "*" globales (sin namespace) ---
    const globalWildcardListeners =
      this.namespaces.get("__GLOBAL__")?.get("*" as keyof Events) ?? [];

    // Combinar listeners: específicos + wildcard local + wildcard global
    const allHandlers: EventListener<any>[] = [
      ...(handlers ?? []),
      ...(wildcardLocal ?? []),
      ...(globalWildcardListeners ?? []),
    ];

    if (allHandlers.length === 0) return;

    const runHandler = async (listener: EventListener<Events[K]>, isWildcard = false) => {
      try {
        if (isWildcard) {
          const handler = listener.handler as WildcardHandler<Events>;
          await handler({ event, payload, namespace });
        } else {
          const handler = listener.handler as EventHandler<Events[K]>;
          await handler(payload);
        }

      } catch (err) {
        console.error(`[GEvents] Error en handler "${String(event)}" (${namespace}):`, err);
      }
      if (listener.once) {
        const targetNs = (event === "*" && !namespace) ? "__GLOBAL__" : namespace;
        this.off(event, listener.handler, targetNs);
      }
    };

    // Ejecutar
    const execute = async (listener: EventListener<Events[K]>) => {
      const isWildcard =
        (wildcardLocal?.includes(listener) ?? false) ||
        (globalWildcardListeners?.includes(listener) ?? false);
      await runHandler(listener, isWildcard);
    };

    if (!options?.sequential) {
      await Promise.all(allHandlers.map(execute));
    } else {
      for (const l of allHandlers) await execute(l);
    }
  }

  waitFor<K extends keyof Events>(
    event: K,
    timeoutMs?: number,
    namespace = "default"
  ): Promise<Events[K]> {
    return new Promise((resolve, reject) => {
      const handler: EventHandler<Events[K]> = (payload) => {
        clearTimeout(timer);
        this.off(event, handler, namespace);
        resolve(payload);
      };
      let timer: any;
      if (timeoutMs) {
        timer = setTimeout(() => {
          this.off(event, handler, namespace);
          reject(new Error(`Timeout esperando evento "${String(event)}" (${namespace})`));
        }, timeoutMs);
      }
      this.on(event, handler, { namespace });
    });
  }

  /**
 * Espera a que un evento se emita y **todos los listeners terminen** (incluidos los async).
 * 
 * @param event Nombre del evento a esperar.
 * @param timeoutMs Tiempo máximo de espera (opcional).
 * @param namespace Namespace opcional (por defecto "default").
 * 
 * @returns Una promesa que se resuelve con el payload cuando todos los handlers hayan terminado.
 */
  waitForComplete<K extends keyof Events>(
    event: K,
    timeoutMs?: number,
    namespace = "default"
  ): Promise<Events[K]> {
    return new Promise((resolve, reject) => {
      let timer: any;

      const handler: EventHandler<Events[K]> = async (payload) => {
        clearTimeout(timer);

        // Esperar a que todos los listeners de este evento terminen
        const ns = this.getNamespace(namespace);
        const handlers = ns.get(event);
        if (handlers && handlers.length > 0) {
          try {
            // Ejecutamos los mismos handlers que el emit (respetando paralelismo)
            await Promise.all(
              handlers.map(async (listener) => {
                try {
                  await listener.handler(payload);
                } catch (err) {
                  console.error(`[GEvents] Error en waitForComplete("${String(event)}"):`, err);
                }
              })
            );
          } catch (err) {
            console.error(`[GEvents] Error ejecutando handlers en waitForComplete("${String(event)}")`, err);
          }
        }

        this.off(event, handler, namespace);
        resolve(payload);
      };

      if (timeoutMs) {
        timer = setTimeout(() => {
          this.off(event, handler, namespace);
          reject(new Error(`Timeout esperando evento completo "${String(event)}" (${namespace})`));
        }, timeoutMs);
      }

      this.on(event, handler, { namespace });
    });
  }


  removeAllListeners(namespace?: string): void {
    if (namespace) {
      this.namespaces.delete(namespace);
    } else {
      this.namespaces.clear();
    }
  }

  private count(ns: Map<keyof Events, EventListener<any>[]>): number {
    return [...ns.values()].reduce((acc, arr) => acc + (arr?.length ?? 0), 0);
  }

  listenerCount(namespace?: string): number {
    if (namespace) return this.count(this.namespaces.get(namespace) ?? new Map());
    let total = 0;
    for (const ns of this.namespaces.values()) total += this.count(ns);
    return total;
  }

  listNamespaces(): string[] {
    return [...this.namespaces.keys()];
  }

  hasListeners<K extends keyof Events>(event: K, namespace = "default"): boolean {
    const ns = this.namespaces.get(namespace);
    return !!ns?.get(event)?.length;
  }

  getListeners<K extends keyof Events>(event: K, namespace = "default"): EventListener<Events[K]>[] {
    return [...(this.namespaces.get(namespace)?.get(event) ?? [])];
  }


}
