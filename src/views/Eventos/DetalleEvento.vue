<template>
  <!-- ==============================================
    ** Inner Banner **
    =================================================== -->
  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>{{ eventoData?.evento_titulo || 'Evento' }}</h1>
          </div>
          <h4>
            <router-link to="/">INICIO</router-link>
          </h4>
          <h5>
            <router-link to="/eventos">EVENTOS</router-link>
          </h5>
          <h3 v-if="eventoData?.evento_titulo">{{ eventoData.evento_titulo }}</h3>
        </div>
      </div>
    </div>
  </div>

  <!-- ==============================================
    ** Blog Detail **
    =================================================== -->
  <div class="container blog-wrapper padding-lg">
    <div class="row">
      <div class="col-sm-8 blog-left" v-if="eventoNotFound">
        <div class="single-blog-inner mb-0 text-center py-5">
          <i class="fa fa-calendar text-muted" style="font-size: 4rem; opacity: 0.3;"></i>
          <h2 class="mt-4">Evento no encontrado</h2>
          <p class="text-muted">
            El evento que buscas no está disponible o fue eliminado.
          </p>
          <router-link to="/eventos" class="btn btn-outline mt-3">
            ← Volver a eventos
          </router-link>
        </div>
      </div>

      <div class="col-sm-8 blog-left" v-else-if="eventoData">
        <ul class="blog-listing detail">
          <li> 
            <div 
              class="image-zoom-container"
              @click="openImageModal"
            >
              <!-- ✅ Imagen con URL segura -->
              <img
                :src="buildSafeImageUrl(eventoData.evento_imagen)"
                :alt="eventoData.evento_titulo || 'Imagen del evento'"
                class="img-responsive preview-image"
              />
              <span class="zoom-overlay">
                <i class="fa fa-search-plus"></i> Click para ampliar
              </span>
            </div>
            
            <h2>{{ eventoData.evento_titulo }}</h2>
            
            <ul class="post-detail">
              <li>
                <span class="icon-date-icon ico"></span>
                <span class="bold">{{ formatearFecha(eventoData.evento_fecha) }}</span>
              </li>
              <li v-if="eventoData.evento_lugar">
                <span class="fa fa-map-marker"></span>
                <span class="bold">Lugar: </span>
                {{ eventoData.evento_lugar }}
              </li>
              <li v-if="eventoData.evento_hora">
                <span class="fa fa-clock-o"></span>
                <span class="bold">Hora: </span>
                {{ eventoData.evento_hora }}
              </li>
              <li>
                <span class="label">
                  <router-link to="/eventos">
                    {{ eventoData.tipo_evento || eventoData.evento_tipo || 'EVENTO' }}
                  </router-link>
                </span>
              </li>
            </ul>
            
            <p class="left-aligned">Descripción del evento:</p>
            <!-- ✅ Sanitizar HTML antes de renderizar (protección XSS) -->
            <p class="left-aligned" v-html="$sanitize(eventoData.evento_descripcion)"></p>
            
            <div class="mt-4">
              <button @click="clickBack()" class="btn btn-outline">
                ← Volver
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div class="col-sm-8 blog-left" v-else>
        <div class="text-center py-5">
          <div class="spinner-border text-muted" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-muted">Cargando evento...</p>
        </div>
      </div>

      <div class="col-sm-4">
        <div class="blog-right">
          <SidebarCustom />
        </div>
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
        :src="buildSafeImageUrl(eventoData.evento_imagen)" 
        :alt="eventoData.evento_titulo"
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
.image-zoom-container:hover .zoom-overlay { opacity: 1; }
.zoom-overlay .fa-search-plus { font-size: 1rem; }
.image-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
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
  top: 30px; right: 30px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  width: 50px; height: 50px;
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
.bg-overlay-img { background-image: url("@/assets/Fondo2.jpg"); }
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
.post-detail .label a { color: inherit; text-decoration: none; }
.post-detail .bold { font-weight: 600; }
img.img-responsive { max-width: 100%; height: auto; }
.spinner-border { width: 3rem; height: 3rem; border-width: 0.25em; }
.visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes zoomIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
@media (max-width: 768px) {
  .modal-close-btn {
    top: 15px; right: 15px;
    width: 40px; height: 40px;
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
  name: "DetalleEvento",
  
  components: {
    SidebarCustom,
  },
  
  data() {
    return {
      showImageModal: false,
    };
  },
  
  computed: {
    ...mapState(["eventos", "url_api"]),

    // ✅ imageUrl: sin fallback en producción
    imageUrl() {
      const url = process.env.VUE_APP_UPLOADS_URL?.trim();
      if (process.env.VUE_APP_ENV === 'production' && !url) {
        console.error('❌ VUE_APP_UPLOADS_URL no definida en producción');
        return '';
      }
      return url || (process.env.VUE_APP_ENV !== 'production' ? 'https://apiadministrador.upea.bo' : '');
    },
    
    eventoData() {
      const eventoId = parseInt(this.$route.params.idEv);
      
      if (!eventoId || !this.eventos?.length) {
        return null;
      }
      const evento = this.eventos.find(e => e.evento_id === eventoId);
      if (!evento || !evento.evento_id) {
        return null;
      }
      
      return evento;
    },
    
    eventoNotFound() {
      return this.eventos?.length > 0 && !this.eventoData;
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