import type { GController } from '../component.types.js';
export declare abstract class GTplComponentBase implements GController {
    static readonly __gcomponent__?: GController['__gcomponent__'];
    readonly $el?: GController['$el'];
    readonly destroy?: GController['destroy'];
    onConstruct?(): void;
    onInit?(): void;
    onTemplateReady?(): void;
    onConnect?(): void;
    onDisconnect?(): void;
    onDestroy?(): void;
}
