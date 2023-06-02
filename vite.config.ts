import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx, defineManifest } from '@crxjs/vite-plugin'
import icons from 'unplugin-icons/vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		cssInjectedByJsPlugin({ styleId: 'sync-vide-rtc-styles' }),
		icons({
			autoInstall: true,
		}),
		crx({
			manifest: defineManifest(async () => ({
				name: 'Sync Video RTC',
				version: '0.0.0',
				description: 'Sync Video RTC',
				manifest_version: 3,
				background: {
					service_worker: 'src/app/browser/Worker.ts',
					type: 'module',
				},
				content_scripts: [
					{
						matches: ['*://*/*'],
						js: ['src/app/menu/Main.ts'],
					},
				],
				action: {
					default_title: 'Sync Video RTC',
				},
				permissions: ['storage', 'activeTab', 'scripting'],
			})),
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
})
