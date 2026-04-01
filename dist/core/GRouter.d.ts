export interface GMatch {
    id: string;
    url: string;
    fullPath: string;
    params: Record<string, string>;
    query?: Record<string, string>;
    classRef?: any;
    default?: boolean;
    redirect?: string;
    gurl?: GURL;
}
export interface GURL {
    id: string;
    url: string;
    regex?: Record<string, string>;
    params?: Record<string, string | null>;
    optional?: string[];
    childs?: GURL[];
    parent?: GURL | null;
    default?: boolean;
    classRef?: any;
    middleware?: Middleware | Middleware[];
    redirect?: string;
    wildcard?: boolean;
    regexurl?: RegExp;
    paramKeys?: string[];
}
export type MiddlewareResult = boolean | {
    ok: boolean;
    redirect?: string;
};
export type Middleware = (match: GMatch) => MiddlewareResult | Promise<MiddlewareResult>;
export interface RouterOptions {
    mode?: "hash" | "history";
    base?: string;
    debug?: boolean;
    anchorLeafRoutes?: boolean;
    strictErrors?: boolean;
}
export declare class GRouter {
    private urls;
    private ids;
    private defaultRoute?;
    private historyCache;
    private active;
    private suppressNextHashChange;
    private cb?;
    private options;
    private hashchangebind?;
    private popstatebind?;
    private transientData;
    beforeChange?: (prev: GMatch | null, next: GMatch) => boolean | Promise<boolean>;
    afterChange?: (prev: GMatch | null, current: GMatch) => void;
    constructor(urlconfig?: GURL[], opts?: RouterOptions);
    setOptions(opts: RouterOptions): void;
    private log;
    private normalizePath;
    private escapeRegexLiteral;
    private routeSpecificity;
    private compilePattern;
    loadIds(gurls: GURL[], parent?: GURL): void;
    prepareGURL(gurl: GURL): boolean;
    getGurlFromId(id: string): GURL | undefined;
    private extractParams;
    private runMiddlewareChain;
    private orderedRoutes;
    private resolvePath;
    checkUrl(url: string, routes?: GURL[], params?: Record<string, string>): Promise<GMatch | null>;
    private buildUrlFromRouteChain;
    private buildUrlFromTemplate;
    getUrlFromParams(id: string, params?: Record<string, any>): string | null;
    private parseQueryString;
    private buildQueryString;
    private currentPathFromLocation;
    private currentQueryFromLocation;
    private setLocation;
    navigate(idOrPath: string, params?: Record<string, any>, query?: Record<string, any>): void;
    navigateWithData(idOrPath: string, data: any, params?: Record<string, any>, query?: Record<string, any>): void;
    getDataForCurrent(): any;
    getDataForMatch(match: GMatch | null): any;
    clearData(path?: string): void;
    replace(idOrPath: string, params?: Record<string, any>, query?: Record<string, any>): void;
    back(): void;
    removeListener(): void;
    setListener(cb: (state: "new" | "history" | "notfound", current: GMatch | null, prev: GMatch | null) => void): void;
    start(callback: (state: "new" | "history" | "notfound", current: GMatch | null, prev: GMatch | null) => void): void;
    hashchange(event: HashChangeEvent & {
        newURL?: string;
        oldURL?: string;
    }): Promise<void>;
    private onLocationChange;
    cleanHist(gurl?: GURL): void;
    removeHist(gurldel: any): void;
    getParams(): Record<string, string>;
    addGurl(gurl: GURL, parentId?: string): void;
    destroy(): void;
    escapeRegExp(str: string): string;
    tryGetUrlFromParams(id: string, params?: Record<string, any>): string | null;
    getMatch(): GMatch | null;
    getAllRoutes(): GURL[];
    matchPath(pathOrUrl: string): Promise<GMatch | null>;
    getRouteChain(match?: GMatch): GURL[];
}
