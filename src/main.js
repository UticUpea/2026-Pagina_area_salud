import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"

import api from "./plugins/axios"
import VueAxios from "vue-axios"

const clean = (value) => value?.trim() || ''

// ✅ Variables de entorno: SIN FALLBACKS en producción
const UPLOADS_URL = clean(process.env.VUE_APP_UPLOADS_URL)
const API_BASE = clean(process.env.VUE_APP_API_BASE_URL)

// ✅ Validación temprana para producción
if (process.env.VUE_APP_ENV === 'production') {
  if (!UPLOADS_URL) {
    console.error('❌ ERROR CRÍTICO: VUE_APP_UPLOADS_URL no definida en producción')
  }
  if (!API_BASE) {
    console.error('❌ ERROR CRÍTICO: VUE_APP_API_BASE_URL no definida en producción')
  }
}

const app = createApp(App)

// Plugins
app.use(store)
app.use(router)
app.use(VueAxios, api)

// Globales
app.config.globalProperties.$api = api
app.config.globalProperties.$uploadsUrl = UPLOADS_URL || ''

// Helper de fechas
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

// ✅ TU función $imgUrl (se mantiene igual)
app.config.globalProperties.$imgUrl = (path) => {
  if (!path) return ''
  const cleaned = clean(path)
  if (cleaned.startsWith('http')) return cleaned
  return `${UPLOADS_URL}/uploads/${cleaned}`
}

app.provide('$formatDate', app.config.globalProperties.$formatDate)
app.provide('$imgUrl', app.config.globalProperties.$imgUrl)

// ✅ DOMPurify para sanitización
let DOMPurify = null
try {
  DOMPurify = require('dompurify')
} catch (e) {
  if (process.env.VUE_APP_ENV !== 'production') {
    console.warn('⚠️ DOMPurify no instalado. Ejecuta: npm install dompurify')
  }
}

app.config.globalProperties.$sanitize = (html) => {
  if (!html) return ''
  if (!DOMPurify) {
    return String(html).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  }
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'a', 'img', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'class'],
    ADD_ATTR: ['target'],
    FORCE_TARGET: '_blank'
  })
}

app.provide('$sanitize', app.config.globalProperties.$sanitize)

// ✅ Validación de enlaces externos
app.config.globalProperties.$isSafeLink = (url) => {
  if (!url || typeof url !== 'string') return false
  try {
    const normalized = url.startsWith('http') ? url : `https://${url}`
    const parsed = new URL(normalized)
    if (parsed.protocol !== 'https:') return false
    const allowed = ['upea.bo', 'youtube.com', 'youtu.be', 'facebook.com', 'twitter.com', 'x.com', 'whatsapp.com', 'google.com']
    const hostname = parsed.hostname.replace(/^www\./, '')
    return allowed.some(d => hostname === d || hostname.endsWith(`.${d}`))
  } catch {
    return false
  }
}

app.provide('$isSafeLink', app.config.globalProperties.$isSafeLink)

app.mount("#app")