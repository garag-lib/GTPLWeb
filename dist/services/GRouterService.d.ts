import { GRouter, GURL, RouterOptions } from "../core/GRouter.js";
export declare class GRouterService {
    private static _router?;
    static init(urls: GURL[], opts?: RouterOptions): GRouter;
    static getRouter(): GRouter | undefined;
}
