import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import copy from 'rollup-plugin-copy';

export default [
  {
    input: { gtplweb: 'src-aot/index.ts', runtime: 'src-aot/runtime.ts' },
    output: [
      { dir: 'dist', entryFileNames: '[name].esm.js', chunkFileNames: 'shared/[name].esm.js', format: 'es', sourcemap: true },
      { dir: 'dist', entryFileNames: '[name].cjs', chunkFileNames: 'shared/[name].cjs', format: 'cjs', sourcemap: true, exports: 'named' }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig-aot.json',
        compilerOptions: {
          experimentalDecorators: true,
          declaration: false,
          emitDeclarationOnly: false,
          sourceMap: true
        }
      }),
      copy({
        targets: [{ src: 'src-aot/**/*.css', dest: 'dist' }],
        hook: 'writeBundle'
      })
    ],
    external: ['@mpeliz/gtpl', '@mpeliz/gtpl/runtime', 'tslib']
  },
  {
    input: { index: 'src-aot/index.ts', runtime: 'src-aot/runtime.ts' },
    output: { dir: 'dist', entryFileNames: '[name].d.ts', chunkFileNames: 'shared/[name].d.ts', format: 'es' },
    plugins: [dts()]
  }
];
