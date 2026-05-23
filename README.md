# @mpeliz/gtplweb

Web component framework built on top of `@mpeliz/gtpl`, including:
- Decorators (`@Component`, `@Directive`)
- Built-in directives (`g-set`, `g-class`, `g-component`)
- Integrated router (`GRouter`, `GRouterService`)
- Global event bus (`GBus`)
- AOT precompilation (`gtpl-aot`)

This guide is focused on real-world usage patterns like MovilTopo: a root `App` that routes pages by `classRef`, dynamic view rendering, and event-driven communication.

## Requirements

- Node.js 18+
- npm 9+

## Installation

In a consumer project:

```bash
npm install @mpeliz/gtplweb
```

`@mpeliz/gtpl` is installed automatically as a required dependency of `@mpeliz/gtplweb` (it is declared in package `dependencies`).

## Start a New App

Git-only bootstrap (interactive):

```bash
curl -fsSL https://raw.githubusercontent.com/garag-lib/GTPLWeb/main/tools/init-project.sh | bash
```

Git-only bootstrap (non-interactive):

```bash
curl -fsSL https://raw.githubusercontent.com/garag-lib/GTPLWeb/main/tools/init-project.sh | bash -s -- my-app
cd my-app
npm install
npm run build:dev
npm run server
```

Open `http://localhost:8080`.

Starter includes:
- hash routes configured in `src/main.ts`
- `Home` page
- `About` page with reactive counter
- `Lazy` page loaded by dynamic `import()`
- `Runtime` page with `template: './RuntimePage.html'` and `aot: false` (runtime fetch, no template precompile)
- generic build pipeline: `gtpl-aot` -> `gtpl-app-build`

Compilation methods:

- `dev`:
  - single bundled `main.js`
  - sourcemaps enabled, no minify
  - no runtime import map required
  - best for day-to-day local development
- `bundle`:
  - single minified `main.js`
  - no code splitting for lazy `import()` pages
  - best for simple production deploy
- `bundle-split`:
  - minified production bundle + ESM chunk splitting
  - lazy `import()` pages become separate files in `www/dist/chunks`
  - best when you want production optimization and true lazy loading

Use dev bundle (recommended for local work without import map):

```bash
npx gtpl-app-build --mode dev
```

Use production single bundle:

```bash
npm run build:bundle
```

Use production with lazy chunks:

```bash
npx gtpl-app-build --mode bundle-split
```

Minimal app structure:

```text
.
├── package.json
├── tsconfig.json
├── src/
│   ├── main.ts
│   ├── App.ts
│   ├── App.html
│   └── App.scss
└── www/
    └── index.html
```

Recommended `package.json` scripts:

```json
{
  "type": "module",
  "scripts": {
    "clean": "rm -rf src-aot www/dist",
    "aot": "gtpl-aot",
    "build:dev": "npm run clean && npm run aot && gtpl-app-build --mode dev",
    "build:bundle": "npm run clean && npm run aot && gtpl-app-build --mode bundle",
    "build:bundle-split": "npm run clean && npm run aot && gtpl-app-build --mode bundle-split",
    "server": "php -S 0.0.0.0:8080 -t www"
  },
  "dependencies": {
    "@mpeliz/gtplweb": "^1.0.0"
  }
}
```

This is a plain browser app. It needs only `@mpeliz/gtplweb`; `@mpeliz/gtpl` comes as a transitive framework dependency. Capacitor is not required.

Minimal `tsconfig.json` for an app:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["DOM", "ES2020", "DOM.Iterable"],
    "rootDir": "src",
    "outDir": "www/dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": false,
    "useDefineForClassFields": false
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "src-aot", "www/dist"]
}
```

Minimal `www/index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>GTPLWeb App</title>
  <link rel="stylesheet" href="./dist/global-styles.css" />
  <script type="module" src="./dist/main.js"></script>
</head>
<body>
  <my-app></my-app>
</body>
</html>
```

Minimal `src/main.ts`:

```ts
import './App.js';
```

Minimal `src/App.ts`:

```ts
import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'my-app',
  template: './App.html',
  style: './App.scss',
  styleMode: 'global'
})
export class App extends GTplComponentBase {
  title = 'GTPLWeb App';
}
```

Minimal `src/App.html`:

```html
<main>
  <h1>{{ title }}</h1>
</main>
```

Minimal `src/App.scss`:

```scss
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
```

## Add Pages and Routing

Create a page component:

```text
src/pages/Home.ts
src/pages/Home.html
src/pages/Home.scss
```

`src/pages/Home.ts`:

```ts
import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'home-page',
  template: './Home.html',
  style: './Home.scss',
  styleMode: 'global'
})
export class Home extends GTplComponentBase {
  counter = 0;

  increment() {
    this.counter++;
  }
}
```

`src/pages/Home.html`:

```html
<section>
  <h2>Home</h2>
  <button onclick="{{ increment }}">Clicks: {{ counter }}</button>
</section>
```

Important GTPL syntax:
- Text/value binding: `{{ counter }}`
- Event binding: `onclick="{{ increment }}"` or `onclick="{{ this.counter++ }}"`
- Do not use Angular syntax like `(click)="increment()"`.
- Imports between TypeScript source files must use `.js` extension, for example `import { Home } from './pages/Home.js';`.

Router setup in `src/main.ts`:

```ts
import './App.js';
import { GRouterService } from '@mpeliz/gtplweb';
import { Home } from './pages/Home.js';

GRouterService.init([
  { id: 'home', url: '/', default: true, classRef: Home.__gcomponent__ }
]);
```

Root app for routed pages:

```ts
import { Animations, AppGTplComponent, Component, getControllerFromComponent } from '@mpeliz/gtplweb';

@Component({
  tag: 'my-app',
  template: './App.html',
  style: './App.scss',
  styleMode: 'global'
})
export class App extends AppGTplComponent {
  page?: HTMLElement;

  async onRouteChange(_state: string, current: any) {
    const Class = current.classRef;
    const newPage = current.gurl.component ?? new Class();
    current.gurl.component = newPage;

    if (this.page !== newPage) {
      this.page = newPage;
      await Animations.fadeIn(this.page);
      Animations.resetStyles(this.page);
    }

    const controller: any = getControllerFromComponent(this.page);
    controller.action?.(current);
  }
}
```

Mount routed page in `src/App.html`:

```html
<header>
  <a href="#/">Home</a>
</header>

<main>
  <div g-is="page"></div>
</main>
```

Important: use `g-is="page"` for an HTMLElement/component. Do not write `{{ page }}`, because that prints `[object HTMLElement]`.

## Public API

Main exports:
- `Component`
- `Directive`
- `GTplComponentBase`
- `AppGTplComponent`
- `GRouter`
- `GRouterService`
- `GBus`
- `Animations`
- Types: `GController`, `HostElement`

When importing `@mpeliz/gtplweb`, these directives are registered automatically:
- `g-set`
- `g-class`
- `g-component`

## Core Framework Flow

1. Define controllers with `@Component(...)`.
2. Each decorated class gets `__gcomponent__`.
3. The router (`GRouterService`) resolves the current route and emits `urlChanged`.
4. A root app (`AppGTplComponent`) listens to `urlChanged` and decides which component to instantiate/render.
5. Components communicate through `GBus`.

## Basic Component

```ts
import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'counter-page',
  template: './Counter.html',
  style: './Counter.scss',
  styleMode: 'global'
})
export class CounterPage extends GTplComponentBase {
  count = 0;

  onInit() {}
  onTemplateReady() {}
  onConnect() {}
  onDisconnect() {}
  onDestroy() {}
}
```

Notes:
- If `tag` is omitted, it is inferred from the class name in kebab-case.
- Custom element names must contain `-`.
- `shadow` supports `true | false | ShadowRootInit`.

## Controller Lifecycle

Available hooks:
- `onConstruct(...args)`
- `onInit()`
- `onTemplateReady()`
- `onConnect()`
- `onDisconnect()`
- `onDestroy()`

Additionally, each controller gets a `destroy()` method for explicit teardown.

## Templates and Styles

`template` can be:
- Inline HTML
- File path (`./MyView.html`)
- Object `{ html: "<div>...</div>" }`

`style` can be:
- Inline CSS
- `.css` file paths
- `.scss` / `.sass` file paths (resolved during AOT)

`styleMode`:
- `inline`
- `file`
- `global`
- `lazy`

## Router (App + Pages Pattern)

Route definition:

```ts
import { GRouterService } from '@mpeliz/gtplweb';
import { Mapa } from './pages/mapa/Mapa.js';
import { Ntrip } from './pages/ntrip/Ntrip.js';

GRouterService.init([
  { id: 'mapa', url: '/mapa', default: true, classRef: Mapa.__gcomponent__ },
  { id: 'ntrip', url: '/ntrip', classRef: Ntrip.__gcomponent__ }
]);
```

Root app:

```ts
import { AppGTplComponent, Animations, getControllerFromComponent } from '@mpeliz/gtplweb';

export class App extends AppGTplComponent {
  page?: HTMLElement;

  async onRouteChange(state, current) {
    const Class = current.classRef;
    const newPage = current.gurl.component ?? new Class();
    current.gurl.component = newPage;

    if (this.page !== newPage) {
      this.page = newPage;
      await Animations.fadeIn(this.page);
      Animations.resetStyles(this.page);
    }

    const ctr: any = getControllerFromComponent(this.page);
    ctr.action?.(current);
  }
}
```

Key `GRouter` capabilities:
- `beforeChange` and `afterChange`
- child routes (`childs`)
- params and query
- `navigate`, `replace`, `back`
- `matchPath` for resolving without navigation
- `navigateWithData` / `getDataForCurrent`

## Global Event Bus (`GBus`)

Typical usage:

```ts
import { GBus } from '@mpeliz/gtplweb';

const sub = GBus.subscribe('gnss.position', payload => {
  console.log(payload);
});

GBus.emit('gnss.position', { lat: 40.4, lon: -3.7 });

sub.off();
```

Features:
- typed events
- namespaces
- async handlers
- `once`, `waitFor`, `waitForComplete`

## Built-in Directives

### `g-set`

Assigns values to the controller (supports nested paths):

```html
<input g-set:name="event.target.value" />
<input g-set:user.email="event.target.value" />
```

Legacy compatibility:

```html
<input g-set-var="name" g-set="event.target.value" />
```

### `g-class`

Dynamic class binding by expression:

```html
<p g-class="isActive ? 'ok' : 'ko'">State</p>
```

### `g-component`

Mounts a registered component by tag:

```html
<div g-component="currentViewTag"></div>
```

## Components Without Custom Elements

If you need to mount into an existing host:

```ts
@Component({
  tag: 'legacy-panel',
  asWebComponent: false,
  template: './Legacy.html'
})
export class LegacyPanel {}

const host = document.querySelector('#host') as HTMLElement;
new (LegacyPanel as any).__gcomponent__(host);
```

## AOT (gtpl-aot)

The AOT compiler:
- scans `src/**/*.ts`
- detects `@Component(...)`
- compiles GTPL templates
- compiles SCSS/SASS
- generates output into `src-aot/`

CLI:

```bash
npx gtpl-aot
```

## App Build CLI (`gtpl-app-build`)

`gtpl-app-build` packages a consumer app after AOT. It is web-first and has no Capacitor dependency. It also replaces project-local build scripts like the ones used in MovilTopo when an app later grows into Capacitor.

Default behavior:
- reads `src-aot/main.ts`
- writes to `www/dist`
- bundles framework/deps directly into app output (no runtime import map required)
- copies generated `.html` / `.css`
- copies `src/i18n/**/*.json` to `www/dist/i18n`

Commands:

```bash
npx gtpl-aot
npx gtpl-app-build --mode dev
npx gtpl-app-build --mode bundle
npx gtpl-app-build --mode bundle-split
```

Create starter files:

```bash
curl -fsSL https://raw.githubusercontent.com/garag-lib/GTPLWeb/main/tools/init-project.sh | bash
```

Options:
- `--mode dev`: bundled output with sourcemaps, not minified, no runtime import map.
- `--mode bundle`: bundled `main.js`, minified vendor, no sourcemaps.
- `--mode bundle-split`: bundled/minified output with ESM chunk splitting for lazy imports.
- `--src-dir src`: original source directory.
- `--aot-dir src-aot`: AOT directory generated by `gtpl-aot`.
- `--out-dir www/dist`: output directory.
- `--entry src-aot/main.ts`: app entry.
- `--i18n-dir src/i18n`: JSON translation source directory.
- `--no-i18n`: skip i18n copy.
- `--no-clean`: keep existing output files.

Optional `package.json` config:

```json
{
  "gtplweb": {
    "srcDir": "src",
    "aotDir": "src-aot",
    "outDir": "www/dist",
    "entry": "src-aot/main.ts",
    "i18nDir": "src/i18n"
  }
}
```

Example with custom folders:

```json
{
  "gtplweb": {
    "srcDir": "app",
    "aotDir": ".cache/gtpl-aot",
    "outDir": "public/assets",
    "entry": ".cache/gtpl-aot/main.ts",
    "i18nDir": "translations"
  }
}
```

## Tools

This package exposes three executable tools from `tools/`.

### `gtpl-init`

Creates a new web-only GTPLWeb app. Use it once when starting a project from zero.

```bash
node tools/init-app.js my-app
```

It creates:
- `package.json`
- `tsconfig.json`
- `www/index.html`
- `src/main.ts`
- `src/App.ts`
- `src/App.html`
- `src/App.scss`
- `.gitignore`

Local source file:
- `tools/init-app.js`

### `gtpl-aot`

Runs the GTPLWeb AOT compiler. Use it before bundling.

```bash
npx gtpl-aot
```

It reads:
- `src/**/*.ts` by default, or the directory configured with `--src-dir` / `gtplweb.srcDir`
- component templates referenced by `template`
- component styles referenced by `style`

It writes:
- `src-aot/` by default, or the directory configured with `--aot-dir` / `gtplweb.aotDir`
- `global-styles.css` in the AOT directory when components use `styleMode: 'global'`
- copies generated `.html` / `.css` into `tsconfig.compilerOptions.outDir`, `gtplweb.staticOutDir`, or `gtplweb.outDir`

Options:
- `--src-dir src`: original source directory.
- `--aot-dir src-aot`: generated AOT directory.
- `--tsconfig tsconfig.json`: TypeScript config used to discover `outDir`.
- `--static-out-dir dist`: where generated static `.html` / `.css` are copied.
- `--public-out-dir ./dist`: public base path used to rewrite runtime asset URLs for `aot: false`.
- `--no-static-copy`: skip static file copy.

Main purpose:
- compiles GTPL templates ahead of time
- compiles SCSS/SASS to CSS
- supports per-component opt-out with `aot: false` (keeps template/style runtime-loaded)
- injects compiled template/style metadata into generated component classes

Local source file:
- `tools/aot-prebuild.js`

### `gtpl-app-build`

Builds a consumer app after `gtpl-aot`. Use explicit modes.

```bash
npx gtpl-app-build --mode dev
npx gtpl-app-build --mode bundle
npx gtpl-app-build --mode bundle-split
```

It reads:
- `src-aot/main.ts` by default, or the path configured with `--entry` / `gtplweb.entry`
- `package.json`
- optional `package.json#gtplweb` config

It writes by default:
- `www/dist/main.js`
- `www/dist/chunks/*` in `bundle-split` when lazy `import()` exists
- copied generated `.html` / `.css`
- copied `src/i18n/**/*.json` into `www/dist/i18n`

Modes:
- `--mode dev`: bundled output with sourcemaps, no minify, no runtime import map.
- `--mode bundle`: bundled/minified app output, no sourcemaps.
- `--mode bundle-split`: bundled/minified app output with chunk splitting for lazy `import()`.

Options:
- `--src-dir src`
- `--aot-dir src-aot`
- `--out-dir www/dist`
- `--entry src-aot/main.ts`
- `--i18n-dir src/i18n`
- `--no-i18n`
- `--no-clean`

Local source file:
- `tools/app-build.js`

Typical app scripts:

```json
{
  "scripts": {
    "clean": "rm -rf src-aot www/dist",
    "aot": "gtpl-aot",
    "build:dev": "npm run clean && npm run aot && gtpl-app-build --mode dev",
    "build:bundle": "npm run clean && npm run aot && gtpl-app-build --mode bundle",
    "build:bundle-split": "npm run clean && npm run aot && gtpl-app-build --mode bundle-split"
  }
}
```

## Framework Scripts

- Framework repository:
  - `npm run clean`: clean `dist` and `src-aot`
  - `npm run aot`: run AOT only
  - `npm run typecheck`: TypeScript check without emit
  - `npm run build:bundle`: production build
- Consumer app:
  - `npm run build:dev`: `gtpl-aot` + `gtpl-app-build --mode dev`
  - `npm run build:bundle`: `gtpl-aot` + `gtpl-app-build --mode bundle`
  - `npm run build:bundle-split`: `gtpl-aot` + `gtpl-app-build --mode bundle-split`

## Recommended App Pattern

1. `main.ts`: initialize `GRouterService`.
2. `App.ts`: extend `AppGTplComponent` and handle rendering in `onRouteChange`.
3. Pages: extend `GTplComponentBase`.
4. Cross-page communication: use `GBus`.
5. Before packaging: run `gtpl-aot` and bundle from `src-aot`.

## Troubleshooting

- `TS18003` or no input files: run `npm run aot`.
- Templates/styles not loading: verify relative paths in `template` and `style`.
- `g-component` does not mount: ensure the component is registered with `@Component`.
- Changes not reflected: clean `src-aot`/`dist` and rebuild.
