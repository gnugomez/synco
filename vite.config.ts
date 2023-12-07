import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx, defineManifest } from '@crxjs/vite-plugin'
import icons from 'unplugin-icons/vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const version = process.env.npm_package_version || '0.0.0'
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
				name: 'synco',
				version,
				description: 'synco',
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
					default_title: 'synco',
				},
				permissions: ['storage', 'activeTab', 'scripting'],
			})),
		}),
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src/'),
		},
	},
})
