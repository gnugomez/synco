import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { defineManifest, crx } from '@crxjs/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    crx({
      manifest: defineManifest(async (env) => ({
        name: 'Sync Video RTC',
        version: '0.0.0',
        description: 'Sync Video RTC',
        manifest_version: 3,
        background: {
          service_worker: 'src/worker.ts',
          type: 'module'
        },
        action: {
          default_title: 'Sync Video RTC'
        },
        permissions: ['storage', 'activeTab', 'scripting']
      }))
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./src/main.ts', import.meta.url))
      },
      output: {
        entryFileNames: '[name].js',
        format: 'es'
      }
    }
  }
})
