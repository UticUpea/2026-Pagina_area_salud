import axios from 'axios'

const clean = (value) => value?.trim() || ''

const API_BASE = clean(process.env.VUE_APP_API_BASE_URL)
const API_TOKEN = clean(process.env.VUE_APP_API_TOKEN)
const UPLOADS_URL = clean(process.env.VUE_APP_UPLOADS_URL)

if (process.env.VUE_APP_ENV === 'production') {
  if (!API_BASE) {
    console.error('❌ ERROR CRÍTICO: VUE_APP_API_BASE_URL no definida en producción')
    throw new Error('VUE_APP_API_BASE_URL es requerida en producción')
  }
  if (!UPLOADS_URL) {
    console.error('❌ ERROR CRÍTICO: VUE_APP_UPLOADS_URL no definida en producción')
    throw new Error('VUE_APP_UPLOADS_URL es requerida en producción')
  }
}

const baseURL = API_BASE || (process.env.VUE_APP_ENV !== 'production' ? 'https://apiadministrador.upea.bo/api/v2' : '')
const uploadsUrl = UPLOADS_URL || (process.env.VUE_APP_ENV !== 'production' ? 'https://apiadministrador.upea.bo' : '')

if (process.env.VUE_APP_ENV !== 'production' && !API_BASE) {
  console.warn('⚠️ VUE_APP_API_BASE_URL no definida - usando fallback (SOLO DEV)')
}
if (process.env.VUE_APP_ENV !== 'production' && !UPLOADS_URL) {
  console.warn('⚠️ VUE_APP_UPLOADS_URL no definida - usando fallback (SOLO DEV)')
}

const api = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

api.interceptors.request.use(config => {  
  if (API_TOKEN) {
    config.headers.Authorization = `Bearer ${API_TOKEN}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    const isProd = process.env.VUE_APP_ENV === 'production'
    
    if (error.response?.status === 401) {
      console.error('❌ Error de autenticación')
    } else if (error.response?.status === 403) {
      console.error('❌ Acceso denegado')
    } else if (error.response?.status === 404) {
      if (!isProd) console.warn('Endpoint no encontrado')
    } else if (error.response?.status >= 500) {
      console.error('❌ Error del servidor')
    } else if (error.code === 'ERR_NETWORK') {
      console.error('❌ Error de conexión')
    }
    return Promise.reject(error)
  }
)

api.uploadsUrl = uploadsUrl
api.clean = clean 

export default api