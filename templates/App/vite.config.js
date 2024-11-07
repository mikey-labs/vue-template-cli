import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
//如果需要兼容低版本可放开注释
// import legacy from '@vitejs/plugin-legacy';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import { resolve } from 'path';

const resolveAlias = (dir) => resolve(process.cwd(), dir);
// https://vitejs.dev/config/
export default defineConfig({
  mode: 'production',
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
      resolvers: [VantResolver()]
    }),
    Components({
      resolvers: [VantResolver()]
    })
    //如果需要兼容低版本可放开注释
    // legacy({
    //   targets: ['chrome < 60'],
    //   additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    //   renderLegacyChunks: true,
    //   polyfills: [
    //     'es.symbol',
    //     'es.array.filter',
    //     'es.promise',
    //     'es.promise.finally',
    //     'es/map',
    //     'es/set',
    //     'es.array.for-each',
    //     'es.object.define-properties',
    //     'es.object.define-property',
    //     'es.object.get-own-property-descriptor',
    //     'es.object.get-own-property-descriptors',
    //     'es.object.keys',
    //     'es.object.to-string',
    //     'web.dom-collections.for-each',
    //     'esnext.global-this',
    //     'esnext.string.match-all'
    //   ]
    // })
  ],
  resolve: {
    alias: {
      '@': resolveAlias('src'),
      components: resolveAlias('src/components/'),
      plugin: resolveAlias('src/plugin/'),
      api: resolveAlias('src/api/'),
      assets: resolveAlias('src/assets/')
    }
  },
  base: './',
  server: {
    cors: true,
    proxy: {
      '/api': ''
    }
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        dir: 'dist',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  }
});
