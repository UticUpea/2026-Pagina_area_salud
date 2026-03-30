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

      <!-- Sidebar -->
      <div class="col-sm-4">
        <SidebarCustom />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ✅ Tus estilos originales se mantienen 100% intactos */
.pdf-container {
  position: relative;
  max-height: 600px;
  overflow: hidden;
  border: 3px solid #000;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  background: #f8f9fa;
}
.pdf-wrapper {
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pdf-embed {
  width: 100%;
  height: 100%;
  display: block;
}
.pdf-fallback {
  text-align: center;
  padding: 2rem;
  color: #666;
}
.pdf-fallback .btn { margin-top: 1rem; }
.pdf-link {
  position: relative;
  display: block;
  text-decoration: none;
  color: inherit;
}
.pdf-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 8px 12px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  opacity: 0;
  transition: opacity 0.2s;
}
.pdf-link:hover .pdf-overlay { opacity: 1; }
.pdf-overlay .fa-external-link { font-size: 0.9rem; }

/* Estilos generales */
.bg-overlay-img { background-image: url("@/assets/Fondo2.jpg"); }
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
@media (max-width: 768px) {
  .pdf-container { max-height: 400px; }
  .post-detail {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>

<script>
import { mapState } from "vuex";
import SidebarCustom from "@/components/SidebarCustom.vue";
import VuePdfEmbed from "vue-pdf-embed";

export default {
  name: "DetalleGaceta",
  
  components: {
    SidebarCustom,
    VuePdfEmbed,
  },
  
  computed: {
    ...mapState(["gacetas", "url_api"]),

    // ✅ imageUrl: sin fallback en producción
    imageUrl() {
      const envUrl = process.env.VUE_APP_UPLOADS_URL;

      if (envUrl && typeof envUrl === 'string') {
        const clean = envUrl.trim();
        if (clean.endsWith('/uploads')) {
          return clean;
        }
        return clean;
      }

      // ✅ Solo fallback para desarrollo
      if (process.env.VUE_APP_ENV !== 'production') {
        return 'https://apiadministrador.upea.bo';
      }
      
      // ✅ Fallar claro en producción
      console.error('❌ VUE_APP_UPLOADS_URL no definida en producción');
      return '';
    },
    
    gacetaData() {
      try {
        const gacetaId = parseInt(this.$route.params.idGac);
        if (!gacetaId || !this.gacetas?.length) return null;
        const gaceta = this.gacetas.find(g => g?.gaceta_id === gacetaId);
        if (!gaceta || !gaceta.gaceta_id || !gaceta.gaceta_documento) return null;
        return gaceta;
      } catch (error) {
        // ✅ Logs genéricos en producción
        const isProd = process.env.VUE_APP_ENV === 'production';
        if (!isProd) console.warn('Error obteniendo gacetaData:', error);
        return null;
      }
    },

    gacetaNotFound() {
      return this.gacetas?.length > 0 && !this.gacetaData;
    },
    
    // ✅ pdfUrlValid: solo acepta URLs HTTPS
    pdfUrlValid() {
      if (!this.gacetaData?.gaceta_documento) return false;
      const url = this.documentoUrl(this.gacetaData.gaceta_documento);
      return url.startsWith('https://');
    },
  },
  
  methods: {
    // ✅ Construir URL segura para documentos PDF (fuerza HTTPS)
    documentoUrl(nombreArchivo) {
      if (!nombreArchivo) return '#';
      const cleaned = String(nombreArchivo).trim();
      
      // ✅ Si es URL absoluta, forzar HTTPS
      if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
        return cleaned.replace('http://', 'https://');
      }
      
      // ✅ Si es ruta relativa, unir con base URL
      if (cleaned.startsWith('/')) {
        const domain = this.imageUrl.replace(/\s+$/g, '');
        return `${domain}${cleaned}`;
      }
      const domain = this.imageUrl.replace(/\s+$/g, '');
      return `${domain}/${cleaned}`;
    },
    
    formatearFecha(fechaISO) {
      if (!fechaISO) return 'Fecha no disponible';
      const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
      const fecha = new Date(fechaISO);
      if (isNaN(fecha.getTime())) return fechaISO;
      return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    },
    
    // ✅ Logs genéricos en producción
    onPdfLoaded() {
      const isProd = process.env.VUE_APP_ENV === 'production';
      if (!isProd) console.log('✅ PDF cargado correctamente');
    },

    onPdfError(error) {
      const isProd = process.env.VUE_APP_ENV === 'production';
      if (!isProd) console.warn('⚠️ Error cargando PDF:', error);
    },

    clickBack() {
      this.$store.commit("clickLink");
      this.$router.go(-1);
    },
  },
  
  // ✅ Código debug eliminado para producción
  created() {
    this.$store.commit("loading");
  },
};
</script>