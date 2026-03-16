//import { createApp } from 'vue'
//import App from './App.vue'
//import router from './router'
//import store from './store'
//import axios from 'axios'
//import vueAxios from 'vue-axios'
// import VueSweetalert2 from 'vue-sweetalert2';
// import 'sweetalert2/dist/sweetalert2.min.css';
// require("dotenv").config({ path: "../ids.env" });

//axios.defaults.baseURL = process.env.VUE_APP_ROOT_API
//axios.defaults.headers = {
//  'Access-Control-Allow-Credentials': true,
//  'Access-Control-Allow-Origin': '*',
//  'Access-Control-Allow-Headers': 'application/json',
//  'Accept': 'application/json',
//  'content-type': 'application/json',
//  'Content-Security-Policy': 'frame-ancestors https://serviciopagina.upea.bo'
//}

//createApp(App).use(store).use(router).use(vueAxios, axios).mount('#app')



import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"

import api from "./plugins/axios"
import VueAxios from "vue-axios"

const clean = (value) => value?.trim() || ''
const UPLOADS_URL = clean(process.env.VUE_APP_UPLOADS_URL) || 'https://apiadministrador.upea.bo'

const app = createApp(App)

// Plugins
app.use(store)
app.use(router)
app.use(VueAxios, api)

app.config.globalProperties.$api = api
app.config.globalProperties.$uploadsUrl = UPLOADS_URL

app.config.globalProperties.$formatDate = (isoString, options = {}) => {
  if (!isoString) return ''
  const defaultOptions = { day: '2-digit', month: 'long', year: 'numeric' }
  try {
    return new Date(isoString).toLocaleDateString('es-BO', {
      ...defaultOptions,
      ...options
    })
  } catch {
    return isoString 
  }
}

app.config.globalProperties.$imgUrl = (path) => {
  if (!path) return ''
  const cleaned = clean(path)
  if (cleaned.startsWith('http')) return cleaned
  return `${UPLOADS_URL}/uploads/${cleaned}`
}


app.provide('$formatDate', app.config.globalProperties.$formatDate)
app.provide('$imgUrl', app.config.globalProperties.$imgUrl)

app.mount("#app")