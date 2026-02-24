import { GRouter, GURL, RouterOptions } from "../core/GRouter.js";
import { GBus } from "./GBus.js";

export class GRouterService {

    private static _router?: GRouter;

    static init(urls: GURL[], opts?: RouterOptions): GRouter {
        if (this._router)
            return this._router;
        this._router = new GRouter(urls, opts);
        this._router.start((state, current, prev) => GBus.emit("urlChanged", { state, current, prev }, "router"));
        return this._router;
    }

    static getRouter(): GRouter | undefined {
        return this._router;
    }
}
