import consola from 'consola'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import mainStyle from '../../assets/main.scss?inline'
import { WorkerActions } from '../browser/WorkerActions'

import router from './router/Router'
import App from './App.vue'

let hasStarted = false

if (import.meta.env.DEV)
  consola.level = Number.POSITIVE_INFINITY

const { INIT_UI_CONTEXT } = WorkerActions

consola.debug('Vue content script loaded')
chrome.runtime.onMessage.addListener((request, sender) => {
  if (hasStarted)
    return
  if (request.action === INIT_UI_CONTEXT) {
    window.postMessage({ action: INIT_UI_CONTEXT }, '*')
    try {
      consola.debug('Initiating menu UI: ', sender)
      const elRoot = document.createElement('div')
      elRoot.id = 'synco-root'

      const elApp = document.createElement('div')
      elApp.id = 'synco-app'

      // create a shadow root to encapsulate styles

      const shadowRoot = elRoot.attachShadow({ mode: 'open' })
      shadowRoot.appendChild(elApp)

      document.body.appendChild(elRoot)

      // move the head styles to the shadow root

      let stylesSelector = 'style#sync-vide-rtc-styles'

      if (import.meta.env.DEV)
        stylesSelector = 'style[data-vite-dev-id]'

      const existingStyles = document.querySelectorAll(stylesSelector)

      const styles = Array.from(existingStyles).concat(
        Array.of(mainStyle).map((style) => {
          const elStyle = document.createElement('style')
          elStyle.textContent = style
          shadowRoot.appendChild(elStyle)
          return elStyle
        }),
      )

      styles.forEach((style) => {
        shadowRoot.appendChild(style)
      })

      const app = createApp(App)

      app.use(createPinia())
      app.use(router)

      app.mount(elApp)

      consola.debug('Menu UI initiated')
      hasStarted = true
    }
    catch (error) {
      consola.error('There was an error initiating menu UI: ', error)
    }
  }
})
