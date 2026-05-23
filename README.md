# @mpeliz/gtplweb

Web framework on top of `@mpeliz/gtpl` for browser apps with:
- decorators (`@Component`, `@Directive`)
- built-in directives (`g-set`, `g-class`, `g-component`)
- router (`GRouter`, `GRouterService`)
- global event bus (`GBus`)
- AOT compiler (`gtpl-aot`)
- app bundler (`gtpl-app-build`)
- app starter (`gtpl-init`)

## Requirements

- Node.js 18+

## Install

```bash
npm install @mpeliz/gtplweb
```

`@mpeliz/gtpl` is installed as dependency.

## Quick Start (new app)

```bash
npx gtpl-init my-app
cd my-app
npm install
npm run build:dev
npm run server
```

Open `http://localhost:8080`.

Alternative bootstrap (git script):

```bash
curl -fsSL https://raw.githubusercontent.com/garag-lib/GTPLWeb/main/tools/init-project.sh | bash -s -- my-app
```

## App Build Flow

1. Write app code in `src/`
2. Run AOT:

```bash
npx gtpl-aot
```

3. Build app bundle:

```bash
npx gtpl-app-build --mode dev
```

Modes:
- `dev`: bundled, sourcemaps, no minify
- `bundle`: bundled + minified
- `bundle-split`: minified + chunk splitting for lazy `import()`

## Recommended App Scripts

```json
{
  "scripts": {
    "clean": "rm -rf src-aot www/dist",
    "aot": "gtpl-aot",
    "build:dev": "npm run clean && npm run aot && gtpl-app-build --mode dev",
    "build:bundle": "npm run clean && npm run aot && gtpl-app-build --mode bundle",
    "build:bundle-split": "npm run clean && npm run aot && gtpl-app-build --mode bundle-split",
    "server": "php -S 0.0.0.0:8080 -t www"
  }
}
```

## Minimal Component

```ts
import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'my-app',
  template: './App.html',
  style: './App.scss',
  styleMode: 'global'
})
export class App extends GTplComponentBase {}
```

## Core Concepts

GTPLWeb architecture in short:
1. `@Component` defines controllers + templates/styles.
2. Built-in directives (`g-set`, `g-class`, `g-component`) handle common view behavior.
3. `GRouterService` resolves route state and page component class.
4. Root app (usually extending `AppGTplComponent`) renders current page instance.
5. `GBus` coordinates cross-component events.

Lifecycle hooks on controllers:
- `onConstruct(...args)`
- `onInit()`
- `onTemplateReady()`
- `onConnect()`
- `onDisconnect()`
- `onDestroy()`

## Router Example

```ts
import { GRouterService } from '@mpeliz/gtplweb';
import { HomePage } from './pages/HomePage.js';

GRouterService.init([
  { id: 'home', url: '/', default: true, classRef: HomePage.__gcomponent__ }
]);
```

For rendered page instances in root app templates, mount with:

```html
<div g-is="page"></div>
```

## Template Notes

- Value binding: `{{ count }}`
- Event binding: `onclick="{{ increment }}"`
- Use `.js` extension in TS imports between source files.

## Built-in Directives

- `g-set`
- `g-class`
- `g-component`

They are auto-registered when importing `@mpeliz/gtplweb`.

## GBus Example

```ts
import { GBus } from '@mpeliz/gtplweb';

const sub = GBus.subscribe('app.ready', payload => {
  console.log(payload);
});

GBus.emit('app.ready', { ok: true });
sub.off();
```

## CLI

### `gtpl-init`

Create starter app:

```bash
npx gtpl-init my-app
```

### `gtpl-aot`

Compile templates/styles into `src-aot`.

```bash
npx gtpl-aot
```

Main options:
- `--src-dir`
- `--aot-dir` (alias: `--out-dir`)
- `--tsconfig`
- `--static-out-dir`
- `--public-out-dir`
- `--no-static-copy`

### `gtpl-app-build`

Bundle app from AOT output.

```bash
npx gtpl-app-build --mode dev
```

Main options:
- `--mode dev|bundle|bundle-split`
- `--src-dir`
- `--aot-dir` (alias: `--src-aot-dir`)
- `--out-dir`
- `--entry`
- `--i18n-dir`
- `--no-i18n`
- `--no-clean`
- `--verify-dedupe`

## Package Config (`package.json`)

Optional:

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

## Framework Scripts (this repo)

- `npm run clean`
- `npm run aot`
- `npm run typecheck`
- `npm run test`
- `npm run build:structured`
- `npm run build:bundle`

## Troubleshooting

- `Missing src-aot`: run `npx gtpl-aot`
- Missing app entry: check `gtplweb.entry` or `--entry`
- Styles/templates not found: check relative paths in `@Component`
