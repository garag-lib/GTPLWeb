# __APP_DISPLAY_NAME__

GTPLWeb app generated with `gtpl-init`.

Description: __APP_DESCRIPTION__
Author: __APP_AUTHOR__
License: __APP_LICENSE__
Copyright: __APP_COPYRIGHT__

## Commands

```bash
npm install
npm run build:dev
npm run server
```

Production build:

```bash
npm run build:bundle
```

## Starter Pages

- `#/`: project summary.
- `#/templates`: expressions, `g-if`, `g-notif`, `g-switch`, `g-case`, `g-for`, `[value]`, events.
- `#/directives`: WebGTPL directives `g-class`, `g-set`, `g-component`.
- `#/services`: `GRouterService` and `GBus`.
- `#/lazy`: lazy loading with `import()`.
- `#/runtime`: component example with `aot: false`.

## VS Code Tasks

Use `Terminal -> Run Task...`:
- `GTPL: AOT`
- `GTPL: Build Dev`
- `GTPL: Build Bundle`
- `GTPL: Build Bundle Split`
- `GTPL: Server`

## Default GTPLWeb Config

This project keeps the default framework paths visible in `package.json`:

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

Meaning:
- `srcDir`: source TypeScript/components directory.
- `aotDir`: generated AOT directory.
- `outDir`: browser build output directory.
- `entry`: app entry after AOT.
- `i18nDir`: optional JSON translations directory.

## Template Syntax

GTPL events use HTML event attributes:

```html
<button onclick="{{ this.count++ }}">+1</button>
```

Do not use Angular syntax like `(click)="..."`.
