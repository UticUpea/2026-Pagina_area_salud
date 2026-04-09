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
            <a style="cursor: pointer" @click="clickBack()">INSTITUTO DE INVESTIGACIÓN</a>
          </h5>
          <h3 v-if="gacetaData?.gaceta_titulo">{{ gacetaData.gaceta_titulo }}</h3>
        </div>
      </div>
    </div>
  </div>

  <div class="container blog-wrapper padding-lg">
    <div class="row">
      
      <!-- No encontrado -->
      <div class="col-sm-8 blog-left" v-if="gacetaNotFound">
        <div class="single-blog-inner mb-0 text-center py-5">
          <i class="fa fa-file-pdf-o text-muted" style="font-size: 4rem; opacity: 0.3;"></i>
          <h2 class="mt-4">Documento no encontrado</h2>
          <p class="text-muted">
            El documento que buscas no está disponible o fue eliminado.
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
          <p class="mt-3 text-muted">Cargando documento...</p>
        </div>
      </div>

      <!-- Contenido disponible -->
      <div class="col-sm-8 blog-left" v-else-if="gacetaData">
        <ul class="blog-listing detail">
          <li>
            <div class="pdf-container">
              <a 
                :href="getDirectUrl(gacetaData.gaceta_documento)" 
                target="_blank"
                rel="noopener noreferrer"
                :title="'Descargar documento: ' + gacetaData.gaceta_titulo"
                class="pdf-link"
              >
                <div class="pdf-wrapper">
                  <VuePdfEmbed 
                    v-if="pdfUrlValid"
                    :source="getDirectUrl(gacetaData.gaceta_documento)" 
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
                      :href="getDirectUrl(gacetaData.gaceta_documento)"
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
</template>

<script>
import { mapState } from 'vuex';
import SidebarCustom from '@/components/SidebarCustom.vue';
import VuePdfEmbed from 'vue-pdf-embed';
import api from '@/plugins/axios';

export default {
  name: 'DetalleGacetaInstituto',
  
  components: { SidebarCustom, VuePdfEmbed },
  
  data() {
    return {
      loading: true,
      gacetasLocal: [],
    };
  },
  
  computed: {
    ...mapState(['Institucion']),

    gacetasList() {
      const vuexGacetas = this.Institucion?.upea_gaceta_universitaria || [];
      return vuexGacetas.length ? vuexGacetas : this.gacetasLocal;
    },

    gacetaId() {
      return parseInt(this.$route.params.id);
    },

    gacetaData() {
      if (!this.gacetaId || !this.gacetasList.length) return null;
      
      const gaceta = this.gacetasList.find(g => 
        g?.gaceta_id === this.gacetaId &&
        g?.gaceta_tipo?.toUpperCase().trim() === 'INSTITUTO DE INVESTIGACION'
      );
      
      return (gaceta?.gaceta_id && gaceta.gaceta_documento) ? gaceta : null;
    },

    gacetaNotFound() {
      return this.gacetasList.length > 0 && !this.gacetaData;
    },

    pdfUrlValid() {
      const url = this.getDirectUrl(this.gacetaData?.gaceta_documento);
      return url?.startsWith('https://');
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

    formatearFecha(fechaISO) {
      if (!fechaISO) return 'Fecha no disponible';
      const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      const fecha = new Date(fechaISO);
      return isNaN(fecha.getTime()) ? fechaISO : `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    },

    onPdfLoaded() {},
    onPdfError() {},

    clickBack() {
      this.$store.commit('clickLink');
      this.$router.go(-1);
    },

    async fetchGacetas() {
      try {
        const idInstitucion = process.env.VUE_APP_ID_INSTITUCION || '9';
        const res = await api.get(`/institucion/${idInstitucion}/gacetaEventos`);
        this.gacetasLocal = (res.data.upea_gaceta_universitaria || [])
          .filter(g => g?.gaceta_estado !== "0")
          .map(obj => {
            const cleaned = { ...obj };
            Object.keys(cleaned).forEach(key => {
              if (typeof cleaned[key] === 'string') cleaned[key] = cleaned[key].trim();
            });
            return cleaned;
          });
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[DetalleGacetaInstituto] Error:', error.message);
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
    this.fetchGacetas();
  },
  
  mounted() {
    this.applyDynamicColors();
  },
};
</script>

<style scoped>
.bg-overlay-img { background-image: url("@/assets/Fondo2.jpg"); }
.text-muted { color: #6c757d; }
.text-center { text-align: center; }
.py-5 { padding: 3rem 0; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }
.mb-0 { margin-bottom: 0; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

.btn { display: inline-block; padding: 8px 20px; border-radius: 4px; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; text-decoration: none; border: none; }
.btn-outline { background: transparent; border: 1px solid var(--main-color, #04246C); color: var(--main-color, #04246C); }
.btn-outline:hover { background: var(--main-color, #04246C); color: #fff; }
.btn-sm { padding: 4px 12px; font-size: 0.85rem; }

.post-detail { list-style: none; padding: 0; margin: 0 0 1rem; display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }
.post-detail li { font-size: 0.9rem; display: flex; align-items: center; gap: 0.3rem; }
.post-detail .label { background: var(--main-color, #04246C); color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 0.85rem; }
.post-detail .bold { font-weight: 600; }

.pdf-container { position: relative; width: 100%; max-width: 900px; margin: 0 auto 1.5rem; overflow: visible; border: 3px solid var(--main-color, #04246C); border-radius: 8px; background: #f8f9fa; padding: 0 15px; box-sizing: border-box; }
.pdf-wrapper { width: 100%; min-height: 600px; max-height: 80vh; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: 10px 0; background: #fff; border-radius: 4px; }
.pdf-embed { width: 100%; height: auto; min-height: 600px; display: block; object-fit: contain; }
.pdf-fallback { text-align: center; padding: 2rem; color: #666; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; min-height: 300px; }
.pdf-link { position: relative; display: block; text-decoration: none; color: inherit; width: 100%; }
.pdf-overlay { position: sticky; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.85); color: #fff; padding: 10px 12px; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem; opacity: 0; transition: opacity 0.2s; z-index: 10; border-radius: 0 0 4px 4px; }
.pdf-link:hover .pdf-overlay { opacity: 1; }

.spinner-border { width: 3rem; height: 3rem; border-width: 0.25em; border: 0.25em solid currentColor; border-right-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 767px) { .pdf-container { max-width: 100%; padding: 0 10px; } .pdf-wrapper { min-height: 400px; max-height: 70vh; } .post-detail { flex-direction: column; align-items: flex-start; gap: 0.5rem; } }
.pdf-wrapper::-webkit-scrollbar { width: 4px; }
.pdf-wrapper::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
.pdf-wrapper::-webkit-scrollbar-thumb { background: var(--main-color, #04246C); border-radius: 2px; }
</style>