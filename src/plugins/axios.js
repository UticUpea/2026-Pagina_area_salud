import axios from 'axios'

const clean = (value) => value?.trim() || ''

const API_BASE = clean(process.env.VUE_APP_API_BASE_URL)
const API_TOKEN = clean(process.env.VUE_APP_API_TOKEN)
const UPLOADS_URL = clean(process.env.VUE_APP_UPLOADS_URL)
const ENV = clean(process.env.VUE_APP_ENV) || 'development'

if (!API_BASE) {
  if (ENV !== 'production') {
    console.error('VUE_APP_API_BASE_URL no está definida. Agrega esta variable a tu .env')
  }
  throw new Error('VUE_APP_API_BASE_URL es requerida')
}

if (!UPLOADS_URL) {
  if (ENV !== 'production') {
    console.error('VUE_APP_UPLOADS_URL no está definida. Agrega esta variable a tu .env')
  }
  throw new Error('VUE_APP_UPLOADS_URL es requerida')
}

const api = axios.create({
  baseURL: API_BASE,
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
    const isProd = ENV === 'production'

    if (!isProd) {
      if (error.response?.status === 401) {
        console.error('Error de autenticación: Token inválido o expirado')
      } else if (error.response?.status === 403) {
        console.error('Acceso denegado: Permisos insuficientes')
      } else if (error.response?.status === 404) {
        console.warn('Endpoint no encontrado:', error.config?.url)
      } else if (error.response?.status >= 500) {
        console.error('Error del servidor:', error.response?.status)
      } else if (error.code === 'ERR_NETWORK') {
        console.error('Error de conexión: Verifica tu conexión a internet o la URL de la API')
      }
    }
    
    return Promise.reject(error)
  }
)

api.uploadsUrl = UPLOADS_URL
api.clean = clean 

export default api