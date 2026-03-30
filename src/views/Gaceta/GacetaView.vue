<template>
  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>DOCUMENTOS EXISTENTES EN LA GACETA DE LA CARRERA.</h1>
          </div>
          <h4>
            <router-link to="/">INICIO</router-link>
          </h4>
          <h3>GACETA</h3>
        </div>
      </div>
    </div>
  </div>

  <div class="container blog-wrapper padding-lg">
    <div class="row">
      <div class="col-sm-8 blog-left">
        
        <!-- Estado vacío -->
        <div v-if="gacetasList.length === 0" class="text-center py-5">
          <h2>SIN GACETA</h2>
          <p class="text-muted">Próximamente se agregarán nuevos documentos a la gaceta.</p>
        </div>

        <ul v-else class="row news-listing">
          <li
            v-for="(gac, index) of gacetasPaginadas"
            :key="gac.gaceta_id || index"
            class="col-xs-6 col-sm-6 grid-item"
          >
            <div class="inner">
              <div class="image-container">

                <a
                  :href="documentoUrl(gac.gaceta_documento)"
                  target="_blank"
                  rel="noopener noreferrer"
                  :title="'Ver documento: ' + gac.gaceta_titulo"
                >
                  <!-- ✅ PDF embed con manejo de carga y error -->
                  <VuePdfEmbed
                    :source="documentoUrl(gac.gaceta_documento)"
                    :page="1"
                    :disableTextLayer="true"
                    :rotation="0"
                    :height="400"
                    class="pdf-preview"
                    @loaded="onPdfLoaded"
                    @error="onPdfError"
                  />
                </a>
              </div>

              <div class="cnt-block">
                <ul class="post-detail">
                  <li><span class="label">Gaceta</span></li>
                  <li class="comnt bg-base">
                    <span class="icon-date-icon ico"></span>
                    <span class="bold">Fecha: </span>
                    {{ formatearFecha(gac.gaceta_fecha) }}
                  </li>
                </ul>
                
                <h2 style="height: 100px;">
                  <router-link
                    :to="'/detalleGaceta/' + gac.gaceta_id"
                    @click="$store.commit('clickLink')"
                  >
                    {{ gac.gaceta_titulo }}
                  </router-link>
                </h2>
                
                <router-link
                  :to="'/detalleGaceta/' + gac.gaceta_id"
                  @click="$store.commit('clickLink')"
                  class="read-more"
                >
                  <span class="icon-play-icon"></span>
                  Ver Documento
                </router-link>
              </div>
            </div>
          </li>
        </ul>

        <!-- Paginación -->
        <div class="text-center mt-4" v-if="pager > 1">
          <ul class="pagination blue justify-content-center">
            <li class="pagination-arrow" :class="{ disable: pag <= 1 }">
              <a href="#" aria-label="Previous" @click.prevent="prevPage">
                <span aria-hidden="true">
                  <i class="fa fa-angle-left" aria-hidden="true"></i>
                </span>
              </a>
            </li>

            <li v-for="i in pager" :key="i" :class="{ active: i === pag }">
              <a href="#" @click.prevent="goToPage(i)">
                {{ i }}
              </a>
            </li>

            <li class="pagination-arrow" :class="{ disable: pag >= pager }">
              <a href="#" aria-label="Next" @click.prevent="nextPage">
                <span aria-hidden="true">
                  <i class="fa fa-angle-right" aria-hidden="true"></i>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-sm-4">
        <SidebarCustom />
      </div>

    </div>
  </div>
</template>

<style scoped>
/* ✅ Tus estilos originales se mantienen 100% intactos */
.bg-overlay-img {
  background-image: url("@/assets/Fondo2.jpg");
}
.text-muted { color: #6c757d; }
.text-center { text-align: center; }
.py-5 { padding: 3rem 0; }
.mt-4 { margin-top: 1.5rem; }

/* Paginación */
.pagination.blue {
  display: flex;
  gap: 0.25rem;
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: center;
}
.pagination.blue li a {
  display: block;
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #333;
  text-decoration: none;
  transition: all 0.2s;
}
.pagination.blue li.active a {
  background: var(--main-color, #c00014);
  color: #fff;
  border-color: var(--main-color, #c00014);
}
.pagination.blue li.disable a {
  opacity: 0.5;
  cursor: not-allowed;
}
.pagination.blue li a:hover:not(.disable) {
  background: var(--main-color, #c00014);
  color: #fff;
}

/* PDF preview */
.pdf-preview {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}
.pdf-preview:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
.image-container {
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Post detail */
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
.post-detail .comnt.bg-base {
  background: var(--main-color, #c00014);
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
}

/* Leer más */
.read-more {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--main-color, #c00014);
  text-decoration: none;
  font-weight: 500;
  margin-top: 0.5rem;
  transition: gap 0.2s;
}
.read-more:hover {
  gap: 0.6rem;
  color: #a00010;
}
.read-more .icon-play-icon { font-size: 0.9rem; }

.grid-item { margin-bottom: 1.5rem; }
.grid-item .inner {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  transition: box-shadow 0.2s;
}
.grid-item .inner:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Mensaje de error de PDF */
.pdf-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6c757d;
  font-size: 0.9rem;
  text-align: center;
  padding: 1rem;
}
</style>

<script>
import { mapState } from "vuex";
import SidebarCustom from "@/components/SidebarCustom.vue";
import VuePdfEmbed from "vue-pdf-embed";

export default {
  name: "GacetaView",
  
  data() {
    return {
      NUM_RESULTS: 4,
      pag: 1,
    };
  },
  
  components: {
    SidebarCustom,
    VuePdfEmbed,
  },
  
  computed: {
    ...mapState(["gacetas", "url_api"]),
    
    // ✅ imageUrl: sin fallback en producción
    imageUrl() {
      const url = process.env.VUE_APP_UPLOADS_URL?.trim();
      if (process.env.VUE_APP_ENV === 'production' && !url) {
        console.error('❌ VUE_APP_UPLOADS_URL no definida en producción');
        return '';
      }
      return url || (process.env.VUE_APP_ENV !== 'production' ? 'https://apiadministrador.upea.bo' : '');
    },

    gacetasList() {
      return this.gacetas?.filter(g => g.gaceta_id && g.gaceta_documento) || [];
    },
    
    pager() {
      return Math.ceil(this.gacetasList.length / this.NUM_RESULTS);
    },
    
    gacetasPaginadas() {
      const start = (this.pag - 1) * this.NUM_RESULTS;
      const end = start + this.NUM_RESULTS;
      return this.gacetasList.slice(start, end);
    },
  },
  
  methods: {
    // ✅ Construir URL segura para documentos PDF (fuerza HTTPS)
    documentoUrl(nombreArchivo) {
      if (!nombreArchivo) return '#';
      const cleaned = String(nombreArchivo).trim();
      
      // Si es URL absoluta, forzar HTTPS
      if (cleaned.startsWith('http')) {
        return cleaned.replace('http://', 'https://');
      }
      
      // Si es ruta relativa, unir con base URL
      const base = this.imageUrl?.replace(/\/$/, '');
      return `${base}${cleaned.startsWith('/') ? cleaned : `/${cleaned}`}`;
    },
    
    formatearFecha(fechaISO) {
      if (!fechaISO) return 'Fecha no disponible';
      const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
      const fecha = new Date(fechaISO);
      if (isNaN(fecha.getTime())) return fechaISO;
      return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    },
    
    onPdfLoaded() {},
    onPdfError(error) { 
      // ✅ Logs genéricos en producción
      const isProd = process.env.VUE_APP_ENV === 'production';
      if (!isProd) console.warn('Error cargando PDF:', error);
    },
    
    goToPage(page) {
      if (page >= 1 && page <= this.pager) {
        this.pag = page;
        this.scrollToTop();
      }
    },
    prevPage() { if (this.pag > 1) { this.pag--; this.scrollToTop(); } },
    nextPage() { if (this.pag < this.pager) { this.pag++; this.scrollToTop(); } },
    scrollToTop() {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    },
  },
  
  watch: {
    gacetasList: { handler() { if (this.pag > this.pager) this.pag = 1; }, immediate: true },
  },
  
  created() {
    this.$store.commit("loading");
  },
};
</script>