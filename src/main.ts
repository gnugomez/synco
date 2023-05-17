import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import consola from 'consola'

const app = createApp(App)

app.use(createPinia())

consola.info('Vue environment loaded')
