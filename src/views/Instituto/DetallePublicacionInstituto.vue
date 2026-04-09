<template>
  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>{{ pubData?.publicaciones_titulo || 'Publicación' }}</h1>
          </div>
          <h4>
            <router-link to="/">INICIO</router-link>
          </h4>
          <h5>
            <a style="cursor: pointer" @click="clickBack()">INSTITUTO DE INVESTIGACIÓN</a>
          </h5>
          <h3 v-if="pubData?.publicaciones_titulo">{{ pubData.publicaciones_titulo }}</h3>
        </div>
      </div>
    </div>
  </div>

  <div class="container blog-wrapper padding-lg">
    <div class="row">
      
      <!-- No encontrado -->
      <div class="col-sm-8 blog-left" v-if="pubNotFound">
        <div class="single-blog-inner mb-0 text-center py-5">
          <i class="fa fa-newspaper-o text-muted" style="font-size: 4rem; opacity: 0.3;"></i>
          <h2 class="mt-4">Publicación no encontrada</h2>
          <p class="text-muted">
            La publicación que buscas no está disponible o fue eliminada.
          </p>
          <button @click="clickBack()" class="btn btn-outline mt-3">
            ← Volver al Instituto
          </button>
        </div>
      </div>

      <!-- Cargando -->
      <div class="col-sm-8 blog-left" v-else-if="loading">
        <div class="text-center py-5">
          <div class="spinner-border text-muted" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-muted">Cargando publicación...</p>
        </div>
      </div>


      <div class="col-sm-8 blog-left" v-else-if="pubData">
        <ul class="blog-listing detail">
          <li>
            <div class="image-zoom-container" @click="openImageModal">
              <img
                :src="getDirectUrl(pubData.publicaciones_imagen)"
                :alt="pubData.publicaciones_titulo"
                class="img-responsive preview-image"
                loading="lazy"
                @error="handleImageError"
              />
              <span class="zoom-overlay">
                <i class="fa fa-search-plus"></i> Click para ampliar
              </span>
            </div>
            
            <h2>{{ pubData.publicaciones_titulo }}</h2>
            
            <ul class="post-detail">
              <li>
                <span class="icon-date-icon ico"></span>
                <span class="bold">{{ formatearFecha(pubData.publicaciones_fecha) }}</span>
              </li>
              <li v-if="pubData.publicaciones_autor">
                <span class="fa fa-user"></span>
                <span class="bold">Autor: </span>
                {{ pubData.publicaciones_autor }}
              </li>
              <li>
                <span class="label">{{ pubData.publicaciones_tipo || 'Publicación' }}</span>
              </li>
            </ul>
            
            <p class="left-aligned">Descripción:</p>
            <p class="left-aligned" v-html="sanitizeHtml(pubData.publicaciones_descripcion)"></p>
            
            <div class="mt-4">
              <button @click="clickBack()" class="btn btn-outline">
                ← Volver al Instituto
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div class="col-sm-4">
        <SidebarCustom />
      </div>
    </div>
  </div>

  <!-- Modal de imagen -->
  <div v-if="showImageModal" class="image-modal-overlay" @click="closeImageModal">
    <div class="image-modal-content" @click.stop>
      <button class="modal-close-btn" @click="closeImageModal" aria-label="Cerrar">
        <i class="fa fa-times"></i>
      </button>
      <img :src="getDirectUrl(pubData.publicaciones_imagen)" :alt="pubData.publicaciones_titulo" class="modal-image" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SidebarCustom from '@/components/SidebarCustom.vue';
import api from '@/plugins/axios';

export default {
  name: 'DetallePublicacionInstituto',
  
  components: { SidebarCustom },
  
  data() {
    return {
      loading: true,
      showImageModal: false,
      publicacionesLocal: [],
    };
  },
  
  computed: {
    ...mapState(['Institucion']),

    publicacionesList() {
      const vuexPubs = this.Institucion?.upea_publicaciones || [];
      return vuexPubs.length ? vuexPubs : this.publicacionesLocal;
    },

    pubId() {
      return parseInt(this.$route.params.id);
    },

    pubData() {
      if (!this.pubId || !this.publicacionesList.length) return null;
      
      const pub = this.publicacionesList.find(p => 
        p?.publicaciones_id === this.pubId &&
        p?.publicaciones_tipo?.toUpperCase().trim() === 'INSTITUTO DE INVESTIGACION'
      );
      
      return (pub?.publicaciones_id && pub.publicaciones_imagen) ? pub : null;
    },

    pubNotFound() {
      return this.publicacionesList.length > 0 && !this.pubData;
    },
  },
  
  methods: {
    getDirectUrl(path) {
      if (!path || typeof path !== 'string') return '';
      const cleaned = path.trim();
      if (cleaned.startsWith('https://')) return cleaned;
      if (process.env.NODE_ENV === 'production' && cleaned.startsWith('http://')) {
        return cleaned.replace('http://', 'https://');
      }

    },

    sanitizeHtml(html) {
      if (!html || typeof html !== 'string') return '';
      return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '').replace(/javascript:/gi, '').slice(0, 3000);
    },

    formatearFecha(fechaISO) {
      if (!fechaISO) return 'Fecha no disponible';
      const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      const fecha = new Date(fechaISO);
      return isNaN(fecha.getTime()) ? fechaISO : `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    },

    handleImageError(event) {
      if (event?.target) event.target.style.display = 'none';
    },

    openImageModal() {
      this.showImageModal = true;
      document.body.style.overflow = 'hidden';
    },

    closeImageModal() {
      this.showImageModal = false;
      document.body.style.overflow = '';
    },

    handleEscapeKey(event) {
      if (event.key === 'Escape' && this.showImageModal) this.closeImageModal();
    },

    clickBack() {
      this.$store.commit('clickLink');
      this.$router.go(-1);
    },

    async fetchPublicaciones() {
      try {
        const idInstitucion = process.env.VUE_APP_ID_INSTITUCION || '9';
        const res = await api.get(`/institucion/${idInstitucion}/recursos`);
        this.publicacionesLocal = (res.data.upea_publicaciones || [])
          .filter(p => p?.publicaciones_estado !== "0")
          .map(obj => {
            const cleaned = { ...obj };
            Object.keys(cleaned).forEach(key => {
              if (typeof cleaned[key] === 'string') cleaned[key] = cleaned[key].trim();
            });
            return cleaned;
          });
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[DetallePublicacionInstituto] Error:', error.message);
        }
      } finally {
        this.loading = false;
      }
    },

    applyDynamicColors() {
      const colors = this.Institucion?.colorinstitucion;
      if (!colors?.length) return;
      const { color_primario, color_secundario, color_terciario } = colors[0];
      if (color_primario) document.documentElement.style.setProperty('--main-color', color_primario);
      if (color_secundario) document.documentElement.style.setProperty('--main-color-2', color_secundario);
      if (color_terciario) document.documentElement.style.setProperty('--main-color-3', color_terciario);
    },
  },
  
  watch: {
    Institucion: { handler() { this.applyDynamicColors(); }, deep: true, immediate: true }
  },
  
  created() {
    this.$store.commit('loading');
    this.applyDynamicColors();
    this.fetchPublicaciones();
  },
  
  mounted() {
    document.addEventListener('keydown', this.handleEscapeKey);
    this.applyDynamicColors();
  },
  
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEscapeKey);
    document.body.style.overflow = '';
  },
};
</script>

<style scoped>
/* Mismos estilos que DetalleEventoInstituto.vue */
.bg-overlay-img { background-image: url("@/assets/Fondo2.jpg"); }
.text-muted { color: #6c757d; }
.text-center { text-align: center; }
.py-5 { padding: 3rem 0; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }
.mb-0 { margin-bottom: 0; }
.left-aligned { text-align: left; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

.btn { display: inline-block; padding: 8px 20px; border-radius: 4px; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; text-decoration: none; border: none; }
.btn-outline { background: transparent; border: 1px solid var(--main-color, #04246C); color: var(--main-color, #04246C); }
.btn-outline:hover { background: var(--main-color, #04246C); color: #fff; }

.post-detail { list-style: none; padding: 0; margin: 0 0 1rem; display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }
.post-detail li { font-size: 0.9rem; display: flex; align-items: center; gap: 0.3rem; }
.post-detail .label { background: var(--main-color, #04246C); color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 0.85rem; }
.post-detail .bold { font-weight: 600; }

.image-zoom-container { position: relative; display: flex; justify-content: center; align-items: center; width: 100%; max-width: 800px; margin: 0 auto 1.5rem; cursor: zoom-in; overflow: visible; padding: 0 15px; box-sizing: border-box; }
.preview-image { width: 100%; height: auto; max-height: 60vh; max-width: 100%; object-fit: contain; border-radius: 8px; display: block; margin: 0 auto; transition: transform 0.2s ease; }
.image-zoom-container:hover .preview-image { transform: scale(1.02); }
.image-zoom-container:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
.zoom-overlay { position: absolute; bottom: 15px; right: 15px; background: rgba(0,0,0,0.7); color: #fff; padding: 8px 16px; border-radius: 20px; display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-size: 0.9rem; opacity: 0; transition: opacity 0.2s; pointer-events: none; z-index: 1; }
.image-zoom-container:hover .zoom-overlay { opacity: 1; }

.image-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeIn 0.3s ease; overflow-y: auto; padding: 40px 20px; }
.image-modal-content { position: relative; width: 100%; max-width: 90vw; max-height: 90vh; display: flex; align-items: center; justify-content: center; animation: zoomIn 0.3s ease; }
.modal-image { width: auto; height: auto; max-width: 100%; max-height: 90vh; object-fit: contain; border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); display: block; margin: 0 auto; }
.modal-close-btn { position: fixed; top: 30px; right: 30px; background: rgba(255,255,255,0.2); border: none; color: #fff; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; font-size: 2rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; z-index: 10000; }
.modal-close-btn:hover { background: rgba(255,255,255,0.3); transform: scale(1.1); }

.spinner-border { width: 3rem; height: 3rem; border-width: 0.25em; border: 0.25em solid currentColor; border-right-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes zoomIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }

@media (max-width: 767px) { .image-zoom-container { max-width: 100%; padding: 0 10px; } .preview-image { max-height: 50vh; } .modal-close-btn { top: 15px; right: 15px; width: 40px; height: 40px; font-size: 1.5rem; } .image-modal-overlay { padding: 20px 10px; } .post-detail { flex-direction: column; align-items: flex-start; gap: 0.5rem; } }
</style>