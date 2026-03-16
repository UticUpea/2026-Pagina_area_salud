import axios from 'axios'

const clean = (value) => value?.trim() || ''

const API_BASE = clean(process.env.VUE_APP_API_BASE_URL) || 'https://apiadministrador.upea.bo/api/v2'
const API_TOKEN = clean(process.env.VUE_APP_API_TOKEN)
const UPLOADS_URL = clean(process.env.VUE_APP_UPLOADS_URL) || 'https://apiadministrador.upea.bo'


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

      // Logging opcional para desarrollo (se desactiva en producción)   REVISAR QUE HACE-----------------------
    // if (process.env.VUE_APP_ENV !== 'production') {
    //   console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    // }      
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('Token API inválido - Revisar VUE_APP_API_TOKEN en .env')
       } 
    else if (error.response?.status === 403) {
      console.error('[API 403] Acceso denegado - Permisos insuficientes')
    } else if (error.response?.status === 404) {
      console.warn('Endpoint no encontrado:', error.config.url)
      
    } else if (error.response?.status >= 500) {
      console.error('Error del servidor API:', error.response.status)
    }
    else if (error.code === 'ERR_NETWORK') {
      console.error('[API Network] Error de red - Verifica tu conexión o CORS:', error.config.url)
    }
    return Promise.reject(error)
  }
)


api.uploadsUrl = UPLOADS_URL
api.clean = clean 

export default api