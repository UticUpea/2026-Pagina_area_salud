<template>
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
            aria-label="Buscar publicaciones"
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
          {{ publicacionesFiltradas.length }} resultado{{ publicacionesFiltradas.length !== 1 ? 's' : '' }}
        </span>
      </div>
    </div>
  </div>

  <div class="container blog-wrapper padding-lg">
    <div v-if="publicacionesFiltradas.length === 0" class="text-center py-5">
      <h2>SIN RESULTADOS</h2>
      <p class="text-muted">
        {{ searchQuery 
          ? `No se encontraron publicaciones para "${searchQuery}"` 
          : 'Próximamente se agregarán nuevas publicaciones.' 
        }}
      </p>
      <button v-if="searchQuery" @click="clearSearch" class="btn btn-secondary">
        Limpiar búsqueda
      </button>
    </div>

    <div v-else class="row">
      <div class="col-sm-8 blog-left">
        <div
          v-for="(pub, index) of publicacionesPaginadas"
          :key="pub.publicaciones_id || index"
          class="mb-4"
        >
          <div class="blog-listing">
            <img
              style="width: 100%; height: 270px; object-fit: cover; border-radius: 8px;"
              :src="buildSafeImageUrl(pub.publicaciones_imagen)"
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
              <h4>
                <router-link
                  :to="'/detallePublicacion/' + pub.publicaciones_id"
                  @click="$store.commit('clickLink')"
                >
                  {{ pub.publicaciones_titulo }}
                </router-link>
              </h4>
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
              <a href="#" @click.prevent="goToPage(i)">{{ i }}</a>
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
  name: "PublicacionesView",
  
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
    ...mapState(["publicaciones", "url_api", "Institucion"]),

    imageUrl() {
      const url = process.env.VUE_APP_UPLOADS_URL?.trim();
      if (process.env.VUE_APP_ENV === 'production' && !url) {
        return '';
      }
      return url;
    },

    searchPlaceholder() {
      return 'Buscar publicaciones por título...';
    },

    publicacionesList() {
      return this.publicaciones?.filter(p => p.publicaciones_id) || [];
    },

    publicacionesFiltradas() {
      const query = this.searchQuery.toLowerCase().trim();
      let filtradas = this.publicacionesList;
      if (query) {
        filtradas = filtradas.filter(pub => {
          const titulo = pub.publicaciones_titulo?.toLowerCase() || '';
          return titulo.includes(query);
        });
      }
      return filtradas;
    },
    
    pager() {
      return Math.ceil(this.publicacionesFiltradas.length / this.NUM_RESULTS);
    },
    
    publicacionesPaginadas() {
      const start = (this.pag - 1) * this.NUM_RESULTS;
      const end = start + this.NUM_RESULTS;
      return this.publicacionesFiltradas.slice(start, end);
    },
  },
  
  methods: {
    buildSafeImageUrl(path) {
      if (!path) return '';
      const cleaned = String(path).trim();
      if (cleaned.startsWith('http')) {
        return cleaned.replace('http://', 'https://');
      }
      const base = this.imageUrl?.replace(/\/$/, '');
      return `${base}${cleaned.startsWith('/') ? cleaned : `/${cleaned}`}`;
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
    publicacionesFiltradas: {
      handler() { if (this.pag > this.pager) this.pag = 1; },
      immediate: true
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
  .search-mobile-only {
    display: none;
  }
  .search-section {
    display: block;
  }
}

@media (max-width: 767px) {
  .search-section {
    display: none;
  }
  .search-mobile-only {
    display: block;
    margin-bottom: 1.5rem;
    padding: 0 15px;
  }
  .search-mobile-only .search-input-group {
    max-width: 100%;
  }
  .search-mobile-only .search-input {
    padding: 10px 35px 10px 40px;
    font-size: 0.95rem;
  }
}

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

.mt-3 {
  margin-top: 1rem;
}

.mt-4 {
  margin-top: 1.5rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

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

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-secondary {
  background: #6c757d;
  color: #fff;
}

.btn-secondary:hover {
  background: #5a6268;
}
</style>