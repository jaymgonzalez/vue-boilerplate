import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import { VueQueryPlugin } from 'vue-query'

import App from './App.vue'
import router from './router'

import './assets/global.css'
import 'quasar/dist/quasar.css'

import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
})
app.use(VueQueryPlugin)

app.mount('#app')
