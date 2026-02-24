/* =======================
   Tipos y contratos (compat + mejoras opcionales)
   ======================= */

export interface GMatch {
  id: string;
  url: string;                        // patrón local de la ruta (no incluye padres)
  fullPath: string;                   // path completo resuelto (sin query)
  params: Record<string, string>;
  query?: Record<string, string>;
  classRef?: any;
  default?: boolean;
  redirect?: string;
  gurl?: GURL
}

export interface GURL {
  id: string;
  url: string;                        // e.g. "/login/", "/impinjs/:?mac", "*"
  regex?: Record<string, string>;     // por clave de parámetro -> fragmento regex (SIN ^$)
  params?: Record<string, string | null>;  // se rellenará con prepareGURL
  optional?: string[];                // parámetros opcionales (detectados por :?param)
  childs?: GURL[];
  parent?: GURL | null;
  default?: boolean;
  classRef?: any;
  middleware?: Middleware | Middleware[];
  redirect?: string;
  wildcard?: boolean;
  regexurl?: RegExp;
  paramKeys?: string[];               // orden de extracción
}

/** Resultado de middleware: mantiene compatibilidad con boolean. */
export type MiddlewareResult = boolean | { ok: boolean; redirect?: string };
export type Middleware = (match: GMatch) => MiddlewareResult | Promise<MiddlewareResult>;

export interface RouterOptions {
  mode?: "hash" | "history";          // default 'hash'
  base?: string;                      // basepath para modo history, e.g. "/app"
  debug?: boolean;                    // logs en consola
  anchorLeafRoutes?: boolean;         // anclar al final ($) rutas hoja (default: true)
  strictErrors?: boolean;             // lanzar error en ciertos casos (default: true como tu comportamiento actual)
}

/*  
========================================================
 🧭 GRouter — Router jerárquico para SPA
========================================================

GRouter es un enrutador ligero y extensible para aplicaciones SPA.
Permite definir rutas anidadas, parámetros dinámicos, wildcards,
redirecciones y middlewares en cadena, todo con soporte de navegación
tanto en modo HASH como en modo HISTORY.

Incluye además un motor de coincidencia avanzado, construcción de URLs,
caché histórico de rutas visitadas, resolución de rutas sin navegar
(matchPath) y herramientas auxiliares para depuración.

--------------------------------------------------------
 📌 Características principales
--------------------------------------------------------

✔ Rutas jerárquicas (padres → hijos)  
✔ Parámetros obligatorios y opcionales (:id, :?extra)  
✔ Wildcards con captura (*rest)  
✔ Middlewares encadenados (padre → hijo)  
✔ Redirecciones por ruta o desde middleware  
✔ Cache inteligente de GMatch ya navegados  
✔ Obtención del GMatch activo (getMatch)  
✔ Resolver rutas sin navegar (matchPath)  
✔ Construcción de URLs desde parámetros  
✔ Datos transitorios asociados a navegación (navigateWithData)  

--------------------------------------------------------
 📘 Definición de rutas (GURL)
--------------------------------------------------------

Cada ruta se define como un objeto:

{
  id: "user",
  url: "/users/:id",
  childs: [
    { id: "settings", url: "/settings" }
  ],
  default?: boolean,
  middleware?: Middleware | Middleware[],
  redirect?: string,
  wildcard?: boolean
}

--------------------------------------------------------
 📘 Resultado de una coincidencia (GMatch)
--------------------------------------------------------

GMatch es lo que obtiene el router al resolver una ruta:

{
  id: string,
  url: string,
  fullPath: string,
  params: Record<string,string>,
  query?: Record<string,string>,
  redirect?: string,
  gurl?: GURL
}

--------------------------------------------------------
 🚀 Ejemplo básico de configuración
--------------------------------------------------------

const router = new GRouter([
  { id: "home", url: "/", default: true },
  {
    id: "user",
    url: "/users/:id",
    childs: [
      { id: "settings", url: "/settings" }
    ]
  }
], {
  mode: "history",
  base: "/app",
  debug: true
});

--------------------------------------------------------
 🟢 Iniciar el router y escuchar eventos
--------------------------------------------------------

router.start((state, current, prev) => {
  console.log("Estado:", state);       // "new" | "history" | "notfound"
  console.log("Actual:", current);     // GMatch | null
  console.log("Anterior:", prev);      // GMatch | null
});

--------------------------------------------------------
 🔀 Navegación programática
--------------------------------------------------------

router.navigate("home");
router.navigate("user", { id: 42 });
router.navigate("/users/42/settings");

router.replace("home");        // igual que navigate pero sin pushState
router.back();                 // window.history.back()

--------------------------------------------------------
 📎 Obtener estado de la ruta activa
--------------------------------------------------------

router.getMatch();      // GMatch | null
router.getParams();     // { id: "...", ... }
router.getRouteChain(); // [GURL padre, GURL hijo, ...]

--------------------------------------------------------
 🔍 Resolver una ruta SIN navegar (matchPath)
--------------------------------------------------------

const m = await router.matchPath("/users/123/settings");
console.log(m?.params.id); // "123"

matchPath:
✔ usa middlewares  
✔ respeta redirecciones  
✔ consulta la caché si existe  
✔ NO modifica active  
✔ NO dispara eventos  

--------------------------------------------------------
 📦 Datos transitorios asociados a rutas
--------------------------------------------------------

router.navigateWithData("user", { info: "temp" }, { id: 10 });

router.getDataForCurrent();  // → { info: "temp" }

Los datos se limpian automáticamente al cambiar de ruta
o pueden eliminarse manualmente con clearData().

--------------------------------------------------------
 🛠 Funciones auxiliares
--------------------------------------------------------

getAllRoutes() → lista completa de rutas registradas  
tryGetUrlFromParams() → igual que getUrlFromParams pero no lanza errores  
addGurl() → añadir nuevas rutas en caliente  
cleanHist() → limpiar caché de historial  

========================================================
 Fin de la documentación de GRouter
========================================================
*/
export class GRouter {

  private urls: GURL[] = [];
  private ids: Map<string, GURL> = new Map();
  private defaultRoute?: GURL;
  private historyCache: Map<string, GMatch> = new Map();
  private active: GMatch | null = null;

  private suppressNextHashChange = false;

  private cb?: (state: "new" | "history" | "notfound", current: GMatch | null, prev: GMatch | null) => void;

  private options: Required<Omit<RouterOptions, "base">> & { base: string } = {
    mode: "hash",
    base: "",
    debug: false,
    anchorLeafRoutes: true,
    strictErrors: true,
  };

  // listeners/binds
  private hashchangebind?: (e: HashChangeEvent) => void;
  private popstatebind?: (e: PopStateEvent) => void;

  private transientData = new Map<string, any>();

  public beforeChange?: (prev: GMatch | null, next: GMatch) => boolean | Promise<boolean>;
  public afterChange?: (prev: GMatch | null, current: GMatch) => void;

  constructor(urlconfig?: GURL[], opts?: RouterOptions) {
    if (urlconfig) this.urls = urlconfig;
    if (opts) this.setOptions(opts);
    this.loadIds(this.urls);
  }

  /** Permite actualizar opciones (ej. para pasar a history). Llama antes de loadEvents/start */
  setOptions(opts: RouterOptions) {
    this.options = { ...this.options, ...opts, base: this.options.base };
    // Normaliza base
    if (opts?.base != null) {
      this.options.base = this.normalizePath("/" + (opts.base || "") + "/");
    }
  }

  /* =======================
     Construcción de índices
     ======================= */

  private log(...args: any[]) {
    if (this.options.debug) {
      // eslint-disable-next-line no-console
      console.debug("[GRouter]", ...args);
    }
  }

  private normalizePath(input: string): string {
    if (!input) return "/";
    let s = input.replace(/\\/g, "/");
    if (!s.startsWith("/")) s = "/" + s;
    // colapsar múltiples barras
    s = s.replace(/\/{2,}/g, "/");
    // permitir "/" solo como raíz; si tiene más de 1 char, quitar barra final
    if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
    return s || "/";
  }

  private escapeRegexLiteral(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /** Calcula una "especificidad" simple: más literal y más largo = más específico */
  private routeSpecificity(url: string): number {
    // penaliza parámetros y premia literales
    // cuenta caracteres que NO pertenecen a tokens :param / :?param
    const literals = url.replace(/:\??[A-Za-z0-9_]+/g, "");
    return literals.length;
  }

  /** Compila el patrón de ruta a RegExp y detecta claves y opcionales */
  private compilePattern(route: GURL) {

    if (route.regexurl && route.paramKeys && route.optional) return; // ya compilado

    // Detectar comodín explícito
    const isWildcard = route.wildcard === true || route.url.trim() === "*" || route.url.trim() === "/*";

    // wildcard con nombre: ej. "/*rest"
    if (!route.wildcard && route.url.includes("*")) {
      const m = route.url.match(/\*([A-Za-z0-9_]+)/);
      if (m) {
        const key = m[1];
        route.paramKeys = [key];
        route.optional = [];
        route.regexurl = new RegExp("^" + this.escapeRegexLiteral(route.url.split("*")[0]) + "(.*)$");
        if (!route.params) route.params = {};
        route.params[key] = null;
        return;
      }
    }

    const rawPattern = this.normalizePath(isWildcard ? "/*" : (route.url || "/"));
    const pattern = rawPattern;

    const reToken = /:\??([A-Za-z0-9_]+)/g;

    const paramKeys: string[] = [];
    const optional = new Set<string>();

    let cursor = 0;
    let built = "";

    if (isWildcard) {
      // Comodín: captura todo lo restante
      built = ".*";
    } else {
      let m: RegExpExecArray | null;
      while ((m = reToken.exec(pattern))) {
        const start = m.index;
        const raw = m[0]; // ":param" o ":?param"
        const name = m[1];
        const isOptional = raw[1] === "?";

        built += this.escapeRegexLiteral(pattern.slice(cursor, start));
        paramKeys.push(name);
        if (isOptional) optional.add(name);

        let frag = route.regex?.[name] ?? "([^/]+)";
        // si es opcional y el fragmento no tiene ?, lo hacemos opcional
        if (isOptional && !/\?\)$/.test(frag)) {
          // envolver en grupo no capturante si no lo está
          if (!/^\(.*\)$/.test(frag)) {
            frag = `(${frag})`;
          }
          frag = `${frag}?`;
        }
        built += frag;
        cursor = start + raw.length;
      }
      built += this.escapeRegexLiteral(pattern.slice(cursor));
    }

    // Anclaje condicional al final: si la ruta es hoja y la opción está activa
    // (para evitar sobre-matching en hojas).
    const hasChildren = Array.isArray(route.childs) && route.childs.length > 0;
    const shouldAnchorLeaf = this.options.anchorLeafRoutes && !hasChildren && !isWildcard;
    const final = "^" + built + (shouldAnchorLeaf ? "$" : "");

    route.regexurl = new RegExp(final);
    route.paramKeys = paramKeys;
    route.optional = Array.from(optional);

    // Inicializa mapa params (con nulls) para compatibilidad
    if (!route.params) route.params = {};
    for (const k of paramKeys) {
      if (!(k in route.params)) route.params[k] = null;
    }
    // Guarda el url normalizado
    route.url = pattern;
  }

  /** Registra rutas, compila regex y crea el índice de ids */
  loadIds(gurls: GURL[], parent?: GURL) {
    for (const r of gurls) {
      if (this.ids.has(r.id)) throw Error(`${r.id} exits`);

      r.parent = parent ?? null;
      this.compilePattern(r);

      if (r.default) this.defaultRoute = r;

      this.ids.set(r.id, r);
      this.log("route loaded:", r.id, r.url);

      if (Array.isArray(r.childs) && r.childs.length) {
        this.loadIds(r.childs, r);
      }
    }
  }

  /** Compatibilidad con tu API */
  prepareGURL(gurl: GURL): boolean {
    this.compilePattern(gurl);
    return !!gurl.regexurl;
  }

  getGurlFromId(id: string): GURL | undefined {
    return this.ids.get(id);
  }

  /* =======================
         Matching / middlewares
     ======================= */

  private extractParams(route: GURL, matchArray: RegExpMatchArray): Record<string, string> {
    const out: Record<string, string> = {};
    if (!route.paramKeys || !route.paramKeys.length) return out;
    let idx = 1;
    for (const key of route.paramKeys) {
      const val = matchArray[idx++];
      if (val != null) out[key] = val;
    }
    return out;
  }

  private async runMiddlewareChain(finalRoute: GURL, match: GMatch): Promise<{ ok: boolean; redirect?: string }> {
    // recorrer padres → hijo
    const chain: Middleware[] = [];
    const collect = (mw?: Middleware | Middleware[]) => {
      if (!mw) return;
      if (Array.isArray(mw)) chain.push(...mw);
      else chain.push(mw);
    };

    const stack: GURL[] = [];
    let cur: GURL | null | undefined = finalRoute;
    while (cur) {
      stack.unshift(cur);
      cur = cur.parent;
    }
    for (const r of stack) collect(r.middleware);

    for (const mw of chain) {
      const res = await mw(match);
      // Compatibilidad con boolean, pero permitimos objeto extendido
      if (res === false) return { ok: false };
      if (res && typeof res === "object" && "ok" in res) {
        if (!res.ok) return { ok: false, redirect: (res as any).redirect };
      }
    }
    return { ok: true };
  }

  /** Itera rutas en orden de mayor especificidad para evitar colisiones */
  private orderedRoutes(routes: GURL[]): GURL[] {
    return [...routes].sort((a, b) => this.routeSpecificity(b.url) - this.routeSpecificity(a.url));
  }

  /** Resuelve un path (sin query), recursivo sobre childs */
  private async resolvePath(path: string, routes: GURL[], seedParams?: Record<string, string>): Promise<GMatch | null> {
    // Filtrar comodines para probarlos al final (por seguridad)
    const normalRoutes = routes.filter(r => !r.wildcard && r.url !== "*" && r.url !== "/*");
    const wildcardRoutes = routes.filter(r => r.wildcard || r.url === "*" || r.url === "/*");
    const candidates = [...this.orderedRoutes(normalRoutes), ...wildcardRoutes];

    for (const r of candidates) {
      this.compilePattern(r);
      const m = path.match(r.regexurl as RegExp);
      if (!m) continue;

      // extrae params de este tramo
      const localParams = this.extractParams(r, m);
      const params = { ...(seedParams ?? {}), ...localParams };

      // consume el tramo que matcheó
      let rest = path.replace(r.regexurl as RegExp, "");
      rest = this.normalizePath(rest);

      if (rest === "/") {
        // match final
        const fullPath = this.buildUrlFromRouteChain(r, params);

        // 🧠 Aquí está la mejora importante:
        // combinamos todas las propiedades originales de la ruta con el GMatch estándar
        const found: GMatch = {
          id: r.id,
          url: r.url,
          fullPath,
          params,
          classRef: r.classRef,
          default: !!r.default,
          redirect: r.redirect,
          gurl: r
        };

        // middlewares en cadena (padres → hijo)
        const mw = await this.runMiddlewareChain(r, found);
        if (!mw.ok) {
          if (found.redirect || mw.redirect) {
            return { ...found, redirect: mw.redirect || found.redirect };
          }
          return null;
        }
        return found;
      }

      // probar hijos si existen
      if (r.childs && r.childs.length) {
        const childMatch = await this.resolvePath(rest, r.childs, params);
        if (childMatch) return childMatch;
      }
    }

    return null;
  }

  /** Compatibilidad con tu API: checkUrl(url, urls?, params?) */
  async checkUrl(url: string, routes?: GURL[], params?: Record<string, string>) {
    const norm = this.normalizePath(url);
    const baseRoutes = routes ?? this.urls;
    const match = await this.resolvePath(norm, baseRoutes, params);
    return match;
  }

  /* =======================
           URL building
     ======================= */

  private buildUrlFromRouteChain(route: GURL, params?: Record<string, any>): string {
    const chain: GURL[] = [];
    let cur: GURL | null | undefined = route;
    while (cur) {
      chain.unshift(cur);
      cur = cur.parent;
    }
    // unir piezas con un solo slash
    const template = chain
      .map(r => r.url)
      .map(u => u.startsWith("/") ? u : "/" + u)
      .join("");
    return this.buildUrlFromTemplate(template, params);
  }

  private buildUrlFromTemplate(templateUrl: string, params?: Record<string, any>): string {
    // Reemplaza :param y :?param, dejando opcionales vacíos si no hay valor.
    let url = templateUrl;

    url = url.replace(/:\??([A-Za-z0-9_]+)/g, (_m, key: string, offset: number, full: string) => {
      const isOptional = full[offset + 1] === "?";
      const val = params?.[key];
      if (val == null || val === "") {
        return isOptional ? "" : `:${key}`; // si es obligatorio y no hay val, se deja tal cual
      }
      return String(val);
    });

    // colapsar dobles barras y normalizar + eliminar trailing slash salvo raíz
    url = url.replace(/\/{2,}/g, "/");
    url = this.normalizePath(url);
    return url;
  }

  /** Compatibilidad con tu API: getUrlFromParams(id, params?) */
  getUrlFromParams(id: string, params?: Record<string, any>): string | null {
    const r = this.ids.get(id);
    if (!r) return null;
    this.compilePattern(r);
    const url = this.buildUrlFromRouteChain(r, params);

    // si quedan :param sin valor, es porque faltan obligatorios → null para mantener semántica
    if (/:([A-Za-z0-9_]+)/.test(url)) return null;

    return url;
  }

  /* =======================
           Querystring
     ======================= */

  private parseQueryString(qs: string): Record<string, string> | null {
    if (!qs) return null;
    const sp = new URLSearchParams(qs);
    const out: Record<string, string> = {};
    sp.forEach((v, k) => (out[k] = v));
    return Object.keys(out).length ? out : null;
  }

  private buildQueryString(query?: Record<string, any>): string {
    if (!query) return "";
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v == null) continue;
      sp.append(k, String(v));
    }
    const s = sp.toString();
    return s ? `?${s}` : "";
  }

  /* =======================
         Navegación/Historia
     ======================= */

  private currentPathFromLocation(): string {
    if (this.options.mode === "hash") {
      const raw = window.location.hash || "";
      const part = raw.startsWith("#") ? raw.slice(1) : raw;
      const [p] = part.split("?");
      return this.normalizePath(p || "/");
    }
    // history
    const full = window.location.pathname;
    const base = this.options.base || "";
    let rel = full.startsWith(base) ? full.slice(base.length) : full;
    const [p] = rel.split("?");
    return this.normalizePath(p || "/");
  }

  private currentQueryFromLocation(): Record<string, string> | null {
    const raw = window.location.href;
    const qIndex = raw.indexOf("?");
    if (qIndex === -1) return null;
    return this.parseQueryString(raw.slice(qIndex + 1));
  }

  private setLocation(path: string, query?: Record<string, any>, replace = false) {
    const qs = this.buildQueryString(query);
    if (this.options.mode === "hash") {
      const target = "#" + this.normalizePath(path) + qs;
      if (replace) window.location.replace(target);
      else window.location.hash = target;
      return;
    }
    // history
    const target = (this.options.base || "") + this.normalizePath(path) + qs;
    if (replace) window.history.replaceState({}, "", target);
    else window.history.pushState({}, "", target);
    this.onLocationChange({ synthetic: true });
  }

  /** Navegación programática (compat) */
  navigate(idOrPath: string, params?: Record<string, any>, query?: Record<string, any>) {
    if (idOrPath.startsWith("/")) {
      this.setLocation(idOrPath, query, false);
      return;
    }
    const url = this.getUrlFromParams(idOrPath, params);
    if (!url) {
      if (this.options.strictErrors) throw new Error(`No se pudo construir URL para id="${idOrPath}"`);
      return;
    }
    this.setLocation(url, query, false);
  }

  /**
   * Navega a una ruta (por id o path) adjuntando datos en memoria.
   * Los datos no van en la URL ni en sessionStorage.
   * Se mantienen hasta que el usuario recargue o cambie de ruta.
   */
  navigateWithData(
    idOrPath: string,
    data: any,
    params?: Record<string, any>,
    query?: Record<string, any>
  ) {
    let path: string | null;
    if (idOrPath.startsWith("/")) {
      path = this.normalizePath(idOrPath);
    } else {
      path = this.getUrlFromParams(idOrPath, params);
      if (!path && this.options.strictErrors)
        throw new Error(`No se pudo construir URL para id="${idOrPath}"`);
    }
    if (!path) return;
    // Guardar datos asociados temporalmente
    this.transientData.set(path, data);
    // Navegar igual que navigate()
    this.setLocation(path, query, false);
  }

  getDataForCurrent(): any {
    const currentPath = this.active?.fullPath ?? null;
    if (!currentPath) return null;
    return this.transientData.get(currentPath) ?? null;
  }

  public getDataForMatch(match: GMatch | null): any {
    if (!match) return null;
    const path = this.normalizePath(match.fullPath);
    return this.transientData.get(path) ?? null;
  }

  /**
   * Limpia los datos asociados a una ruta (o todos).
   */
  clearData(path?: string) {
    if (path) {
      this.transientData.delete(this.normalizePath(path));
    } else {
      this.transientData.clear();
    }
  }

  /** Replace en el historial (compat) */
  replace(idOrPath: string, params?: Record<string, any>, query?: Record<string, any>) {
    if (idOrPath.startsWith("/")) {
      this.setLocation(idOrPath, query, true);
      return;
    }
    const url = this.getUrlFromParams(idOrPath, params);
    if (!url) {
      if (this.options.strictErrors) throw new Error(`No se pudo construir URL para id="${idOrPath}"`);
      return;
    }
    this.setLocation(url, query, true);
  }

  back() {
    window.history.back();
  }

  removeListener() {
    this.cb = undefined;
  }

  setListener(cb: (state: "new" | "history" | "notfound", current: GMatch | null, prev: GMatch | null) => void) {
    this.cb = cb;
  }

  /** Compatibilidad con tu API: loadEvents(callback) */
  start(callback: (state: "new" | "history" | "notfound", current: GMatch | null, prev: GMatch | null) => void) {
    this.setListener(callback);
    this.historyCache = new Map();

    if (this.options.mode === "hash") {
      if (!this.hashchangebind) this.hashchangebind = (e) => this.hashchange(e);
      window.removeEventListener("hashchange", this.hashchangebind);
      window.addEventListener("hashchange", this.hashchangebind, false);
    } else {
      if (!this.popstatebind) this.popstatebind = (e: PopStateEvent) => this.onLocationChange({ synthetic: false });
      window.removeEventListener("popstate", this.popstatebind as any);
      window.addEventListener("popstate", this.popstatebind as any, false);
    }

    // Arranque: si hay default y estamos en raíz, redirigimos
    const path = this.currentPathFromLocation();
    const qs = this.currentQueryFromLocation();

    if (this.defaultRoute) {
      const defUrl = this.getUrlFromParams(this.defaultRoute.id);
      const isEmpty =
        (this.options.mode === "hash" && (!window.location.hash || window.location.hash === "#" || window.location.hash === "#/")) ||
        (this.options.mode === "history" && (path === "/" || path === ""));
      if (isEmpty && defUrl) {
        // Solo redirigimos si aún no estamos en la ruta por defecto
        if (defUrl !== path)
          this.setLocation(defUrl, undefined, true);
        this.onLocationChange({ synthetic: true });
        return;
      }
    }

    // procesar la URL actual
    this.onLocationChange({ newURL: window.location.href, oldURL: "", query: qs ?? undefined });
  }

  /** Compatibilidad con tu API (sólo en modo hash) */
  async hashchange(event: HashChangeEvent & { newURL?: string; oldURL?: string }) {
    if (this.suppressNextHashChange) {
      this.suppressNextHashChange = false;
      return; // evitamos onLocationChange
    }
    // Estándar: event.newURL y event.oldURL existen; en synthetic puede venir vacío
    const newUrlStr = event?.newURL || window.location.href;
    const oldUrlStr = event?.oldURL || "";
    await this.onLocationChange({ newURL: newUrlStr, oldURL: oldUrlStr });
  }

  private async onLocationChange(ev: { newURL?: string; oldURL?: string; synthetic?: boolean; query?: Record<string, string> }) {

    const path = this.currentPathFromLocation();
    const query = ev.query ?? this.currentQueryFromLocation() ?? null;
    const isHistory = this.options.mode === "history";
    const isHash = this.options.mode === "hash";
    const base = this.options.base;
    const prev = this.active;

    // Caché
    let match = this.historyCache.get(path) || null;

    if (!match) {
      const res = await this.resolvePath(path, this.urls);
      if (res) {
        if (query) res.query = { ...query };
        else delete (res as any).query;

        // Redirección inmediata si aplica
        const redirectTo = res.redirect;
        if (redirectTo) {
          this.setLocation(redirectTo, undefined, false);
          return;
        }

        // === 🧠 HOOK: beforeChange (solo antes de cambiar de ruta)
        if (this.beforeChange) {
          const ok = await this.beforeChange(prev ?? null, res);
          if (ok === false) {
            this.log("Navigation cancelled by beforeChange");

            // === MODO HISTORY: revertir sin disparar popstate ===
            if (this.options.mode === "history" && prev) {
              const prevUrl = base + prev.fullPath + this.buildQueryString(prev.query);
              window.history.replaceState({}, "", prevUrl);
              this.active = prev;  // revertir estado interno
              return;
            }

            // === MODO HASH (ya funcionando con suppressNextHashChange) ===
            if (this.options.mode === "hash" && prev) {
              this.suppressNextHashChange = true;
              this.setLocation(prev.fullPath, prev.query, true);
            }

            return;
          }
        }

        const viewRoute = res;

        // Guardar en active la vista real
        this.active = viewRoute;

        // Guardar en caché usando el path de la vista real
        const cacheKey = viewRoute.fullPath;

        this.historyCache.set(cacheKey, viewRoute);

        try {
          this.cb?.("new", this.active, prev ?? null);
        } catch (e) {
          this.log("Callback error:", e);
        }

        // === 🧠 HOOK: afterChange
        if (this.afterChange) {
          try {
            await this.afterChange(prev ?? null, this.active);
          } catch (e) {
            this.log("afterChange error:", e);
          }
        }

        this.log("route new:", res);
        return;
      } else {
        this.active = null;
        try {
          this.cb?.("notfound", null, prev ?? null);
        } catch (e) {
          this.log("Callback error:", e);
        }
        this.log("route notfound:", path);
        return;
      }
    } else {
      // match desde caché
      if (query) match.query = { ...query };
      else delete (match as any).query;

      const routeDef = this.ids.get(match.id)!;
      const mw = await this.runMiddlewareChain(routeDef, match);
      if (!mw.ok) {
        const redirectTo = match.redirect || mw.redirect;
        if (redirectTo) {
          this.setLocation(redirectTo, undefined, false);
          return;
        }
        this.active = null;
        try {
          this.cb?.("notfound", null, prev ?? null);
        } catch (e) {
          this.log("Callback error:", e);
        }
        return;
      }

      // === 🧠 HOOK: beforeChange (para history/back)
      if (this.beforeChange) {
        const ok = await this.beforeChange(prev ?? null, match);
        if (ok === false) {
          this.log("Navigation cancelled by beforeChange");

          // === MODO HISTORY: revertir sin disparar popstate ===
          if (this.options.mode === "history" && prev) {
            const prevUrl = base + prev.fullPath + this.buildQueryString(prev.query);
            window.history.replaceState({}, "", prevUrl);
            this.active = prev;
            return;
          }

          // === MODO HASH ===
          if (this.options.mode === "hash" && prev) {
            this.suppressNextHashChange = true;
            this.setLocation(prev.fullPath, prev.query, true);
          }

          return;
        }
      }

      this.active = match;

      try {
        this.cb?.("history", this.active, prev ?? null);
      } catch (e) {
        this.log("Callback error:", e);
      }

      // === 🧠 HOOK: afterChange
      if (this.afterChange) {
        try {
          await this.afterChange(prev ?? null, this.active);
        } catch (e) {
          this.log("afterChange error:", e);
        }
      }

      this.log("route history:", match);
      return;
    }
  }

  /** Compatibilidad con tu API: limpia toda la caché (y opcionalmente fija active) */
  cleanHist(gurl?: GURL) {
    this.historyCache = new Map();
    if (gurl) {
      const full = this.buildUrlFromRouteChain(gurl);
      this.active = {
        id: gurl.id,
        url: gurl.url,
        fullPath: full,
        params: {},
        classRef: gurl.classRef,
        default: !!gurl.default,
        redirect: gurl.redirect,
      };
      this.historyCache.set(full, this.active);
    }
  }

  /** Compatibilidad con tu API: elimina de la caché según objeto asociado */
  removeHist(gurldel: any) {
    let toRemove: string | null = null;
    for (const [url, m] of this.historyCache) {
      // versión legacy: comparamos object refs si existiese
      if ((m as any).object === (gurldel as any).obj) {
        toRemove = url;
        break;
      }
    }
    if (toRemove) this.historyCache.delete(toRemove);
  }

  /** Compatibilidad con tu API */
  getParams() {
    return this.active?.params ?? {};
  }

  /** Añade una ruta en caliente (corrige bug: this.urls.get → this.ids.get) */
  addGurl(gurl: GURL, parentId?: string) {
    if (this.ids.has(gurl.id)) throw Error(`${gurl.id} exits`);

    let parent: GURL | undefined;
    if (parentId) {
      parent = this.ids.get(parentId);
      if (!parent) throw Error(`${parentId} not exits`);
    }

    this.compilePattern(gurl);
    this.ids.set(gurl.id, gurl);

    if (parent) {
      gurl.parent = parent;
      if (!parent.childs) parent.childs = [];
      parent.childs.push(gurl);
    } else {
      this.urls.push(gurl);
    }

    if (gurl.childs && gurl.childs.length) this.loadIds(gurl.childs, gurl);
  }

  /** Liberar listeners y cachés */
  destroy() {
    if (this.hashchangebind) window.removeEventListener("hashchange", this.hashchangebind);
    if (this.popstatebind) window.removeEventListener("popstate", this.popstatebind as any);
    this.historyCache.clear();
    this.cb = undefined;
    this.active = null;
  }

  /* ==========
     Helpers legacy expuestos para compatibilidad
     ========== */

  // Mantenemos por compatibilidad; internamente no lo usamos fuera de compilePattern
  escapeRegExp(str: string) {
    return this.escapeRegexLiteral(str);
  }

  /* ==========
     Extensiones NO rompedoras (útiles)
     ========== */

  /** Devuelve null en vez de lanzar si falta param obligatorio (útil en UI) */
  tryGetUrlFromParams(id: string, params?: Record<string, any>): string | null {
    try {
      return this.getUrlFromParams(id, params);
    } catch {
      return null;
    }
  }

  public getMatch(): GMatch | null {
    return this.active;
  }

  public getAllRoutes(): GURL[] {
    return [...this.ids.values()];
  }

  /**
   * Devuelve el GMatch que resultaría de navegar a un path dado,
   * pero si existe en caché se devuelve directamente el objeto cacheado.
   * NO modifica el router ni dispara eventos.
   */
  public async matchPath(pathOrUrl: string): Promise<GMatch | null> {
    const [pathPart, queryPart] = pathOrUrl.split("?");
    const norm = this.normalizePath(pathPart || "/");

    // 🔎 1. Buscar en la caché del historial
    const cached = this.historyCache.get(norm);
    if (cached) {
      // actualizar query si viene en pathOrUrl
      if (queryPart) {
        const q = this.parseQueryString(queryPart);
        if (q) cached.query = q;
        else delete (cached as any).query;
      }
      return cached;
    }

    // 🔧 2. Resolver ruta si no está en caché
    const match = await this.resolvePath(norm, this.urls);
    if (!match) return null;

    // ejecutar middlewares (igual que navegación)
    const routeDef = this.ids.get(match.id)!;
    const mw = await this.runMiddlewareChain(routeDef, match);

    if (!mw.ok) {
      if (mw.redirect) return { ...match, redirect: mw.redirect };
      return null;
    }

    // aplicar query manualmente
    if (queryPart) {
      const q = this.parseQueryString(queryPart);
      if (q) match.query = q;
      else delete (match as any).query;
    }

    // ❗ No se guarda en caché porque no es navegación real.
    return match;
  }


  /**
    * Devuelve la cadena de GURL desde la raíz hasta la ruta actual (o una ruta dada).
    * Útil para breadcrumbs, títulos, etc.
    */
  public getRouteChain(match?: GMatch): GURL[] {
    const r = match?.gurl ?? this.active?.gurl;
    if (!r) return [];
    const chain: GURL[] = [];
    let cur: GURL | null = r;
    while (cur) {
      chain.unshift(cur);
      cur = cur.parent ?? null;
    }
    return chain;
  }

}
