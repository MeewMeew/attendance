import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import postcssMixins from 'postcss-mixins'
import { visualizer } from 'rollup-plugin-visualizer'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import { qrcode } from 'vite-plugin-qrcode'

export default defineConfig({
  css: {
    postcss: {
      plugins: [postcssMixins, tailwindcss, autoprefixer]
    }
  },
  plugins: [
    vue(),
    visualizer(),
    qrcode()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: './build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('exceljs')) {
            return id.toString().split('node_modules/exceljs/')[1].split('/')[0].toString()
          }
          if (id.includes('@firebase')) {
            return id.toString().split('@firebase/')[1].split('/')[0].toString()
          }
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  }
})

