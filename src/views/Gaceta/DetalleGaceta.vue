<template>
  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>{{ gacetaData?.gaceta_titulo || 'Documento de Gaceta' }}</h1>
          </div>
          <h4>
            <router-link to="/">INICIO</router-link>
          </h4>
          <h5>
            <a style="cursor: pointer" @click="clickBack()">GACETA</a>
          </h5>
          <h3 v-if="gacetaData?.gaceta_titulo">{{ gacetaData.gaceta_titulo }}</h3>
        </div>
      </div>
    </div>
  </div>

  <div class="container blog-wrapper padding-lg">
    <div class="row">
      <div class="col-sm-8 blog-left" v-if="gacetaNotFound">
        <div class="single-blog-inner mb-0 text-center py-5">
          <i class="fa fa-file-pdf-o text-muted" style="font-size: 4rem; opacity: 0.3;"></i>
          <h2 class="mt-4">Documento no encontrado</h2>
          <p class="text-muted">
            El documento que buscas no está disponible o fue eliminado.
          </p>
          <button @click="clickBack()" class="btn btn-outline mt-3">
            ← Volver a la gaceta
          </button>
        </div>
      </div>

      <div class="col-sm-8 blog-left" v-else-if="gacetaData">
        <ul class="blog-listing detail">
          <li>
            <div class="pdf-container">
              <a 
                :href="documentoUrl(gacetaData.gaceta_documento)" 
                target="_blank"
                rel="noopener noreferrer"
                :title="'Descargar documento: ' + gacetaData.gaceta_titulo"
                class="pdf-link"
              >
                <div class="pdf-wrapper">
                  <VuePdfEmbed 
                    v-if="pdfUrlValid"
                    :source="documentoUrl(gacetaData.gaceta_documento)" 
                    :disableTextLayer="true"
                    :page="1"
                    :rotation="0"
                    class="pdf-embed"
                    @loaded="onPdfLoaded"
                    @error="onPdfError"
                  />
                  <div v-else class="pdf-fallback">
                    <i class="fa fa-file-pdf-o" style="font-size: 3rem;"></i>
                    <p class="mt-2">Vista previa no disponible</p>
                    <a 
                      :href="documentoUrl(gacetaData.gaceta_documento)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn btn-sm btn-outline"
                    >
                      <i class="fa fa-download"></i> Descargar PDF
                    </a>
                  </div>
                </div>
                <span class="pdf-overlay">
                  <i class="fa fa-external-link"></i> Abrir en nueva pestaña
                </span>
              </a>
            </div>

            <h2>{{ gacetaData.gaceta_titulo }}</h2>
            
            <ul class="post-detail">
              <li>
                <span class="icon-calander-icon ico"></span>
                <span class="bold">{{ formatearFecha(gacetaData.gaceta_fecha) }}</span>
              </li>
              <li v-if="gacetaData.gaceta_tipo">
                <span class="label">{{ gacetaData.gaceta_tipo }}</span>
              </li>
            </ul>

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
          <p class="mt-3 text-muted">Cargando documento...</p>
        </div>
      </div>

      <div class="col-sm-4">
        <SidebarCustom />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SidebarCustom from '@/components/SidebarCustom.vue';
import VuePdfEmbed from 'vue-pdf-embed';

export default {
  name: 'DetalleGaceta',
  
  components: {
    SidebarCustom,
    VuePdfEmbed,
  },
  
  computed: {
    ...mapState(['gacetas', 'Institucion']),

    imageUrl() {
      const url = process.env.VUE_APP_UPLOADS_URL?.trim();
      return (process.env.VUE_APP_ENV === 'production' && !url) ? '' : url;
    },
    
    gacetaData() {
      try {
        const gacetaId = parseInt(this.$route.params.idGac);
        if (!gacetaId || !this.gacetas?.length) return null;
        
        const gaceta = this.gacetas.find(g => g?.gaceta_id === gacetaId);
        return (gaceta?.gaceta_id && gaceta.gaceta_documento) ? gaceta : null;
      } catch {
        return null;
      }
    },

    gacetaNotFound() {
      return this.gacetas?.length > 0 && !this.gacetaData;
    },

    pdfUrlValid() {
      const url = this.documentoUrl(this.gacetaData?.gaceta_documento);
      return url?.startsWith('https://');
    },
  },
  
  methods: {
    documentoUrl(nombreArchivo) {
      if (!nombreArchivo) return '#';
      
      const cleaned = String(nombreArchivo).trim();
      
      if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
        return cleaned.replace('http://', 'https://');
      }

      const base = this.imageUrl?.replace(/\/$/, '');
      return base ? `${base}${cleaned.startsWith('/') ? cleaned : `/${cleaned}`}` : '#';
    },
    
    formatearFecha(fechaISO) {
      if (!fechaISO) return 'Fecha no disponible';
      
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                     'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const fecha = new Date(fechaISO);
      
      return isNaN(fecha.getTime()) 
        ? fechaISO 
        : `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    },
    
    onPdfLoaded() {
      // PDF cargado exitosamente
    },

    onPdfError() {
      // Manejo silencioso de errores en producción
    },

    clickBack() {
      this.$store.commit('clickLink');
      this.$router.go(-1);
    },

    applyDynamicColors() {
      const colors = this.Institucion?.colorinstitucion;
      if (!colors?.length) return;

      const { color_primario, color_secundario, color_terciario } = colors[0];
      
      if (color_primario) {
        document.documentElement.style.setProperty('--main-color', color_primario);
      }
      if (color_secundario) {
        document.documentElement.style.setProperty('--main-color-2', color_secundario);
      }
      if (color_terciario) {
        document.documentElement.style.setProperty('--main-color-3', color_terciario);
      }
    },
  },
  
  watch: {
    Institucion: {
      handler() { this.applyDynamicColors(); },
      deep: true,
      immediate: true,
    },
  },
  
  created() {
    this.$store.commit('loading');
    this.applyDynamicColors();
  },
  
  mounted() {
    this.applyDynamicColors();
  },
};
</script>

<style scoped>
.pdf-container {
  position: relative;
  width: 100%;
  max-width: 900px;
  margin: 0 auto 1.5rem;
  overflow: visible;
  border: 3px solid var(--main-color, #000);
  border-radius: 8px;
  background: #f8f9fa;
  padding: 0 15px;
  box-sizing: border-box;
}

.pdf-wrapper {
  width: 100%;
  min-height: 600px;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 10px 0;
  background: #fff;
  border-radius: 4px;
}

.pdf-embed {
  width: 100%;
  height: auto;
  min-height: 600px;
  display: block;
  object-fit: contain;
}

.pdf-fallback {
  text-align: center;
  padding: 2rem;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 300px;
}

.pdf-fallback .btn { margin-top: 0; }

.pdf-link {
  position: relative;
  display: block;
  text-decoration: none;
  color: inherit;
  width: 100%;
}

.pdf-overlay {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 10px 12px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
  border-radius: 0 0 4px 4px;
}

.pdf-link:hover .pdf-overlay { opacity: 1; }
.pdf-overlay .fa-external-link { font-size: 0.9rem; }

.bg-overlay-img { background-image: url('@/assets/Fondo2.jpg'); }
.text-muted { color: #6c757d; }
.text-center { text-align: center; }
.py-5 { padding: 3rem 0; }
.mt-2 { margin-top: 0.5rem; }
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

.btn-sm { padding: 4px 12px; font-size: 0.85rem; }

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
.post-detail a { color: inherit; text-decoration: none; }
.post-detail a:hover { color: var(--main-color-2, #0B1C6B); }

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

/* =========================================
   RESPONSIVE UNIVERSAL - TODAS LAS DIMENSIONES
   ========================================= */

/* Desktop grande (>1200px) */
@media (min-width: 1200px) {
  .pdf-container { max-width: 1000px; }
  .pdf-wrapper { min-height: 700px; }
}

/* Desktop estándar (992px - 1199px) */
@media (min-width: 992px) and (max-width: 1199px) {
  .pdf-container { max-width: 900px; }
  .pdf-wrapper { min-height: 650px; }
}

/* Tablet landscape (768px - 991px) */
@media (min-width: 768px) and (max-width: 991px) {
  .pdf-container { 
    max-width: 100%; 
    padding: 0 10px; 
  }
  .pdf-wrapper { 
    min-height: 500px; 
    max-height: 75vh; 
  }
  .pdf-embed { min-height: 500px; }
  .post-detail { gap: 0.8rem; }
}

/* Tablet portrait / Móvil grande (481px - 767px) */
@media (min-width: 481px) and (max-width: 767px) {
  .pdf-container { 
    max-width: 100%; 
    padding: 0 10px; 
  }
  .pdf-wrapper { 
    min-height: 400px; 
    max-height: 70vh; 
  }
  .pdf-embed { min-height: 400px; }
  .post-detail { 
    flex-direction: column; 
    align-items: flex-start; 
    gap: 0.5rem; 
  }
  .pdf-overlay { font-size: 0.8rem; padding: 8px 10px; }
}

/* Móvil pequeño (<480px) */
@media (max-width: 480px) {
  .pdf-container { 
    max-width: 100%; 
    padding: 0 5px; 
    border-width: 2px;
  }
  .pdf-wrapper { 
    min-height: 350px; 
    max-height: 65vh;
    padding: 5px 0;
  }
  .pdf-embed { min-height: 350px; }
  .pdf-fallback { 
    padding: 1.5rem; 
    min-height: 250px;
    gap: 0.8rem;
  }
  .pdf-fallback .fa-file-pdf-o { font-size: 2.5rem; }
  .pdf-fallback p { font-size: 0.9rem; }
  .pdf-fallback .btn { 
    padding: 6px 14px; 
    font-size: 0.8rem; 
  }
  .post-detail { 
    flex-direction: column; 
    align-items: flex-start; 
    gap: 0.4rem; 
  }
  .post-detail li { font-size: 0.85rem; }
  .post-detail .label { 
    padding: 3px 10px; 
    font-size: 0.8rem; 
  }
  .pdf-overlay { 
    font-size: 0.75rem; 
    padding: 6px 10px; 
    gap: 0.3rem;
  }
  .pdf-overlay .fa-external-link { font-size: 0.8rem; }
}

/* Altura de viewport pequeña (<600px) - todos los dispositivos */
@media (max-height: 600px) {
  .pdf-wrapper,
  .pdf-embed {
    max-height: 75vh;
    min-height: 300px;
  }
  .pdf-container { margin: 0 auto 1rem; }
}

/* Altura de viewport muy pequeña (<400px) */
@media (max-height: 400px) {
  .pdf-wrapper,
  .pdf-embed {
    max-height: 70vh;
    min-height: 250px;
  }
  .pdf-fallback { min-height: 200px; padding: 1rem; }
  .inner-banner { padding: 1rem 0; }
  .inner-banner h1 { font-size: 1.5rem; }
}

/* Scrollbar personalizado - todos los dispositivos */
.pdf-wrapper::-webkit-scrollbar { width: 4px; }
.pdf-wrapper::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
.pdf-wrapper::-webkit-scrollbar-thumb { background: var(--main-color, #c00014); border-radius: 2px; }
.pdf-wrapper::-webkit-scrollbar-thumb:hover { background: var(--main-color-2, #0B1C6B); }

/* Firefox scrollbar */
.pdf-wrapper { scrollbar-width: thin; scrollbar-color: var(--main-color, #c00014) #f1f1f1; }
</style>