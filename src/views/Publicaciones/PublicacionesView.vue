<template>
  <!-- ==============================================
    ** Inner Banner **
    =================================================== -->
  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>PUBLICACIONES ACTUALES DE LA CARRERA</h1>
          </div>
          <h4>
            <router-link to="/">INICIO</router-link>
          </h4>
          <h5>PUBLICACIONES</h5>
        </div>
      </div>
    </div>
  </div>

  <!-- ==============================================
    ** Blog **
    =================================================== -->
  <div class="container blog-wrapper padding-lg">
    
    <!-- Estado vacío -->
    <div v-if="publicacionesList.length === 0" class="text-center py-5">
      <h2>SIN PUBLICACIONES</h2>
      <p class="text-muted">Próximamente se agregarán nuevas publicaciones.</p>
    </div>

    <div v-else class="row">
      
      <!-- Columna Izquierda: Lista de Publicaciones -->
      <div class="col-sm-8 blog-left">
        <div
          v-for="(pub, index) of publicacionesPaginadas"
          :key="pub.publicaciones_id || index"
          class="mb-4"
        >
          <div class="blog-listing">
            <img
              style="width: 100%; height: 270px; object-fit: cover; border-radius: 8px;"
              :src="imageUrl + pub.publicaciones_imagen"
              class="img-responsive"
              :alt="pub.publicaciones_titulo || 'Imagen de publicación'"
            />

            <div class="left-aligned mt-3">
              <ul class="post-detail">
                <li>
                  <span class="icon-date-icon ico"></span>
                  <span class="bold">{{ formatearFecha(pub.publicaciones_fecha) }}</span>
                </li>
                <li>
                  Publicado por:
                  <span class="bold">{{ pub.publicaciones_autor || 'Administración' }}</span>
                </li>
                <li>
                  <span class="label">
                    {{ pub.publicaciones_tipo || 'PUBLICACIONES' }}
                  </span>
                </li>
              </ul>

              <h2>
                <router-link
                  :to="'/detallePublicacion/' + pub.publicaciones_id"
                  @click="$store.commit('clickLink')"
                >
                  {{ pub.publicaciones_titulo }}
                </router-link>
              </h2>

              <router-link
                :to="'/detallePublicacion/' + pub.publicaciones_id"
                @click="$store.commit('clickLink')"
                class="read-more"
              >
                <span class="icon-play-icon"></span>
                Leer más
              </router-link>
            </div>
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
      </div>

      <!-- Columna Derecha: Sidebar (UNA SOLA VEZ) -->
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

.text-muted {
  color: #6c757d;
}

.text-center {
  text-align: center;
}

.py-5 {
  padding: 3rem 0;
}

.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }
.mb-4 { margin-bottom: 1.5rem; }

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

img.img-responsive {
  max-width: 100%;
  height: auto;
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

.post-detail .bold {
  font-weight: 600;
}

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

.read-more .icon-play-icon {
  font-size: 0.9rem;
}
</style>

<script>
import SidebarCustom from "@/components/SidebarCustom.vue";
import { mapState } from "vuex";

export default {
  name: "PublicacionesView",
  
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
    ...mapState(["publicaciones", "url_api"]),
    
    // ✅ CORREGIDO: URL sin espacios + dominio correcto
    imageUrl() {
      return (process.env.VUE_APP_UPLOADS_URL || 'https://apiadministrador.upea.bo/uploads').trim();
    },
    
    publicacionesList() {
      return this.publicaciones?.filter(p => p.publicaciones_id) || [];
    },
    
    pager() {
      return Math.ceil(this.publicacionesList.length / this.NUM_RESULTS);
    },
    
    publicacionesPaginadas() {
      const start = (this.pag - 1) * this.NUM_RESULTS;
      const end = start + this.NUM_RESULTS;
      return this.publicacionesList.slice(start, end);
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
    publicacionesList: {
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