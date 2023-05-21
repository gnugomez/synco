import App from './App.vue'
import consola from 'consola'
import '../../assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { WorkerActions } from '../action/WorkerActions'

const { INIT_UI_CONTEXT } = WorkerActions
const app = createApp(App)

app.use(createPinia())

consola.info('Vue content script loaded')
chrome.runtime.onMessage.addListener((request, sender) => {
  switch (request.action) {
    case INIT_UI_CONTEXT:
      if (!document.querySelector('div#sync-video-rtc')) {
        try {
          consola.info(`Initiating menu UI: `, sender)
          const el: Element = document.createElement('div')
          el.id = 'sync-video-rtc'
          document.body.appendChild(el)
          app.mount(el)
        } catch (error) {
          consola.error('There was an error initiating menu UI: ', error)
        }
      }
      break
  }
})
