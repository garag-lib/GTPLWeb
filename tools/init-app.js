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
      'build:dev': 'npm run clean && npm run aot && gtpl-app-build --dev',
      'build:prod': 'npm run clean && npm run aot && gtpl-app-build --prod',
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
`],
  ['src/App.ts', `import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: '${tagName}',
  template: './App.html',
  style: './App.scss',
  styleMode: 'global'
})
export class App extends GTplComponentBase {
  title = '${appName}';
}
`],
  ['src/App.html', `<main>
  <h1>{{ title }}</h1>
</main>
`],
  ['src/App.scss', `body {
  margin: 0;
  font-family: system-ui, sans-serif;
}

main {
  padding: 2rem;
}
`],
  ['README.md', `# ${appName}

GTPLWeb app generated with \`gtpl-init\`.

## Commands

\`\`\`bash
npm install
npm run build:dev
npm run server
\`\`\`

Production build:

\`\`\`bash
npm run build:prod
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
console.log('Next: npm install && npm run build:dev && npm run server');

function normalizePackageName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'gtplweb-app';
}
