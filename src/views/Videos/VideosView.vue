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

  <div class="container blog-wrapper padding-lg">
    <div class="col-12 justify-content-center text-center" v-if="videosList.length === 0">
      <h2>SIN VIDEOS</h2>
      <p class="text-muted">Próximamente se agregarán nuevos contenidos multimedia.</p>
    </div>

    <div v-else class="row news-listing">
      <div class="col-sm-8 blog-left">
        <ul
          v-for="(vid, id_vid) of videosToShow"
          :key="vid.video_id || id_vid"
          class="col-xs-6 col-sm-6 grid-item"
        >
          <li>
            <!-- ✅ Iframe con URL validada y atributos de seguridad -->
            <iframe
              v-if="isSafeVideoUrl(vid.video_enlace)"
              :src="vid.video_enlace?.trim()"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy"
              style="border-radius: 5px; width: 100%; min-height: 250px;"
              :title="vid.video_titulo"
              sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
              referrerpolicy="strict-origin-when-cross-origin"
            />
            <!-- ✅ Fallback si la URL no es segura -->
            <div v-else class="text-center py-3 text-muted">
              <i class="fa fa-video-slash"></i> Video no disponible
            </div>
            <br />

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

            <!-- ✅ Sanitizar HTML antes de renderizar (protección XSS) -->
            <p v-if="vid.video_breve_descripcion" class="video-desc text-muted small" v-html="$sanitize(vid.video_breve_descripcion)"></p>
          </li>
        </ul>

        <div v-if="pager > 1" class="text-center mt-4">
          <button @click="prevPage" :disabled="pag <= 1" class="btn btn-sm btn-outline">« Anterior</button>
          <span class="mx-3 font-weight-bold">{{ pag }} / {{ pager }}</span>
          <button @click="nextPage" :disabled="pag >= pager" class="btn btn-sm btn-outline">Siguiente »</button>
        </div>
      </div>

      <div class="col-sm-4">
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
      search: "",
      searchGet: false,

      NUM_RESULTS: 4,
      pag: 1,
      pager: 0,
    };
  },
  
  components: {
    SidebarCustom,
  },
  
  computed: {
    ...mapState(["videos", "url_api"]),

    videosList() {
      return this.videos?.filter(v => v.video_estado === 1 || v.video_estado === "1") || [];
    },

    videosToShow() {
      if (!this.searchGet || !this.search?.trim()) {
        const start = (this.pag - 1) * this.NUM_RESULTS;
        const end = start + this.NUM_RESULTS;
        return this.videosList.slice(start, end);
      }

      const term = this.search.toLowerCase().trim();
      return this.videosList.filter(vid => 
        vid.video_titulo?.toLowerCase().includes(term) ||
        vid.video_breve_descripcion?.toLowerCase().includes(term)
      );
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

    updatePager() {
      if (this.searchGet) {
        this.pager = 1; 
        this.pag = 1;
        return;
      }
      this.pager = Math.ceil(this.videosList.length / this.NUM_RESULTS);
      if (this.pag > this.pager && this.pager > 0) this.pag = this.pager;
      if (this.pag < 1) this.pag = 1;
    },
    
    prevPage() {
      if (this.pag > 1) {
        this.pag--;
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    },
    
    nextPage() {
      if (this.pag < this.pager) {
        this.pag++;
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    },

    buscar() {
      this.searchGet = !!this.search?.trim();
      this.updatePager();
    },

    async recargarVideos() {
      try {
        const idInstitucion = process.env.VUE_APP_ID_INSTITUCION;
        if (!idInstitucion && process.env.VUE_APP_ENV === 'production') {
          console.error('❌ VUE_APP_ID_INSTITUCION no definida en producción');
          return;
        }
        const { data } = await this.$api?.get(`/institucion/${idInstitucion}/contenido`) 
          || await import('@/plugins/axios').then(m => m.default.get(`/institucion/${idInstitucion}/contenido`));
        
        const videosNuevos = data.upea_videos?.filter(v => v.video_estado === 1) || [];
        this.$store?.commit?.('setVideos', videosNuevos);
      } catch (error) {
        const isProd = process.env.VUE_APP_ENV === 'production';
        if (!isProd) console.error('Error recargando videos:', error);
      }
    },
  },
  
  watch: {
    videosList: { handler() { this.updatePager(); }, immediate: true },
    searchGet: { handler() { this.updatePager(); } },
  },
  
  created() {
    this.$store.commit("loading");
    this.updatePager();
  },
};
</script>

<style scoped>
.video-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0.5rem 0;
  line-height: 1.3;
}

.video-desc {
  font-size: 0.9rem;
  margin: 0.3rem 0 0.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-muted {
  color: #6c757d;
}

.font-weight-bold {
  font-weight: 600;
}

.mt-4 { margin-top: 1.5rem; }
.mx-3 { margin: 0 0.75rem; }

.btn {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--main-color, #c00014);
  color: var(--main-color, #c00014);
}

.btn-outline:hover:not(:disabled) {
  background: var(--main-color, #c00014);
  color: #fff;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

iframe {
  max-width: 100%;
  aspect-ratio: 16/9;
}

@media (max-width: 768px) {
  .grid-item {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  iframe {
    min-height: 200px;
  }
}
</style>