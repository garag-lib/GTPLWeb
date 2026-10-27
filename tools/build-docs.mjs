import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
await build({
    absWorkingDir: root,
    entryPoints: ['docs/playground.js'],
    outfile: 'docs/gtplweb-docs.js',
    bundle: true,
    format: 'iife',
    platform: 'browser',
    preserveSymlinks: true,
    target: ['es2022'],
    // Preserve controller names and methods for the live source panels.
    minify: false,
    sourcemap: true,
    legalComments: 'eof',
    tsconfig: 'tsconfig.json',
    logLevel: 'info'
});
