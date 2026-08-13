import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

import './style.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        console.log('Service Worker зарегистрирован')
      })
      .catch((error) => {
        console.error('Ошибка Service Worker:', error)
      })
  })
}