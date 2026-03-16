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
      return (process.env.VUE_APP_UPLOADS_URL || 'https://apiadministrador.upea.bo').trim();
    },
    
    institucionData() {
      return this.Institucion?.Descripcion || this.Institucion;
    },
  },
  
  methods: {

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
        
        this.$store.commit('setConvocatorias', data.convocatorias?.map(this._limpiar) || []);
        this.$store.commit('setCursos', data.cursos?.map(this._limpiar) || []);
        this.$store.commit('setEventos', data.upea_evento?.map(this._limpiar) || []);
        this.$store.commit('setServicios', data.serviciosCarrera?.map(this._limpiar) || []);
        this.$store.commit('setOfertas', data.ofertasAcademicas?.map(this._limpiar) || []);
        this.$store.commit('setGacetas', (data.upea_gaceta_universitaria || []).filter(g => g.gaceta_id && g.gaceta_documento).map(this._limpiar));
        
      } catch (error) {
        console.error('Error cargando MenuConv:', error);
        try {
          const res = await api.get("/Tipoconvocatorias");
          const filterConv = res.data.filter(el => el.tipo_conv_comun_estado == "1");
          this.$store.commit('setMenuConv', filterConv);
        } catch (err) {
          console.error('Fallback failed:', err);
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
    console.error('Error cargando MenuCur:', error);
    try {
      const res = await api.get("/TipoCurso");
      const filterCur = res.data.filter(el => el.tipo_conv_curso_estado == "1");
      this.$store.commit('setMenuCur', filterCur);
    } catch (err) {
      console.error('Fallback failed:', err);
    }
  }
},

    async getLinks() {
      try {
        const res = await api.get(`/institucion/${this.idInstitucion}/recursos`);
        const data = res.data;
        
        const filterLinks = (data.linksExternoInterno || [])
          .filter(link => link.estado === 1 || link.ei_estado === "1");
        this.$store.commit('setLinks', filterLinks);
        
        this.$store.commit('setPublicaciones', data.upea_publicaciones?.map(this._limpiar) || []);
        
      } catch (error) {
        console.error('Error cargando Links:', error);
        try {
          const res = await api.get(`/linksIntExtAll/${this.idInstitucion}`);
          const filterLinks = res.data.filter(link => link.ei_estado == "1");
          this.$store.commit('setLinks', filterLinks);
        } catch (err) {
          console.error('Fallback failed:', err);
        }
      }
    },

    async getContenidoExtra() {
      try {
        const res = await api.get(`/institucion/${this.idInstitucion}/contenido`);
        const data = res.data;
        
        this.$store.commit('setAutoridades', data.autoridad?.map(this._limpiar) || []);
        this.$store.commit('setVideos', data.upea_videos?.map(this._limpiar) || []);
        
      } catch (error) {
        console.error('Error cargando contenido extra:', error);
      }
    },

    async getInstitucion() {
      try {
        const res = await api.get(`/institucionesPrincipal/${this.idInstitucion}`);
        const institucionData = res.data.Descripcion || res.data;
        
        this.$store.commit('setInstitucion', institucionData);
        
       // console.log(' Vuex - Institución:', institucionData.institucion_nombre);
        
      } catch (error) {
        console.error('Error getInstitucion:', error);
      }
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

    setImages(images) {
      if (this.slideInterval) clearInterval(this.slideInterval);
      
      const imageBaseUrl = this.imageUrl + "InstitucionUpea/Portada/";
      const banner = document.querySelector(".banner-img");
      
      if (!banner) return;
      
      if (images?.length > 0) {
        let currentIndex = 0;
        
        const changeImage = () => {
          const img = imageBaseUrl + images[currentIndex].portada_imagen;
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
        
     //   console.log(' Todos los datos cargados y commiteados a Vuex');
        
      } catch (error) {
        console.error(' Error en carga inicial:', error);
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