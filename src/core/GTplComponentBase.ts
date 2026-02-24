// GWebcBase.ts
import type { GController, HostElement } from '../component.types.js';

export abstract class GTplComponentBase implements GController {
    declare static readonly __gcomponent__?: GController['__gcomponent__'];
    declare readonly $el?: GController['$el'];
    declare readonly destroy?: GController['destroy'];
    onConstruct?(): void { }
    onInit?(): void { }
    onTemplateReady?(): void { }
    onConnect?(): void { }
    onDisconnect?(): void { }
    onDestroy?(): void { }
}
