import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"

import api from "./plugins/axios"
import VueAxios from "vue-axios"

const clean = (value) => value?.trim() || ''

const API_BASE = clean(process.env.VUE_APP_API_BASE_URL)
const ENV = clean(process.env.VUE_APP_ENV) || 'development'

if (!API_BASE) {
  if (ENV !== 'production') {
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
  if (!path || typeof path !== 'string') return ''
  const cleaned = clean(path)

  if (cleaned.startsWith('https://')) return cleaned

  if (ENV === 'production' && cleaned.startsWith('http://')) {
    return cleaned.replace('http://', 'https://')
  }

  if (!cleaned.startsWith('http') && /\.[a-z]{3,4}$/i.test(cleaned)) {
    const ext = cleaned.toLowerCase().split('.').pop()
    const filename = cleaned.replace(/^\/+/, '')
    const allowedDomains = {
      images: 'https://archivosminio.upea.bo/archivospaginasnode/imagenes',
      documents: 'https://archivosminio.upea.bo/archivospaginasnode/documentos/gacetas'
    }
    
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
    const pdfExts = ['pdf']
    
    if (imageExts.includes(ext)) {
      return `${allowedDomains.images}/${filename}`
    }
    if (pdfExts.includes(ext)) {
      return `${allowedDomains.documents}/${filename}`
    }

    return `${allowedDomains.images}/${filename}`
  }
  
  return cleaned
}

app.config.globalProperties.$buildSafeImageUrl = app.config.globalProperties.$imgUrl

app.provide('$formatDate', app.config.globalProperties.$formatDate)
app.provide('$imgUrl', app.config.globalProperties.$imgUrl)
app.provide('$buildSafeImageUrl', app.config.globalProperties.$buildSafeImageUrl)

let DOMPurify = null
try {
  DOMPurify = require('dompurify')
} catch (e) {
  if (ENV !== 'production') {
    console.warn('DOMPurify no instalado. Para sanitización HTML segura, ejecuta: npm install dompurify')
  }
}

app.config.globalProperties.$sanitize = (html) => {
  if (!html) return ''
  
  if (DOMPurify) {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'strong', 'em', 'u', 'ul', 'ol', 'li', 
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
        'br', 'a', 'img', 'span', 'div', 'table', 'thead', 'tbody', 'tr', 'td', 'th'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'class', 'id'],
      ADD_ATTR: ['target'],
      FORCE_TARGET: '_blank',
      ALLOW_DATA_ATTR: false,
      SANITIZE_DOM: true
    })
  }

  if (ENV !== 'production') {
    console.warn('Usando sanitización básica (instala DOMPurify para mayor seguridad)')
  }
  
  return String(html)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .slice(0, 5000)
}

app.provide('$sanitize', app.config.globalProperties.$sanitize)

app.config.globalProperties.$isSafeLink = (url) => {
  if (!url || typeof url !== 'string') return false
  
  const cleaned = clean(url)
  if (!cleaned) return false
  
  try {
    const normalized = cleaned.startsWith('http') ? cleaned : `https://${cleaned}`
    const parsed = new URL(normalized)

    if (ENV === 'production' && parsed.protocol !== 'https:') return false
    
    const allowedDomains = [
      'upea.bo',
      'archivosminio.upea.bo',
      'apiadministrador.upea.bo',
      'medicina.upea.bo',
      'utic.upea.bo',
      'enfermeria.upea.bo',
      'youtube.com', 'youtu.be', 
      'facebook.com', 'www.facebook.com', 'm.facebook.com',
      'twitter.com', 'www.twitter.com', 'x.com',
      'whatsapp.com', 'wa.me',
      'instagram.com', 'linkedin.com',
      'google.com', 'maps.google.com', 'maps.googleapis.com'
    ]
    
    const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase()

    return allowedDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    )
  } catch {
    if (ENV !== 'production') {
      console.warn('URL inválida rechazada:', url)
    }
    return false
  }
}

app.provide('$isSafeLink', app.config.globalProperties.$isSafeLink)

app.config.globalProperties.$scrollToSection = (id) => {
  if (!id) return
  const element = document.getElementById(id.replace('#', ''))
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

app.provide('$scrollToSection', app.config.globalProperties.$scrollToSection)

app.mount("#app")