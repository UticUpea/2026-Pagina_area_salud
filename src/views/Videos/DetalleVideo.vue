<template>
  <div>

    <div class="page-title-area bg-overlay bg-overlay-img banner-img">
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <div class="breadcrumb-inner">
              <h2 class="page-title">VIDEOS DE LA CARRERA</h2>
            </div>
            <h4>
              <router-link to="/">INICIO</router-link>
            </h4>
            <h5>
              <router-link to="/videos">VIDEOS</router-link>
            </h5>
            <h3 v-if="videoData?.video_titulo">{{ videoData.video_titulo }}</h3>
          </div>
        </div>
      </div>
    </div>

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

          <div class="col-lg-8 col-12" v-else>
            <div class="single-blog-inner mb-0">
              <div class="thumb">
                <iframe
                  :src="videoData.video_enlace?.trim()"
                  style="width: 100%; aspect-ratio: 16/9; border-radius: 10px;"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen="allowfullscreen"
                  loading="lazy"
                  :title="videoData.video_titulo"
                />
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
                 v-html="videoData.video_breve_descripcion"></p>
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
          
          <!-- Sidebar -->
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
import { mapState } from "vuex";
import SidebarCustom from "@/components/SidebarCustom.vue";

export default {
  name: "DetalleVideo",
  
  components: {
    SidebarCustom,
  },
  
  computed: {
    ...mapState(["videos", "url_api"]),
    videoData() {
      const videoId = parseInt(this.$route.params.idVid);
      
      if (!videoId || !this.videos?.length) {
        return null;
      }

      const video = this.videos.find(v => v.video_id === videoId);
      if (!video || (video.video_estado !== 1 && video.video_estado !== "1")) {
        return null;
      }
      
      return video;
    },

    videoNotFound() {
      return !this.videoData;
    },
  },
  
  methods: {

    formatearFecha(fechaISO) {
      if (!fechaISO) return '';
      const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
      const fecha = new Date(fechaISO);
      if (isNaN(fecha.getTime())) return fechaISO;
      return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    },
  },
  
  created() {
    this.$store.commit("loading");
  },
};
</script>

<style scoped>
.text-muted {
  color: #6c757d;
}

.text-center {
  text-align: center;
}

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
  background: #a00010;
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

/* Iframe responsive */
iframe {
  max-width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Blog meta */
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
</style>