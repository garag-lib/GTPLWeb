import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import fs from 'fs';
import { transform } from 'esbuild';
import copy from 'rollup-plugin-copy';

const inputDir = fs.existsSync('./src-aot') ? './src-aot' : './src';
const isProd = true;

console.log(`Compilando desde: ${inputDir} (${isProd ? 'PROD' : 'DEV'})`);

function minifyWithEsbuild() {
  return {
    name: 'minify-with-esbuild',
    async renderChunk(code, _chunk, outputOptions) {
      const result = await transform(code, {
        minify: true,
        target: 'es2020',
        format: outputOptions.format === 'cjs' ? 'cjs' : 'esm'
      });
      return {
        code: result.code,
        map: null
      };
    }
  };
}

export default [
  {
    input: { gtplweb: `${inputDir}/index.ts`, runtime: `${inputDir}/runtime.ts` },
    output: [
      { dir: 'dist', entryFileNames: '[name].esm.js', chunkFileNames: 'shared/[name].esm.js', format: 'es', sourcemap: !isProd },
      { dir: 'dist', entryFileNames: '[name].cjs', chunkFileNames: 'shared/[name].cjs', format: 'cjs', sourcemap: !isProd, exports: 'named' }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig-aot.json',
        compilerOptions: {
          declaration: false,
          emitDeclarationOnly: false,
          sourceMap: !isProd
        }
      }),
      ...(isProd ? [minifyWithEsbuild()] : []),
      copy({
        targets: [{ src: 'src-aot/**/*.css', dest: 'dist' }],
        hook: 'writeBundle'
      })
    ],
    external: ['@mpeliz/gtpl', '@mpeliz/gtpl/runtime', 'tslib']
  },
  {
    input: { index: `${inputDir}/index.ts`, runtime: `${inputDir}/runtime.ts` },
    output: { dir: 'dist', entryFileNames: '[name].d.ts', chunkFileNames: 'shared/[name].d.ts', format: 'es' },
    plugins: [dts()]
  }
];
