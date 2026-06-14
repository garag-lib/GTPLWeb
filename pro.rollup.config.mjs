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
    async renderChunk(code) {
      const result = await transform(code, {
        minify: true,
        target: 'es2020',
        format: 'esm'
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
    input: `${inputDir}/index.ts`,
    output: [
      { file: 'dist/gtplweb.esm.js', format: 'es', sourcemap: !isProd },
      { file: 'dist/gtplweb.cjs.js', format: 'cjs', sourcemap: !isProd, exports: 'named' }
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
    external: ['@mpeliz/gtpl', 'tslib']
  },
  {
    input: `${inputDir}/index.ts`,
    output: { file: 'dist/index.d.ts', format: 'es' },
    plugins: [dts()]
  }
];
