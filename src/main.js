import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './styles/app.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

createApp(App).use(createPinia()).use(router).mount('#app')
