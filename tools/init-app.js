#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const targetDir = path.resolve(process.cwd(), process.argv[2] || '.');
const appName = normalizePackageName(path.basename(targetDir) || 'gtplweb-app');
const tagName = `${appName.replace(/[^a-z0-9]+/g, '-')}-app`.replace(/^-+|-+$/g, '') || 'gtplweb-app';

const files = new Map([
  ['package.json', JSON.stringify({
    name: appName,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      clean: 'rm -rf src-aot www/dist',
      aot: 'gtpl-aot',
      'build:structured': 'npm run clean && npm run aot && gtpl-app-build --mode structured',
      'build:bundle': 'npm run clean && npm run aot && gtpl-app-build --mode bundle',
      server: 'php -S 0.0.0.0:8080 -t www'
    },
    gtplweb: {
      srcDir: 'src',
      aotDir: 'src-aot',
      outDir: 'www/dist',
      publicOutDir: './dist',
      entry: 'src-aot/main.ts',
      i18nDir: 'src/i18n'
    },
    dependencies: {
      '@mpeliz/gtplweb': '^1.0.0'
    }
  }, null, 2) + '\n'],
  ['tsconfig.json', JSON.stringify({
    compilerOptions: {
      target: 'ES2020',
      module: 'ESNext',
      moduleResolution: 'bundler',
      lib: ['DOM', 'ES2020', 'DOM.Iterable'],
      rootDir: 'src',
      outDir: 'www/dist',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      experimentalDecorators: true,
      emitDecoratorMetadata: false,
      useDefineForClassFields: false
    },
    include: ['src/**/*.ts'],
    exclude: ['node_modules', 'src-aot', 'www/dist']
  }, null, 2) + '\n'],
  ['www/index.html', `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${appName}</title>
  <link rel="stylesheet" href="./dist/global-styles.css" />
  <script type="importmap">
  {
    "imports": {
      "@mpeliz/gtpl": "./dist/gtpl.esm.js",
      "@mpeliz/gtpl/": "./dist/gtpl.esm.js/",
      "@mpeliz/gtplweb": "./dist/gtplweb.esm.js",
      "@mpeliz/gtplweb/": "./dist/gtplweb.esm.js/",
      "tslib": "./dist/tslib.es6.js"
    }
  }
  </script>
  <script type="module" src="./dist/main.js"></script>
</head>
<body>
  <${tagName}></${tagName}>
</body>
</html>
`],
  ['src/main.ts', `import './App.js';
import { GRouterService } from '@mpeliz/gtplweb';
import { HomePage } from './pages/HomePage.js';
import { AboutPage } from './pages/AboutPage.js';
import { RuntimePage } from './pages/RuntimePage.js';

GRouterService.init([
  {
    id: 'home',
    url: '/',
    default: true,
    classRef: HomePage.__gcomponent__
  },
  {
    id: 'about',
    url: '/about',
    classRef: AboutPage.__gcomponent__
  },
  {
    id: 'lazy',
    url: '/lazy',
    classRef: async () => {
      const mod = await import('./pages/LazyPage.js');
      return mod.LazyPage.__gcomponent__;
    }
  },
  {
    id: 'runtime',
    url: '/runtime',
    classRef: RuntimePage.__gcomponent__
  }
]);
`],
  ['src/App.ts', `import { AppGTplComponent, Component } from '@mpeliz/gtplweb';

@Component({
  tag: '${tagName}',
  template: './App.html',
  style: './App.scss',
  styleMode: 'global'
})
export class App extends AppGTplComponent {
  page = null;

  async onRouteChange(state, current) {
    const isChildRoute = !current.classRef;
    const ref = isChildRoute ? current.gurl.parent?.classRef : current.classRef;
    if (!ref) return;

    let componentFactory = ref;
    if (typeof ref === 'function' && !ref.prototype) {
      componentFactory = await ref();
    }

    const existingComponent = isChildRoute ? current.gurl.parent?.component : current.gurl.component;
    if (state === 'new' && !existingComponent) {
      const instance = new componentFactory();
      if (isChildRoute) {
        current.gurl.parent.component = instance;
      } else {
        current.gurl.component = instance;
      }
    }
    this.page = isChildRoute ? current.gurl.parent?.component : current.gurl.component;
  }
}
`],
  ['src/App.html', `<main class="app-shell">
  <header>
    <h1>${appName}</h1>
    <nav>
      <a href="#/">Home</a>
      <a href="#/about">About</a>
      <a href="#/lazy">Lazy</a>
      <a href="#/runtime">Runtime</a>
    </nav>
  </header>
  <section class="page">
    <div g-is="page"></div>
  </section>
</main>
`],
  ['src/App.scss', `body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.app-shell {
  padding: 1.5rem;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

nav {
  display: flex;
  gap: 0.75rem;
}

nav a {
  color: #0a66c2;
  text-decoration: none;
  font-weight: bold;
}

.page {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
`],
  ['src/pages/HomePage.ts', `import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'home-page',
  template: './HomePage.html',
  style: './HomePage.scss',
  styleMode: 'global'
})
export class HomePage extends GTplComponentBase {
}
`],
  ['src/pages/HomePage.html', `<h2>Home</h2>
<p>Starter listo con enrutado GTPLWeb.</p>
`],
  ['src/pages/HomePage.scss', `h2 {
  margin-top: 0;
}
`],
  ['src/pages/AboutPage.ts', `import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'about-page',
  template: './AboutPage.html',
  style: './AboutPage.scss',
  styleMode: 'global'
})
export class AboutPage extends GTplComponentBase {
  clicks = 0;

  increment() {
    this.clicks++;
  }
}
`],
  ['src/pages/AboutPage.html', `<h2>About</h2>
<p>Reactividad simple:</p>
<button onclick="{{ increment }}">Clicks: {{ clicks }}</button>
`],
  ['src/pages/AboutPage.scss', `button {
  padding: 0.5rem 0.75rem;
}
`],
  ['src/pages/LazyPage.ts', `import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'lazy-page',
  template: './LazyPage.html',
  style: './LazyPage.scss',
  styleMode: 'global'
})
export class LazyPage extends GTplComponentBase {
}
`],
  ['src/pages/LazyPage.html', `<h2>Lazy</h2>
<p>Esta vista se carga por import dinámico al navegar.</p>
`],
  ['src/pages/LazyPage.scss', `h2 {
  margin-top: 0;
}
`],
  ['src/pages/RuntimePage.ts', `import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'runtime-page',
  template: './RuntimePage.html',
  aot: false,
  style: './RuntimePage.css',
  styleMode: 'global'
})
export class RuntimePage extends GTplComponentBase {
  clicks = 0;

  increment() {
    this.clicks++;
  }
}
`],
  ['src/pages/RuntimePage.html', `<h2>Runtime Template</h2>
<p>Template desde fichero HTML sin AOT en este componente.</p>
<button onclick="{{ increment }}">Clicks: {{ clicks }}</button>
`],
  ['src/pages/RuntimePage.css', `button {
  padding: 0.5rem 0.75rem;
}
`],
  ['README.md', `# ${appName}

GTPLWeb app generated with \`gtpl-init\`.

## Commands

\`\`\`bash
npm install
npm run build:structured
npm run server
\`\`\`

Production build:

\`\`\`bash
npm run build:bundle
\`\`\`

## Default GTPLWeb Config

This project keeps the default framework paths visible in \`package.json\`:

\`\`\`json
{
  "gtplweb": {
    "srcDir": "src",
    "aotDir": "src-aot",
    "outDir": "www/dist",
    "publicOutDir": "./dist",
    "entry": "src-aot/main.ts",
    "i18nDir": "src/i18n"
  }
}
\`\`\`

Meaning:
- \`srcDir\`: source TypeScript/components directory.
- \`aotDir\`: generated AOT directory.
- \`outDir\`: browser build output directory.
- \`publicOutDir\`: path used inside import maps from \`www/index.html\`.
- \`entry\`: app entry after AOT.
- \`i18nDir\`: optional JSON translations directory.

## Template Syntax

GTPL events use HTML event attributes:

\`\`\`html
<button onclick="{{ this.count++ }}">+1</button>
\`\`\`

Do not use Angular syntax like \`(click)="..."\`.
`],
  ['.gitignore', `node_modules
src-aot
www/dist
`]
]);

fs.mkdirSync(targetDir, { recursive: true });

for (const [relPath, content] of files) {
  const fullPath = path.join(targetDir, relPath);
  if (fs.existsSync(fullPath)) {
    console.error(`Refusing to overwrite ${path.relative(process.cwd(), fullPath)}`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

console.log(`GTPLWeb app created in ${path.relative(process.cwd(), targetDir) || '.'}`);
console.log('Config visible in package.json#gtplweb and README.md');
console.log('Next: npm install && npm run build:structured && npm run server');

function normalizePackageName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'gtplweb-app';
}
