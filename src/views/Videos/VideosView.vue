<template>
  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>VIDEOS DE LA CARRERA</h1>
          </div>
          <h4>
            <router-link to="/">INICIO</router-link>
          </h4>
          <h5>VIDEOS</h5>
        </div>
      </div>
    </div>
  </div>

  <div class="search-section">
    <div class="container">
      <div class="search-wrapper">
        <div class="search-input-group">
          <i class="fa fa-search search-icon" aria-hidden="true"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="onSearchInput"
            @keyup.enter="onSearchEnter"
            :placeholder="searchPlaceholder"
            class="search-input"
            aria-label="Buscar videos"
          />
          <button 
            v-if="searchQuery" 
            @click="clearSearch" 
            class="search-clear"
            aria-label="Limpiar búsqueda"
          >
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>
        <span class="search-results-count" v-if="searchQuery">
          {{ videosFiltrados.length }} resultado{{ videosFiltrados.length !== 1 ? 's' : '' }}
        </span>
      </div>
    </div>
  </div>

  <div class="container blog-wrapper padding-lg">

    <div v-if="videosFiltrados.length === 0" class="col-12 text-center py-5">
      <h2>SIN RESULTADOS</h2>
      <p class="text-muted">
        {{ searchQuery 
          ? `No se encontraron videos para "${searchQuery}"` 
          : 'Próximamente se agregarán nuevos contenidos multimedia.' 
        }}
      </p>
      <button v-if="searchQuery" @click="clearSearch" class="btn btn-secondary">
        Limpiar búsqueda
      </button>
    </div>

    <div v-else class="row">

      <div class="col-sm-8 blog-left">
        <div class="row">

          <div 
            v-for="(vid, id_vid) of videosPaginados"
            :key="vid.video_id || id_vid"
            class="col-xs-12 col-sm-6 mb-4"
          >
            <router-link 
              :to="'/detalleVideo/' + vid.video_id"
              @click="$store.commit('clickLink')"
              class="video-card-link"
            >
              <div class="video-card">
                <div class="video-wrapper">
                  <iframe
                    v-if="isSafeVideoUrl(vid.video_enlace)"
                    :src="vid.video_enlace?.trim()"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    loading="lazy"
                    style="border-radius: 5px; width: 100%; height: 100%;"
                    :title="vid.video_titulo"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
                    referrerpolicy="strict-origin-when-cross-origin"
                    @click.stop
                  />
                  <div v-else class="video-not-available">
                    <i class="fa fa-video-slash"></i>
                    <span>Video no disponible</span>
                  </div>
                </div>

                <div class="video-info">
                  <ul class="post-detail">
                    <li>
                      <span class="label">
                        {{ vid.video_tipo || 'VIDEO' }}
                      </span>
                    </li>
                    <li v-if="vid.video_fecha">
                      <small class="text-muted">{{ formatearFecha(vid.video_fecha) }}</small>
                    </li>
                  </ul>
                  
                  <h5 class="video-title">
                    {{ vid.video_titulo }}
                  </h5>

                  <p v-if="vid.video_breve_descripcion" class="video-desc text-muted small" v-html="$sanitize(vid.video_breve_descripcion)"></p>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <div v-if="pager > 1" class="text-center mt-4">
          <button @click.prevent="prevPage" :disabled="pag <= 1" class="btn btn-sm btn-outline">
            « Anterior
          </button>
          <span class="mx-3 font-weight-bold">{{ pag }} / {{ pager }}</span>
          <button @click.prevent="nextPage" :disabled="pag >= pager" class="btn btn-sm btn-outline">
            Siguiente »
          </button>
        </div>
      </div>

      <div class="col-sm-4">
        <div class="search-mobile-only mb-4">
          <div class="search-input-group">
            <i class="fa fa-search search-icon" aria-hidden="true"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              @input="onSearchInput"
              @keyup.enter="onSearchEnter"
              :placeholder="searchPlaceholder"
              class="search-input"
            />
            <button 
              v-if="searchQuery" 
              @click="clearSearch" 
              class="search-clear"
            >
              <i class="fa fa-times" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        
        <SidebarCustom />
      </div>
      
    </div>
  </div>
</template>

<script>
import SidebarCustom from "@/components/SidebarCustom.vue";
import { mapState } from "vuex";

export default {
  name: "VideosView",
  
  data() {
    return {
      NUM_RESULTS: 4,
      pag: 1,
      searchQuery: '',
      searchTimeout: null,
    };
  },
  
  components: { SidebarCustom },
  
  computed: {
    ...mapState(["videos", "url_api", "Institucion"]),

    imageUrl() {
      const url = process.env.VUE_APP_UPLOADS_URL?.trim();
      if (process.env.VUE_APP_ENV === 'production' && !url) {
        return '';
      }
      return url;
    },

    searchPlaceholder() {
      return 'Buscar videos por título...';
    },

    videosList() {
      return this.videos?.filter(v => v.video_estado === 1 || v.video_estado === "1") || [];
    },
    
    videosFiltrados() {
      const query = this.searchQuery.toLowerCase().trim();
      
      let filtrados = this.videosList;
      
      if (query) {
        filtrados = filtrados.filter(vid => {
          const titulo = vid.video_titulo?.toLowerCase() || '';
          const descripcion = vid.video_breve_descripcion?.toLowerCase() || '';
          return titulo.includes(query) || descripcion.includes(query);
        });
      }
      
      return filtrados;
    },

    pager() {
      return Math.ceil(this.videosFiltrados.length / this.NUM_RESULTS);
    },
    
    videosPaginados() {
      const start = (this.pag - 1) * this.NUM_RESULTS;
      const end = start + this.NUM_RESULTS;
      return this.videosFiltrados.slice(start, end);
    },
  },
  
  methods: {
    isSafeVideoUrl(url) {
      if (!url || typeof url !== 'string') return false;
      try {
        const normalized = url.startsWith('http') ? url : `https://${url}`;
        const parsed = new URL(normalized);
        if (parsed.protocol !== 'https:') return false;
        const allowed = ['youtube.com', 'youtu.be', 'vimeo.com', 'drive.google.com'];
        const hostname = parsed.hostname.replace(/^www\./, '');
        return allowed.some(d => hostname === d || hostname.endsWith(`.${d}`));
      } catch {
        return false;
      }
    },
    
    formatearFecha(fechaISO) {
      if (!fechaISO) return '';
      const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
      const fecha = new Date(fechaISO);
      if (isNaN(fecha.getTime())) return fechaISO;
      return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    },

    onSearchInput() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => { this.pag = 1; }, 300);
    },
    
    onSearchEnter() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout);
      this.pag = 1;
    },
    
    clearSearch() {
      this.searchQuery = '';
      this.pag = 1;
      this.$nextTick(() => {
        const input = document.querySelector('.search-input');
        if (input) input.focus();
      });
    },

    updatePager() {
      if (this.pag > this.pager && this.pager > 0) this.pag = this.pager;
      if (this.pag < 1) this.pag = 1;
    },
    
    prevPage() {
      if (this.pag > 1) {
        this.pag--;
        this.scrollToTop();
      }
    },
    
    nextPage() {
      if (this.pag < this.pager) {
        this.pag++;
        this.scrollToTop();
      }
    },
    
    goToPage(page) {
      if (page >= 1 && page <= this.pager) {
        this.pag = page;
        this.scrollToTop();
      }
    },
    
    scrollToTop() {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    },
    
    applyDynamicColors() {
      const colors = this.Institucion?.colorinstitucion;
      if (colors && colors.length > 0) {
        const colorSet = colors[0];
        if (colorSet.color_primario) {
          document.documentElement.style.setProperty('--main-color', colorSet.color_primario);
        }
        if (colorSet.color_secundario) {
          document.documentElement.style.setProperty('--main-color-2', colorSet.color_secundario);
        }
        if (colorSet.color_terciario) {
          document.documentElement.style.setProperty('--main-color-3', colorSet.color_terciario);
        }
      }
    },
  },
  
  watch: {
    videosFiltrados: {
      handler() { this.updatePager(); },
      immediate: true
    },
    searchQuery: {
      handler() { this.pag = 1; },
    },
    Institucion: {
      handler() { this.applyDynamicColors(); },
      deep: true,
      immediate: true
    }
  },
  
  created() {
    this.$store.commit("loading");
    this.applyDynamicColors();
    this.updatePager();
  },
  
  mounted() {
    this.applyDynamicColors();
  },
  
  beforeUnmount() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
  },
};
</script>

<style scoped>
.search-section { background: #f8f9fa; padding: 1rem 0; border-bottom: 1px solid #eee; }
.search-wrapper { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.search-input-group { position: relative; width: 100%; max-width: 600px; }
.search-input { width: 100%; padding: 12px 40px 12px 45px; border: 2px solid #ddd; border-radius: 25px; font-size: 1rem; transition: all 0.3s ease; background: #fff; }
.search-input:focus { outline: none; border-color: var(--main-color, #c00014); box-shadow: 0 0 0 3px rgba(192, 0, 20, 0.1); }
.search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #999; font-size: 1rem; pointer-events: none; }
.search-clear { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #999; cursor: pointer; padding: 5px; font-size: 1rem; transition: color 0.2s; }
.search-clear:hover { color: var(--main-color, #c00014); }
.search-results-count { font-size: 0.9rem; color: #666; }
@media (min-width: 768px) { .search-mobile-only { display: none; } .search-section { display: block; } }
@media (max-width: 767px) { .search-section { display: none; } .search-mobile-only { display: block; margin-bottom: 1.5rem; padding: 0 15px; } .search-mobile-only .search-input-group { max-width: 100%; } .search-mobile-only .search-input { padding: 10px 35px 10px 40px; font-size: 0.95rem; } }
.blog-wrapper > .row { display: flex; flex-wrap: wrap; align-items: flex-start; }
.blog-left { display: flex; flex-direction: column; }
.blog-left > .row { display: flex; flex-wrap: wrap; margin: 0 -15px; }
.blog-left > .row > [class*="col-"] { padding: 0 15px; }
.video-card-link { display: block; text-decoration: none; color: inherit; transition: transform 0.2s, box-shadow 0.2s; }
.video-card-link:hover { transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); }
.video-card-link iframe { pointer-events: none; }
.video-not-available { pointer-events: auto; }
.video-card { background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); height: 100%; display: flex; flex-direction: column; }
.video-wrapper { position: relative; width: 100%; padding-top: 56.25%; background: #000; }
.video-wrapper iframe, .video-not-available { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.9rem; }
.video-not-available { background: #1a1a1a; flex-direction: column; gap: 0.5rem; }
.video-not-available i { font-size: 2rem; opacity: 0.5; }
.video-info { padding: 1rem; flex: 1; display: flex; flex-direction: column; }
.video-title { font-size: 1.3rem; font-weight: 600; margin: 0.75rem 0 0.5rem; line-height: 1.4; min-height: 2.8rem; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.video-desc { font-size: 1rem; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
.text-muted { color: #495158; }
.font-weight-bold { font-weight: 600; }
.mt-4 { margin-top: 1.5rem; }
.mx-3 { margin: 0 0.75rem; }
.mb-4 { margin-bottom: 1.5rem; }
.btn { padding: 6px 16px; border-radius: 4px; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
.btn-outline { background: transparent; border: 1px solid var(--main-color, #c00014); color: var(--main-color, #c00014); }
.btn-outline:hover:not(:disabled) { background: var(--main-color, #c00014); color: #fff; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { background: #6c757d; color: #fff; }
.btn-secondary:hover { background: #5a6268; }
.btn-sm { padding: 4px 12px; font-size: 0.85rem; }
.post-detail { list-style: none; padding: 0; margin: 0; display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }
.post-detail li { font-size: 1.9rem; display: flex; align-items: center; gap: 0.3rem; }
.post-detail .label { background: var(--main-color, #c00014); color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 0.85rem; }
iframe { max-width: 100%; border: none; }
@media (max-width: 767px) {
  .blog-left > .row { margin: 0; }
  .blog-left > .row > [class*="col-"] { flex: 0 0 100%; max-width: 100%; padding: 0 0 1.5rem; }
  .video-title { min-height: auto; -webkit-line-clamp: 3; line-clamp: 3; }
}
</style>