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
			const el: Element = document.createElement('div')
			el.id = 'sync-video-rtc'
			document.body.appendChild(el)
			app.mount(el)
		}
		catch (error) {
			consola.error('There was an error initiating menu UI: ', error)
		}
	}
})
