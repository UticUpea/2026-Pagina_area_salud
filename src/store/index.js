import { createStore } from 'vuex'

let cryptr = null
const CRYPT_KEY = process.env.VUE_APP_CRYPT_KEY

if (CRYPT_KEY && process.env.VUE_APP_ENV !== 'production') {
  try {
    const Cryptr = require('cryptr')
    cryptr = new Cryptr(CRYPT_KEY)
  } catch (e) {
    if (process.env.VUE_APP_ENV !== 'production') {
      console.warn('cryptr no disponible')
    }
  }
}

export default createStore({
  state: {
    url_api: process.env.VUE_APP_API_ROOT?.trim() || '',
    getter: true,
    MenuConv: [],
    MenuCur: [],
    Links: [],
    Institucion: {},
    convocatorias: [],
    cursos: [],
    servicios: [],
    ofertas: [],
    publicaciones: [],
    gacetas: [],
    eventos: [],
    videos: [],
    autoridades: [],
    statusImg: true,
  },
  
  getters: {
    getUrlApi: (state) => state.url_api,
    getInstitucion: (state) => state.Institucion,
    convocatoriasCountByType: (state) => (tipo) => {
      return state.convocatorias.filter(c => 
        c.tipo_conv_comun?.tipo_conv_comun_titulo === tipo && c.con_estado === '1'
      ).length
    },
    cursosCountByType: (state) => (tipo) => {
      return state.cursos.filter(c => 
        c.tipo_curso_otro?.tipo_conv_curso_nombre === tipo && c.det_estado === '1'
      ).length
    },
  },
  
  mutations: {
    loadOn() {
      const preloader = document.querySelector("#preloader")
      if (preloader) preloader.style.visibility = "visible"
      window.scrollTo(0, 0)
    },
    
    loading() {
      const preloader = document.querySelector("#preloader")
      if (preloader) preloader.style.visibility = "hidden"
    },
    
    loadOff() {
      const preloader = document.querySelector("#preloader")
      if (preloader) preloader.style.visibility = "hidden"
    },

    setInstitucion(state, data) {
      state.Institucion = data || {}
    },

    setMenuConv(state, data) {
      state.MenuConv = Array.isArray(data) ? data : []
    },
    
    setMenuCur(state, data) {
      state.MenuCur = Array.isArray(data) ? data : []
    },

    setLinks(state, data) {
      state.Links = Array.isArray(data) ? data : []
    },

    setConvocatorias(state, data) {
      state.convocatorias = Array.isArray(data) ? data : []
    },
    
    setCursos(state, data) {
      state.cursos = Array.isArray(data) ? data : []
    },
    
    setServicios(state, data) {
      state.servicios = Array.isArray(data) ? data : []
    },
    
    setOfertas(state, data) {
      state.ofertas = Array.isArray(data) ? data : []
    },
    
    setPublicaciones(state, data) {
      state.publicaciones = Array.isArray(data) ? data : []
    },
    
    setGacetas(state, data) {
      state.gacetas = Array.isArray(data) ? data : []
    },
    
    setEventos(state, data) {
      state.eventos = Array.isArray(data) ? data : []
    },
    
    setVideos(state, data) {
      state.videos = Array.isArray(data) ? data : []
    },
    
    setAutoridades(state, data) {
      state.autoridades = Array.isArray(data) ? data : []
    },
    
    setGetter(state, value) {
      state.getter = value
    },

    clickLink(state) {
      window.scrollTo(0, 0)
      state.getter = true
    },
    
    idEncrypt(state, text) {
      if (!cryptr) {
        if (process.env.VUE_APP_ENV !== 'production') {
          console.warn('Encriptación no disponible')
        }
        return text
      }
      if (process.env.VUE_APP_ENV === 'production') {
        return text
      }
      try {
        return cryptr.encrypt(String(text))
      } catch (e) {
        if (process.env.VUE_APP_ENV !== 'production') {
          console.error('Error encriptando:', e)
        }
        return text
      }
    }
  },
  
  actions: {
    initStore({ state }) {
      if (process.env.VUE_APP_ENV === 'production') {
        if (!state.url_api) {
         
          return
        }
      }
    }
  },
  
  modules: {}
})