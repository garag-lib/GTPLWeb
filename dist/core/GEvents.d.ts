export interface WildcardPayload<EvMap> {
    event: keyof EvMap;
    payload: EvMap[keyof EvMap];
    namespace: string;
}
export type EventHandler<T = any> = (payload: T) => void | Promise<void>;
export type WildcardHandler<Events extends Record<string, any>> = (payload: WildcardPayload<Events>) => void | Promise<void>;
export interface EventListener<T = any> {
    handler: EventHandler<T> | WildcardHandler<any>;
    once?: boolean;
    priority?: number;
}
export interface EventBusInterface<Events extends Record<string, any> = Record<string, any>> {
    on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>, options?: {
        priority?: number;
        namespace?: string;
    }): void;
    once<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>, options?: {
        priority?: number;
        namespace?: string;
    }): void;
    off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>, namespace?: string): void;
    emit<K extends keyof Events>(event: K, payload: Events[K], namespace?: string): Promise<void>;
    waitFor<K extends keyof Events>(event: K, timeoutMs?: number, namespace?: string): Promise<Events[K]>;
    removeAllListeners(namespace?: string): void;
    listenerCount(namespace?: string): number;
    listNamespaces(): string[];
}
export declare class GEvents<Events extends Record<string, any> = Record<string, any>> implements EventBusInterface<Events> {
    private namespaces;
    constructor();
    private getNamespace;
    private addListener;
    on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>, options?: {
        priority?: number;
        namespace?: string;
    }): EventHandler<Events[K]>;
    once<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>, options?: {
        priority?: number;
        namespace?: string;
    }): EventHandler<Events[K]>;
    subscribe<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>, options?: {
        priority?: number;
        namespace?: string;
    }): {
        off: () => void;
    };
    off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>, namespace?: string): void;
    offAll<K extends keyof Events>(event?: K, namespace?: string): void;
    emit<K extends keyof Events>(event: K, payload: Events[K], namespace?: string, options?: {
        sequential?: boolean;
    }): Promise<void>;
    waitFor<K extends keyof Events>(event: K, timeoutMs?: number, namespace?: string): Promise<Events[K]>;
    waitForComplete<K extends keyof Events>(event: K, timeoutMs?: number, namespace?: string): Promise<Events[K]>;
    removeAllListeners(namespace?: string): void;
    private count;
    listenerCount(namespace?: string): number;
    listNamespaces(): string[];
    hasListeners<K extends keyof Events>(event: K, namespace?: string): boolean;
    getListeners<K extends keyof Events>(event: K, namespace?: string): EventListener<Events[K]>[];
}
