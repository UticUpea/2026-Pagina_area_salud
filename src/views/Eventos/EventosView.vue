<template>
  <!-- ==============================================
    ** Inner Banner **
    =================================================== -->
  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>EVENTOS RECIENTES DE LA CARRERA</h1>
            <h4>
              <router-link to="/">INICIO</router-link>
            </h4>
            <h3>EVENTOS</h3>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==============================================
    ** Blog **
    =================================================== -->
  <div class="container blog-wrapper padding-lg">
    <div class="row">
      
      <!-- Columna Izquierda: Eventos -->
      <div class="col-sm-8 blog-left">
        <div class="col-12 text-center py-5" v-if="eventosList.length === 0">
          <h2>SIN EVENTOS</h2>
          <p class="text-muted">Próximamente se agregarán nuevos eventos.</p>
        </div>

        <template v-else>
          <div
            v-for="(ev, index) of eventosPaginados"
            :key="ev.evento_id || index"
            class="col-sm-12 mb-4"
          >
            <div class="left-aligned">
              <ul class="blog-listing">
                <li>
                  <!-- ✅ Imagen con URL segura -->
                  <img
                    :src="buildSafeImageUrl(ev.evento_imagen)"
                    :alt="ev.evento_titulo || 'Imagen del evento'"
                    class="img-responsive"
                    style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px;"
                  />
                  
                  <br>
                  
                  <ul class="post-detail">
                    <li>
                      <span class="icon-date-icon ico"></span>
                      <span class="bold">Fecha: </span> 
                      {{ formatearFecha(ev.evento_fecha) }}
                    </li>
                    <li v-if="ev.evento_lugar">
                      <span class="fa fa-map-marker"></span>
                      <span class="bold">Lugar: </span>
                      {{ ev.evento_lugar }}
                    </li>
                    <li>
                      <span class="label">
                        {{ ev.tipo_evento || 'EVENTO' }}
                      </span>
                    </li>
                  </ul>

                  <h2>
                    <router-link 
                      :to="'/detalleEvento/' + ev.evento_id"
                      @click="$store.commit('clickLink')"
                    >
                      {{ ev.evento_titulo }}
                    </router-link>
                  </h2>
                  
                  <router-link
                    :to="'/detalleEvento/' + ev.evento_id"
                    @click="$store.commit('clickLink')"
                    class="read-more"
                  >
                    <span class="icon-play-icon"></span>Leer más
                  </router-link>
                </li>
              </ul>
            </div>
          </div>

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
        </template>
      </div>

      <!-- Columna Derecha: Sidebar -->
      <div class="col-sm-4">
        <SidebarCustom />
      </div>
    </div>
  </div>
</template>

<style scoped>

.bg-overlay-img {
  background-image: url("@/assets/Fondo2.jpg");
}
.text-muted { color: #6c757d; }
.text-center { text-align: center; }
.py-5 { padding: 3rem 0; }
.mt-4 { margin-top: 1.5rem; }
.mb-4 { margin-bottom: 1.5rem; }

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

/* Imagen responsive */
img.img-responsive { max-width: 100%; height: auto; }

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
</style>

<script>
import SidebarCustom from "@/components/SidebarCustom.vue";
import { mapState } from "vuex";

export default {
  name: "EventosView",
  
  data() {
    return {
      NUM_RESULTS: 4,
      pag: 1,
    };
  },
  
  components: {
    SidebarCustom,
  },
  
  computed: {
    ...mapState([
      "eventos", 
      "url_api",
      "MenuConv",
      "MenuCur",
      "convocatorias",
      "cursos",
      "servicios",
      "ofertas",
      "publicaciones",
      "gacetas",
      "videos"
    ]),
    
    // ✅ imageUrl: sin fallback en producción
    imageUrl() {
      const url = process.env.VUE_APP_UPLOADS_URL?.trim();
      if (process.env.VUE_APP_ENV === 'production' && !url) {
        console.error('❌ VUE_APP_UPLOADS_URL no definida en producción');
        return '';
      }
      return url || (process.env.VUE_APP_ENV !== 'production' ? 'https://apiadministrador.upea.bo' : '');
    },
    
    eventosList() {
      return this.eventos?.filter(e => e.evento_id) || [];
    },
    
    pager() {
      return Math.ceil(this.eventosList.length / this.NUM_RESULTS);
    },
    
    eventosPaginados() {
      const start = (this.pag - 1) * this.NUM_RESULTS;
      const end = start + this.NUM_RESULTS;
      return this.eventosList.slice(start, end);
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
    
    formatearFecha(fechaISO) {
      if (!fechaISO) return 'Fecha no disponible';
      const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
      const fecha = new Date(fechaISO);
      if (isNaN(fecha.getTime())) return fechaISO;
      return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    },
    
    goToPage(page) {
      if (page >= 1 && page <= this.pager) {
        this.pag = page;
        this.scrollToTop();
      }
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
    
    scrollToTop() {
      window.scrollTo({
        top: 400, 
        behavior: 'smooth'
      });
    },
  },
  
  watch: {
    eventosList: {
      handler() {
        if (this.pag > this.pager) this.pag = 1;
      },
      immediate: true
    },
  },
  
  created() {
    this.$store.commit("loading");
  },
};
</script>