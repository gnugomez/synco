import App from './App.vue'
import consola from 'consola'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { WorkerActions } from '../action/domain/WorkerActions'

const { INIT_UI_CONTEXT } = WorkerActions
const app = createApp(App)

app.use(createPinia())

consola.info('Vue content script loaded')
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case INIT_UI_CONTEXT:
            if (!document.querySelector('div#syncVideoRtc')) {
                try {
                    consola.info(`Initiating menu UI: `, sender)
                    const el: Element = document.createElement('div')
                    el.id = 'syncVideoRtc'
                    document.body.appendChild(el)
                    app.mount(el)
                } catch (error) {
                    consola.error('There was an error initiating menu UI: ', error)
                }
            }
            break;
    }
})
