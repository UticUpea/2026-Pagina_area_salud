<template>
  <div>
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
            <h3 v-if="videoData?.video_titulo">{{ videoData.video_titulo }}</h3>
          </div>
        </div>
      </div>
    </div>
    <br>

    <div class="main-blog-area pd-top-120 pd-bottom-120">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-12" v-if="videoNotFound">
            <div class="single-blog-inner mb-0 text-center">
              <div class="thumb">
                <i class="fa fa-film text-muted" style="font-size: 4rem; opacity: 0.3;"></i>
              </div>
              <h2 class="mt-4">Video no encontrado</h2>
              <p class="text-muted">
                El video que buscas no está disponible o fue eliminado.
              </p>
              <router-link to="/videos" class="btn btn-primary mt-3">
                ← Volver a la lista de videos
              </router-link>
            </div>
          </div>

          <div class="col-lg-8 col-12" v-else-if="videoData">
            <div class="single-blog-inner mb-0">
              <div class="thumb">
                <iframe
                  v-if="isSafeVideoUrl(videoData.video_enlace)"
                  :src="getEmbedUrl(videoData.video_enlace)"
                  style="width: 100%; aspect-ratio: 16/9; border-radius: 10px;"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowfullscreen
                  loading="lazy"
                  :title="videoData.video_titulo"
                  referrerpolicy="strict-origin-when-cross-origin"
                />
                <div v-else class="text-center py-3 text-muted">
                  <i class="fa fa-video-slash"></i> Video no disponible
                </div>
              </div>
              <div class="details">
                <div class="blog-meta border-0 mt-0 pt-0">
                  <ul>
                    <li class="comnt bg-base">
                      {{ videoData.video_tipo || 'VIDEO' }}
                    </li>
                    <li v-if="videoData.video_fecha" class="text-muted">
                      <small>{{ formatearFecha(videoData.video_fecha) }}</small>
                    </li>
                  </ul>
                </div>
                <h4 class="mb-0">{{ videoData.video_titulo }}</h4>
              </div>
            </div>
            
            <div class="blog-content-inner">
              <p v-if="videoData.video_breve_descripcion" 
                 v-html="$sanitize(videoData.video_breve_descripcion)"></p>
              <p v-else class="text-muted">
                Sin descripción disponible.
              </p>
            </div>
            
            <div class="mt-4">
              <button @click="$router.go(-1)" class="btn btn-outline">
                ← Volver
              </button>
            </div>
          </div>
          <br>
          <div class="col-lg-4 col-12">
            <div class="td-sidebar">
              <SidebarCustom />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SidebarCustom from '@/components/SidebarCustom.vue';

export default {
  name: 'DetalleVideo',
  
  data() {
    return {
      searchQuery: '',
      searchTimeout: null,
    };
  },
  
  components: {
    SidebarCustom,
  },
  
  computed: {
    ...mapState(['videos', 'Institucion']),
    
    videoData() {
      const videoId = parseInt(this.$route.params.idVid);
      if (!videoId || !this.videos?.length) return null;
      const video = this.videos.find(v => v.video_id === videoId);
      if (!video || (video.video_estado !== 1 && video.video_estado !== '1')) return null;
      return video;
    },

    videoNotFound() {
      return !this.videoData;
    },

    videosFiltrados() {
      const query = this.searchQuery.toLowerCase().trim();
      if (!query) return this.videos || [];
      return (this.videos || []).filter(vid => {
        const titulo = vid.video_titulo?.toLowerCase() || '';
        return titulo.includes(query);
      });
    },
  },
  
  methods: {
    getEmbedUrl(url) {
      if (!url) return '';
      const cleaned = url.trim();
      
      if (cleaned.includes('/embed/')) {
        return cleaned.replace('http://', 'https://');
      }
      
      const watchMatch = cleaned.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      if (watchMatch && watchMatch[1]) {
        return `https://www.youtube.com/embed/${watchMatch[1]}`;
      }
      
      const idMatch = cleaned.match(/[?&]v=([^&\s]+)/);
      if (idMatch && idMatch[1]) {
        return `https://www.youtube.com/embed/${idMatch[1]}`;
      }
      
      if (cleaned.includes('vimeo.com') && !cleaned.includes('/video/')) {
        const vimeoMatch = cleaned.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch && vimeoMatch[1]) {
          return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }
      }
      
      if (cleaned.includes('drive.google.com') && !cleaned.includes('/preview')) {
        return cleaned.replace('/view', '/preview').replace('http://', 'https://');
      }
      
      return cleaned.replace('http://', 'https://');
    },

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
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                     'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const fecha = new Date(fechaISO);
      return isNaN(fecha.getTime()) 
        ? fechaISO 
        : `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    },

    onSearchInput() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {}, 300);
    },
    
    onSearchEnter() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout);
    },
    
    clearSearch() {
      this.searchQuery = '';
      this.$nextTick(() => {
        const input = document.querySelector('.search-input');
        if (input) input.focus();
      });
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
  
  beforeUnmount() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
  },
};
</script>

<style scoped>
.search-section {
  background: #f8f9fa;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.search-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.search-input-group {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 45px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fff;
}

.search-input:focus {
  outline: none;
  border-color: var(--main-color, #c00014);
  box-shadow: 0 0 0 3px rgba(192, 0, 20, 0.1);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 1rem;
  pointer-events: none;
}

.search-clear {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 5px;
  font-size: 1rem;
  transition: color 0.2s;
}

.search-clear:hover {
  color: var(--main-color, #c00014);
}

.search-results-count {
  font-size: 0.9rem;
  color: #666;
}

@media (min-width: 768px) {
  .search-mobile-only { display: none; }
  .search-section { display: block; }
}

@media (max-width: 767px) {
  .search-section { display: none; }
  .search-mobile-only {
    display: block;
    margin-bottom: 1.5rem;
    padding: 0 15px;
  }
  .search-mobile-only .search-input-group { max-width: 100%; }
  .search-mobile-only .search-input {
    padding: 10px 35px 10px 40px;
    font-size: 0.95rem;
  }
}

.text-muted { color: #6c757d; }
.text-center { text-align: center; }
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

.btn-primary {
  background: var(--main-color, #c00014);
  color: #fff;
}

.btn-primary:hover {
  background: var(--main-color-2, #0B1C6B);
  color: #fff;
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

iframe {
  max-width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.blog-meta ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.blog-meta li {
  font-size: 0.9rem;
  padding: 4px 12px;
  border-radius: 4px;
}

.bg-base {
  background: var(--main-color, #c00014);
  color: #fff;
}

.fa-film {
  display: block;
  margin: 0 auto;
}

.breadcrumb-inner a,
.blog-content-inner a {
  color: var(--main-color, #c00014);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-inner a:hover,
.blog-content-inner a:hover {
  color: var(--main-color-2, #0B1C6B);
  text-decoration: underline;
}

/* Responsive para iframe */
@media (max-width: 768px) {
  iframe {
    min-height: 250px;
  }
}

@media (max-width: 480px) {
  iframe {
    min-height: 200px;
  }
}
</style>