<template>
  <!-- ==============================================
    ** Inner Banner **
    =================================================== -->
  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>{{ convocatoriaData?.con_titulo || 'Convocatoria' }}</h1>
            <h4>
              <router-link to="/">INICIO</router-link>
            </h4>
            <h5>
              <a style="cursor: pointer" @click="clickBack()">
                {{ convocatoriaData?.tipo_conv_comun?.tipo_conv_comun_titulo || convocatoriaData?.tipo_conv_comun_titulo || 'Convocatorias' }}
              </a>
            </h5>
            <h3 v-if="convocatoriaData?.con_titulo">{{ convocatoriaData.con_titulo }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==============================================
    ** Blog Detail **
    =================================================== -->
  <div class="container blog-wrapper padding-lg">

    <div class="col-lg-8 col-12" v-if="convocatoriaNotFound">
      <div class="single-blog-inner mb-0 text-center py-5">
        <i class="fa fa-file-text-o text-muted" style="font-size: 4rem; opacity: 0.3;"></i>
        <h2 class="mt-4">Convocatoria no encontrada</h2>
        <p class="text-muted">
          La convocatoria que buscas no está disponible o fue eliminada.
        </p>
        <router-link to="/convocatorias" class="btn btn-outline mt-3">
          ← Volver a convocatorias
        </router-link>
      </div>
    </div>

    <div class="row" v-else-if="convocatoriaData">

      <div class="col-sm-8 blog-left">
        <ul class="blog-listing detail">
          <li>
            <div 
              class="image-zoom-container"
              @click="openImageModal"
            >
              <!-- ✅ Imagen con URL segura -->
              <img
                :src="buildSafeImageUrl(convocatoriaData.con_foto_portada)"
                :alt="convocatoriaData.con_titulo || 'Imagen de convocatoria'"
                class="img-responsive preview-image"
              />
              <span class="zoom-overlay">
                <i class="fa fa-search-plus"></i> Click para ampliar
              </span>
            </div>
            
            <ul class="post-detail">
              <li>
                <span class="icon-date-icon ico"></span>
                <span class="bold">Fecha de Inicio: </span> 
                {{ formatearFecha(convocatoriaData.con_fecha_inicio) }}
              </li>
              <li>
                <span class="icon-date-icon ico"></span>
                <span class="bold">Fecha de Final: </span> 
                {{ formatearFecha(convocatoriaData.con_fecha_fin) }}
              </li>
              <li>
                <span class="label">
                  {{ convocatoriaData.tipo_conv_comun?.tipo_conv_comun_titulo || convocatoriaData.tipo_conv_comun_titulo || 'CONVOCATORIA' }}
                </span>
              </li>
            </ul>
            
            <!-- ✅ Sanitizar HTML antes de renderizar (protección XSS) -->
            <div class="imp-quote">
              <p v-html="$sanitize(convocatoriaData.con_descripcion)"></p>
            </div>
            
            <div class="mt-4">
              <button @click="clickBack()" class="btn btn-outline">
                ← Volver
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div class="col-sm-4">
        <SidebarCustom />
      </div>
    </div>

    <div class="row" v-else>
      <div class="col-sm-8 blog-left text-center py-5">
        <div class="spinner-border text-muted" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-muted">Cargando convocatoria...</p>
      </div>
      <div class="col-sm-4">
        <SidebarCustom />
      </div>
    </div>
  </div>

  <div 
    v-if="showImageModal" 
    class="image-modal-overlay"
    @click="closeImageModal"
  >
    <div class="image-modal-content" @click.stop>
      <button class="modal-close-btn" @click="closeImageModal">
        <i class="fa fa-times"></i>
      </button>
      <!-- ✅ Imagen modal con URL segura -->
      <img 
        :src="buildSafeImageUrl(convocatoriaData.con_foto_portada)" 
        :alt="convocatoriaData.con_titulo"
        class="modal-image"
      />
    </div>
  </div>
</template>

<style scoped>
/* ✅ Tus estilos originales se mantienen 100% intactos */
.blog-listing,
.blog-listing li,
.blog-left,
.col-sm-8,
.container,
.row {
  overflow: visible !important;
  max-height: none !important;
  height: auto !important;
}
.image-zoom-container {
  position: relative;
  display: block;
  width: 100%;
  margin-bottom: 1.5rem;
  cursor: zoom-in;
  overflow: visible !important;
}
.preview-image {
  width: 100%;
  height: auto !important;
  max-height: none !important;
  max-width: 100% !important;
  object-fit: contain !important;
  border-radius: 8px;
  display: block;
}
.image-zoom-container:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
.zoom-overlay {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}
.image-zoom-container:hover .zoom-overlay {
  opacity: 1;
}
.zoom-overlay .fa-search-plus {
  font-size: 1rem;
}
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
  overflow-y: auto;
  padding: 40px 20px;
}
.image-modal-content {
  position: relative;
  width: 100%;
  max-width: 500px;
  animation: zoomIn 0.3s ease;
}
.modal-image {
  width: 100%;
  height: auto;
  max-height: none;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  display: block;
}
.modal-close-btn {
  position: fixed;
  top: 30px;
  right: 30px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10000;
}
.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}
.bg-overlay-img {
  background-image: url("@/assets/Fondo2.jpg");
}
.text-muted { color: #6c757d; }
.text-center { text-align: center; }
.py-5 { padding: 3rem 0; }
.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }
.mb-0 { margin-bottom: 0; }
.btn {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  border: none;
}
.btn-outline {
  background: transparent;
  border: 1px solid var(--main-color, #c00014);
  color: var(--main-color, #c00014);
}
.btn-outline:hover {
  background: var(--main-color, #c00014);
  color: #fff;
}
.post-detail {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}
.post-detail li {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.post-detail .label {
  background: var(--main-color, #c00014);
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
}
.post-detail .bold { font-weight: 600; }
img.img-responsive { max-width: 100%; height: auto; }
.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.25em;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes zoomIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
@media (max-width: 768px) {
  .modal-close-btn {
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
  .image-modal-overlay { padding: 20px 10px; }
}
@media (max-height: 600px) {
  .image-modal-overlay { padding: 60px 10px 20px; }
}
</style>

<script>
import { mapState } from "vuex";
import SidebarCustom from "@/components/SidebarCustom.vue";

export default {
  name: "DetalleConvocatoria",
  
  components: {
    SidebarCustom,
  },
  
  data() {
    return {
      showImageModal: false,
    };
  },
  
  computed: {
    ...mapState(["convocatorias", "url_api"]),
    
    // ✅ imageUrl: sin fallback en producción
    imageUrl() {
      const url = process.env.VUE_APP_UPLOADS_URL?.trim();
      if (process.env.VUE_APP_ENV === 'production' && !url) {
        console.error('❌ VUE_APP_UPLOADS_URL no definida en producción');
        return '';
      }
      return url || (process.env.VUE_APP_ENV !== 'production' ? 'https://apiadministrador.upea.bo' : '');
    },
    
    convocatoriaData() {
      const convId = parseInt(this.$route.params.idConv);
      
      if (!convId || !this.convocatorias?.length) {
        return null;
      }
      
      const convocatoria = this.convocatorias.find(c => c.idconvocatorias === convId);
      
      if (!convocatoria || !convocatoria.idconvocatorias || !convocatoria.con_foto_portada) {
        return null;
      }
      
      return convocatoria;
    },
    
    convocatoriaNotFound() {
      return this.convocatorias?.length > 0 && !this.convocatoriaData;
    },
  },
  
  methods: {
    // ✅ Construir URL de imagen segura (fuerza HTTPS)
    buildSafeImageUrl(path) {
      if (!path) return '';
      const cleaned = String(path).trim();
      // Si ya es URL absoluta, forzar HTTPS
      if (cleaned.startsWith('http')) {
        return cleaned.replace('http://', 'https://');
      }
      // Si es ruta relativa, unir con base URL
      const base = this.imageUrl?.replace(/\/$/, '');
      return `${base}${cleaned.startsWith('/') ? cleaned : `/${cleaned}`}`;
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
      if (event.key === 'Escape' && this.showImageModal) {
        this.closeImageModal();
      }
    },
    
    formatearFecha(fechaISO) {
      if (!fechaISO) return 'Fecha no disponible';
      const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
      const fecha = new Date(fechaISO);
      if (isNaN(fecha.getTime())) return fechaISO;
      return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    },
    
    clickBack() {
      this.$store.commit("clickLink");
      this.$router.go(-1);
    },
  },
  
  mounted() {
    document.addEventListener('keydown', this.handleEscapeKey);
  },
  
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEscapeKey);
    document.body.style.overflow = '';
  },
  
  created() {
    this.$store.commit("loading");
  },
};
</script>