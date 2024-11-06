import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/core/index',
    './src/cli.ts',
  ],
  outDir: 'dist',
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
    output: {
      dir: 'dist',
      // 铺平文件结构
      // entryFileNames: '[name].js',
      // chunkFileNames: '[name]-[hash].js',
    },
  },
})
