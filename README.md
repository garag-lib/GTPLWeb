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

## Framework Scripts

- `npm run clean`: clean `dist` and `src-aot`
- `npm run aot`: run AOT only
- `npm run typecheck`: TypeScript check without emit
- `npm run build`: clean + aot + main build
- `npm run build:dev`: modular build for debugging
- `npm run build:prod`: production build
- `npm run build:prod:bundle`: explicit production pipeline

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
