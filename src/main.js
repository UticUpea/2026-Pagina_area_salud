import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"

import api from "./plugins/axios"
import VueAxios from "vue-axios"

const clean = (value) => value?.trim() || ''

const UPLOADS_URL = clean(process.env.VUE_APP_UPLOADS_URL)
const API_BASE = clean(process.env.VUE_APP_API_BASE_URL)
const ENV = clean(process.env.VUE_APP_ENV) || 'development'

// ✅ Validación de variables de entorno: solo logs en desarrollo, fail-fast en producción
if (!UPLOADS_URL) {
  if (ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error('VUE_APP_UPLOADS_URL no está definida. Agrega esta variable a tu .env')
  }
  if (ENV === 'production') {
    throw new Error('VUE_APP_UPLOADS_URL es requerida')
  }
}

if (!API_BASE) {
  if (ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error('VUE_APP_API_BASE_URL no está definida. Agrega esta variable a tu .env')
  }
  if (ENV === 'production') {
    throw new Error('VUE_APP_API_BASE_URL es requerida')
  }
}

const app = createApp(App)

app.use(store)
app.use(router)
app.use(VueAxios, api)

app.config.globalProperties.$api = api
app.config.globalProperties.$uploadsUrl = UPLOADS_URL || ''

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
  if (!path || !UPLOADS_URL) return ''
  
  const cleaned = clean(path)
  
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned.replace('http://', 'https://')
  }

  const base = UPLOADS_URL.replace(/\/+$/, '')
  const resource = cleaned.replace(/^\/+/, '')
  
  return `${base}/${resource}`.replace(/\/+/g, '/')
}

app.provide('$formatDate', app.config.globalProperties.$formatDate)
app.provide('$imgUrl', app.config.globalProperties.$imgUrl)

let DOMPurify = null
try {
  DOMPurify = require('dompurify')
} catch (e) {
  if (ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('DOMPurify no instalado. Ejecuta: npm install dompurify')
  }
}

app.config.globalProperties.$sanitize = (html) => {
  if (!html) return ''
  if (!DOMPurify) {
    if (ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('HTML no sanitizado (DOMPurify no instalado)')
    }
    return ENV === 'production' ? '' : String(html)
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'strong', 'em', 'u', 'ul', 'ol', 'li', 
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
      'br', 'a', 'img', 'span', 'div', 'table', 'thead', 'tbody', 'tr', 'td', 'th'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'target', 'class', 'id', 'style'
    ],
    ADD_ATTR: ['target'],
    FORCE_TARGET: '_blank',
    ALLOW_DATA_ATTR: false,
    SANITIZE_DOM: true,
    KEEP_CONTENT: true
  })
}

app.provide('$sanitize', app.config.globalProperties.$sanitize)

app.config.globalProperties.$isSafeLink = (url) => {
  if (!url || typeof url !== 'string') return false
  
  const cleaned = clean(url)
  if (!cleaned) return false
  
  try {
    const normalized = cleaned.startsWith('http') ? cleaned : `https://${cleaned}`
    const parsed = new URL(normalized)

    if (parsed.protocol !== 'https:') return false
    
    const allowedDomains = [
      'upea.bo',
      'youtube.com',
      'youtu.be', 
      'facebook.com',
      'twitter.com',
      'x.com',
      'whatsapp.com',
      'google.com',
      'maps.google.com'
    ]
    
    const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase()

    return allowedDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    )
  } catch {
    if (ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('URL inválida rechazada:', url)
    }
    return false
  }
}

app.provide('$isSafeLink', app.config.globalProperties.$isSafeLink)

app.mount("#app")