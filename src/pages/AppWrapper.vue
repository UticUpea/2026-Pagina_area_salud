<template>
  <div>
    <HeaderCustom />
    <router-view />
    <FooterCustom />
  </div>
</template>

<script>
import HeaderCustom from "@/components/HeaderCustom.vue";
import FooterCustom from "@/components/FooterCustom.vue";
import { mapState } from "vuex";
import api from '@/plugins/axios';

const sanitizeHTML = (html) => {
  if (!html) return '';
  if (typeof window !== 'undefined' && window.$sanitize) {
    return window.$sanitize(html);
  }
  return String(html).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};


const ALLOWED_DOMAINS = [
  'upea.bo', 'youtube.com', 'youtu.be', 'facebook.com', 
  'twitter.com', 'x.com', 'whatsapp.com', 'google.com', 'maps.google.com'
];

const isSafeExternalUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    const parsed = new URL(normalized);
    if (parsed.protocol !== 'https:') return false;
    const hostname = parsed.hostname.replace(/^www\./, '');
    return ALLOWED_DOMAINS.some(d => hostname === d || hostname.endsWith(`.${d}`));
  } catch {
    return false;
  }
};

export default {
  name: "appWrapper",
  
  components: {
    HeaderCustom,
    FooterCustom,
  },

  data() {
    return {
      idInstitucion: process.env.VUE_APP_ID_INSTITUCION || '9',
      slideInterval: null,
    };
  },

  mounted() {
    document.body.addEventListener('contextmenu', this.blockRighClick);
  },
  
  beforeUnmount() {
    document.body.removeEventListener('contextmenu', this.blockRighClick);
    if (this.slideInterval) clearInterval(this.slideInterval);
  },

  computed: {
    ...mapState(["url_api", "Institucion", "MenuConv", "MenuCur", "Colors", "getter", "statusImg", "Links"]),
    
    imageUrl() {
      const url = (process.env.VUE_APP_UPLOADS_URL || '').trim();
      if (process.env.VUE_APP_ENV === 'production' && !url) {
        console.error('❌ VUE_APP_UPLOADS_URL no definida en producción');
        return '';
      }
      return url || 'https://apiadministrador.upea.bo';
    },
    
    institucionData() {
      return this.Institucion?.Descripcion || this.Institucion;
    },
  },
  
  methods: {
    _sanitizarHTML(obj, fieldsToSanitize = []) {
      if (!obj || typeof obj !== 'object') return obj;
      
      const cleaned = { ...obj };
      Object.keys(cleaned).forEach(key => {
        const value = cleaned[key];
        
        if (typeof value === 'string' && fieldsToSanitize.includes(key)) {
          cleaned[key] = sanitizeHTML(value);
        }
        else if (value && typeof value === 'object' && !Array.isArray(value)) {
          cleaned[key] = this._sanitizarHTML(value, fieldsToSanitize);
        }
        else if (Array.isArray(value)) {
          cleaned[key] = value.map(item => 
            typeof item === 'object' ? this._sanitizarHTML(item, fieldsToSanitize) : item
          );
        }
        else if (typeof value === 'string') {
          cleaned[key] = value.trim();
        }
      });
      return cleaned;
    },

    _limpiar(obj) {
      if (!obj || typeof obj !== 'object') return obj;
      const cleaned = { ...obj };
      Object.keys(cleaned).forEach(key => {
        if (typeof cleaned[key] === 'string') {
          cleaned[key] = cleaned[key].trim();
        } else if (cleaned[key] && typeof cleaned[key] === 'object' && !Array.isArray(cleaned[key])) {
          cleaned[key] = this._limpiar(cleaned[key]);
        }
      });
      return cleaned;
    },

    async getMenuConv() {
      try {
        const res = await api.get(`/institucion/${this.idInstitucion}/gacetaEventos`);
        const data = res.data;
        
        const tiposConv = [...new Set(
          (data.convocatorias || [])
            .filter(c => c.tipo_conv_comun?.tipo_conv_comun_estado === "1")
            .map(c => c.tipo_conv_comun)
            .filter((v, i, a) => a.findIndex(t => t.idtipo_conv_comun === v.idtipo_conv_comun) === i)
        )];
        this.$store.commit('setMenuConv', tiposConv);
        
        const htmlFields = ['con_descripcion', 'det_descripcion', 'evento_descripcion', 'serv_descripcion', 'ofertas_descripcion', 'video_breve_descripcion'];
        
        this.$store.commit('setConvocatorias', (data.convocatorias || []).map(item => 
          this._sanitizarHTML(this._limpiar(item), htmlFields)
        ));
        this.$store.commit('setCursos', (data.cursos || []).map(item => 
          this._sanitizarHTML(this._limpiar(item), htmlFields)
        ));
        this.$store.commit('setEventos', (data.upea_evento || []).map(item => 
          this._sanitizarHTML(this._limpiar(item), htmlFields)
        ));
        this.$store.commit('setServicios', (data.serviciosCarrera || []).map(item => 
          this._sanitizarHTML(this._limpiar(item), htmlFields)
        ));
        this.$store.commit('setOfertas', (data.ofertasAcademicas || []).map(item => 
          this._sanitizarHTML(this._limpiar(item), htmlFields)
        ));
        this.$store.commit('setGacetas', (data.upea_gaceta_universitaria || [])
          .filter(g => g.gaceta_id && g.gaceta_documento)
          .map(this._limpiar)
        );
        
      } catch (error) {
        const isProd = process.env.VUE_APP_ENV === 'production';
        console.error(isProd ? '❌ Error cargando datos' : 'Error cargando MenuConv:', isProd ? '' : error);
        
        if (!isProd) {
          try {
            const res = await api.get("/Tipoconvocatorias");
            const filterConv = res.data.filter(el => el.tipo_conv_comun_estado == "1");
            this.$store.commit('setMenuConv', filterConv);
          } catch (err) {
            console.error('Fallback failed');
          }
        }
      }
    },

async getMenuCur() {
  try {
    const res = await api.get(`/institucion/${this.idInstitucion}/gacetaEventos`);
    const data = res.data;
    
    const tiposCur = [...new Set(
      (data.cursos || [])
        .filter(c => c.tipo_curso_otro?.tipo_conv_curso_estado === "1")
        .map(c => ({
          ...c.tipo_curso_otro,
          idtipo_curso_otros: c.idtipo_curso_otros
        }))
        .filter((v, i, a) => 
          a.findIndex(t => t.idtipo_curso_otros === v.idtipo_curso_otros) === i
        )
    )];
    
    this.$store.commit('setMenuCur', tiposCur);
    
  } catch (error) {
    const isProd = process.env.VUE_APP_ENV === 'production';
    console.error(isProd ? '❌ Error cargando datos' : 'Error cargando MenuCur:', isProd ? '' : error);
    
    if (!isProd) {
      try {
        const res = await api.get("/TipoCurso");
        const filterCur = res.data.filter(el => el.tipo_conv_curso_estado == "1");
        this.$store.commit('setMenuCur', filterCur);
      } catch (err) {
        console.error('Fallback failed');
      }
    }
  }
},

    async getLinks() {
      try {
        const res = await api.get(`/institucion/${this.idInstitucion}/recursos`);
        const data = res.data;
        
        const filterLinks = (data.linksExternoInterno || [])
          .filter(link => link.estado === 1 || link.ei_estado === "1")
          .map(link => ({
            ...link,
            url_link: isSafeExternalUrl(link.url_link) ? link.url_link : '#'
          }));
        this.$store.commit('setLinks', filterLinks);
        
        const htmlFields = ['publicaciones_descripcion'];
        this.$store.commit('setPublicaciones', (data.upea_publicaciones || []).map(item => 
          this._sanitizarHTML(this._limpiar(item), htmlFields)
        ));
        
      } catch (error) {
        const isProd = process.env.VUE_APP_ENV === 'production';
        console.error(isProd ? '❌ Error cargando datos' : 'Error cargando Links:', isProd ? '' : error);
        
        if (!isProd) {
          try {
            const res = await api.get(`/linksIntExtAll/${this.idInstitucion}`);
            const filterLinks = res.data
              .filter(link => link.ei_estado == "1")
              .map(link => ({
                ...link,
                url_link: isSafeExternalUrl(link.url_link) ? link.url_link : '#'
              }));
            this.$store.commit('setLinks', filterLinks);
          } catch (err) {
            console.error('Fallback failed');
          }
        }
      }
    },

    async getContenidoExtra() {
      try {
        const res = await api.get(`/institucion/${this.idInstitucion}/contenido`);
        const data = res.data;
        
        const htmlFields = ['descripcion_facilitador', 'video_breve_descripcion'];
        
        this.$store.commit('setAutoridades', (data.autoridad || []).map(item => 
          this._sanitizarHTML(this._limpiar(item), htmlFields)
        ));
        this.$store.commit('setVideos', (data.upea_videos || []).map(item => 
          this._sanitizarHTML(this._limpiar(item), htmlFields)
        ));
        
      } catch (error) {
        const isProd = process.env.VUE_APP_ENV === 'production';
        console.error(isProd ? '❌ Error cargando datos' : 'Error cargando contenido extra:', isProd ? '' : error);
      }
    },

    async getInstitucion() {
      try {
        const res = await api.get(`/institucionesPrincipal/${this.idInstitucion}`);
        const institucionData = res.data.Descripcion || res.data;
        
        const htmlFields = [
          'institucion_historia', 
          'institucion_mision', 
          'institucion_vision', 
          'institucion_objetivos', 
          'institucion_sobre_ins'
        ];
        
        const sanitizedData = this._sanitizarHTML(institucionData, htmlFields);
        this.$store.commit('setInstitucion', sanitizedData);
        
      } catch (error) {
        const isProd = process.env.VUE_APP_ENV === 'production';
        console.error(isProd ? '❌ Error cargando institución' : 'Error getInstitucion:', isProd ? '' : error);
      }
    },

    setImages(images) {
      if (this.slideInterval) clearInterval(this.slideInterval);
      
      const base = this.imageUrl?.replace(/\/$/, '');
      const imageBaseUrl = base ? `${base}/InstitucionUpea/Portada/` : '';
      
      const banner = document.querySelector(".banner-img");
      
      if (!banner) return;
      
      if (images?.length > 0) {
        let currentIndex = 0;
        
        const changeImage = () => {
          const imgPath = images[currentIndex].portada_imagen;
          const img = imgPath?.startsWith('http') 
            ? imgPath.replace('http://', 'https://') 
            : `${imageBaseUrl}${imgPath?.startsWith('/') ? imgPath.slice(1) : imgPath}`;
          
          banner.style.backgroundImage = `url("${img}")`;
          currentIndex = (currentIndex + 1) % images.length;
        };
        
        changeImage();
        this.slideInterval = setInterval(changeImage, 5000);
        
      } else {
        banner.style.backgroundImage = `url("@/assets/upea_fondo.jpg")`;
      }
      
      this.$store.commit("loading");
    },

    async createdComponents() {
      try {
        await Promise.all([
          this.getInstitucion(),
          this.getMenuConv(),    
          this.getMenuCur(),     
          this.getLinks(),   
          this.getContenidoExtra() 
        ]);
        
      } catch (error) {
        const isProd = process.env.VUE_APP_ENV === 'production';
        console.error(isProd ? '❌ Error en carga inicial' : 'Error en carga inicial:', isProd ? '' : error);
      }
    },

    blockRighClick(event) {
      event.preventDefault();
    }
  },
  
  created() {
    this.$store.commit("loadOn");
    this.createdComponents();
  },
};
</script>
