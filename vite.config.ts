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
          service_worker: 'src/app/action/Worker.ts',
          type: 'module'
        },
        content_scripts: [
          {
            matches: ['*://*/*'],
            js: ['src/app/menu/Main.ts']
          }
        ],
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
  }
})
