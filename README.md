# @mpeliz/gtplweb

A web component framework built on top of `@mpeliz/gtpl`, with decorators, directives, and AOT precompilation.

## Requirements

- Node.js 18+
- npm 9+

## Installation

In this framework repository:

```bash
npm install
```

In a consumer project:

```bash
npm install @mpeliz/gtplweb @mpeliz/gtpl
```

`@mpeliz/gtpl` is a required runtime dependency.

## Exports

From `@mpeliz/gtplweb`, you get:

- `Component`
- `Directive`
- Types: `GController`, `HostElement`
- Core utilities (`GTplComponentBase`, router, events, etc.)

When you import the root package, built-in directives are registered:

- `g-class`
- `g-set`
- `g-component`

## Create a Component (Web Component)

Minimal example with inline template:

```ts
import { Component, GController } from '@mpeliz/gtplweb';

@Component({
  tag: 'app-counter',
  template: `
    <section>
      <h2>Counter</h2>
      <button g-set:count="count + 1">+</button>
      <button g-set:count="count - 1">-</button>
      <p g-class="count > 0 ? 'ok' : 'ko'">Value: {{count}}</p>
    </section>
  `,
  style: `
    .ok { color: green; }
    .ko { color: crimson; }
  `,
  shadow: true,
  styleMode: 'inline'
})
export class CounterComponent implements GController {
  count = 0;

  onInit() {
    console.log('Counter init');
  }

  onTemplateReady() {
    console.log('Template mounted');
  }
}
```

HTML usage:

```html
<app-counter></app-counter>
```

Notes:

- `tag` must contain a hyphen (`-`), per custom element rules.
- If you omit `tag`, it is inferred from class name in kebab-case.
- `shadow: true` creates an `open` shadow root.

## Create a Component Without a Custom Element

If you want to mount on an existing host (`asWebComponent: false`):

```ts
import { Component } from '@mpeliz/gtplweb';

@Component({
  tag: 'legacy-panel',
  asWebComponent: false,
  template: `<div>Legacy panel</div>`
})
export class LegacyPanel {
  title = 'Demo';
}

const host = document.querySelector('#panel-host') as HTMLElement;
new (LegacyPanel as any).__gcomponent__(host);
```

## Controller Lifecycle

Available optional hooks:

- `onConstruct(...args)`
- `onInit()`
- `onTemplateReady()`
- `onConnect()`
- `onDisconnect()`
- `onDestroy()`

`destroy()` is available on the controller for teardown.

## Template and Style Options

`@Component` accepts:

- `template: '<div>...</div>'` (inline)
- `template: 'path/to/template.html'` (file)
- `template: { html: '<div>...</div>' }`

`style` accepts a string or string array:

- Inline CSS (`'.btn { ... }'`)
- `.css` file paths
- `.scss`/`.sass` file paths (processed in AOT)

`styleMode` values:

- `inline`: inject styles into host/shadow.
- `file`: inject style links/files.
- `lazy`: defer style application (runtime controlled).
- `global`: supported by AOT, useful for global CSS consolidation.

## Built-in Directives

### `g-class`

Applies classes dynamically.

```html
<p g-class="isActive ? 'active' : 'inactive'">State</p>
```

It also accepts arrays when your expression returns `string[]`.

### `g-set`

Assigns values to controller properties or nested paths.

Recommended argument syntax:

```html
<input g-set:name="event.target.value" />
<input g-set:user.email="event.target.value" />
```

Legacy syntax (still supported):

```html
<input g-set-var="name" g-set="event.target.value" />
```

### `g-component`

Dynamically mounts a registered component by tag:

```html
<div g-component="currentView"></div>
```

If `currentView = 'user-list'`, it will instantiate that component (if registered via `@Component`).

## Create a Custom Directive

```ts
import { Directive, GDirectiveBase } from '@mpeliz/gtplweb';

@Directive({ name: 'g-focus' })
export class GFocus extends GDirectiveBase {
  onInit() {
    (this as any).ele?.focus?.();
  }
}
```

The directive name must be a valid HTML attribute name.

## AOT and Build Flow

Recommended flow:

1. Clean artifacts (`dist`, `src-aot`)
2. Run AOT (`tools/aot-prebuild.js`)
3. Bundle with Rollup

Scripts:

- `npm run clean`: removes `dist` and `src-aot`.
- `npm run aot`: runs only AOT prebuild.
- `npm run typecheck`: TypeScript validation without emit.
- `npm run build`: main library build (CJS + ESM + types) in dev mode.
- `npm run build:dev`: modular output (`preserveModules`) for debugging.
- `npm run build:prod`: main production build (minified).
- `npm run build:prod:bundle`: explicit production pipeline.

Main output in `dist` (`build` / `build:prod`):

- `dist/gtplweb.esm.js`
- `dist/gtplweb.cjs.js`
- `dist/index.d.ts`

## CLI

The package exposes:

```bash
npx gtpl-aot
```

This runs `tools/aot-prebuild.js` in the current project.

## npm Publishing

Configured to publish as `@mpeliz/gtplweb` with `Apache-2.0` license.

Published package content:

- `dist/`
- `tools/aot-prebuild.js`
- `README.md`
- `LICENSE`
- `NOTICE`
- `CITATION.cff`

Before publishing:

```bash
npm run typecheck
npm run build:prod
npm publish --access public
```

`prepublishOnly` already runs `typecheck + build:prod` automatically.

## Troubleshooting

- If you get `TS18003` or no input files found, run `npm run aot`.
- If AOT does not compile components, verify `@Component(...)` classes are inside `src/`.
- If styles are missing, verify `style`/`template` paths and rebuild.
