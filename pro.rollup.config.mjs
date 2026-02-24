import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import fs from 'fs';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

const inputDir = fs.existsSync('./src-aot') ? './src-aot' : './src';
const isProd = process.env.NODE_ENV === 'production';

console.log(`Compilando desde: ${inputDir} (${isProd ? 'PROD' : 'DEV'})`);

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
      ...(isProd ? [terser()] : []),
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
