import consola from 'consola'
import '../../assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { WorkerActions } from '../browser/WorkerActions'

import App from './App.vue'

if (import.meta.env.DEV)
	consola.level = Number.POSITIVE_INFINITY

const { INIT_UI_CONTEXT } = WorkerActions
const app = createApp(App)

app.use(createPinia())

consola.debug('Vue content script loaded')
chrome.runtime.onMessage.addListener((request, sender) => {
	if (request.action === INIT_UI_CONTEXT) {
		try {
			consola.debug('Initiating menu UI: ', sender)
			const elRoot = document.createElement('div')
			elRoot.id = 'sync-video-rtc-root'

			const elApp = document.createElement('div')
			elApp.id = 'sync-video-rtc-app'

			// create a shadow root to encapsulate styles

			const shadowRoot = elRoot.attachShadow({ mode: 'open' })
			shadowRoot.appendChild(elApp)

			document.body.appendChild(elRoot)

			// move the head styles to the shadow root

			let stylesSelector = 'style#sync-vide-rtc-styles'

			if (import.meta.env.DEV)
				stylesSelector = 'style[data-vite-dev-id]'

			const styles = document.querySelectorAll(stylesSelector)

			styles.forEach((style) => {
				shadowRoot.appendChild(style)
			})

			app.mount(elApp)
		}
		catch (error) {
			consola.error('There was an error initiating menu UI: ', error)
		}
	}
})
