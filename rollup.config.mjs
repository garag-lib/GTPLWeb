import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import copy from 'rollup-plugin-copy';

export default [
  {
    input: 'src-aot/index.ts',
    output: [
      { file: 'dist/gtplweb.esm.js', format: 'es', sourcemap: true },
      { file: 'dist/gtplweb.cjs.js', format: 'cjs', sourcemap: true, exports: 'named' }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig-aot.json',
        compilerOptions: {
          experimentalDecorators: true
        }
      }),
      copy({
        targets: [{ src: 'src-aot/**/*.css', dest: 'dist' }],
        hook: 'writeBundle'
      })
    ],
    external: ['@mpeliz/gtpl', 'tslib']
  },
  {
    input: 'src-aot/index.ts',
    output: { file: 'dist/index.d.ts', format: 'es' },
    plugins: [dts()]
  }
];
