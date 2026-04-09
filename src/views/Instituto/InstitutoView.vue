<template>

  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>INSTITUTO DE INVESTIGACIÓN</h1>
            <h4>
              <router-link to="/">INICIO</router-link>
            </h4>
            <h3>Carrera de {{ formatNombreCarrera(institucionData?.institucion_nombre) }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>

  <section class="instituto-mission">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <p v-if="!isSearching || contentMatches('comprometida')" class="mission-text">
            La Carrera de <strong>{{ formatNombreCarrera(institucionData?.institucion_nombre) }}</strong> 
            mantiene un firme compromiso con la <em>investigación científica rigurosa</em>, 
            generando conocimiento innovador que fortalece la atención integral en salud, 
            promueve el bienestar comunitario y contribuye al desarrollo de políticas públicas 
            basadas en evidencia para transformar la realidad sanitaria de nuestra región.
          </p>
        </div>
      </div>
    </div>
  </section>

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
            placeholder="Buscar en gacetas, eventos y publicaciones..."
            class="search-input"
            aria-label="Buscar contenido del instituto"
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
          {{ itemsFiltrados.length }} resultado{{ itemsFiltrados.length !== 1 ? 's' : '' }}
        </span>
      </div>
    </div>
  </div>

  <div class="container blog-wrapper padding-lg">
    <div class="row">
      <div class="col-sm-8 blog-left">

        <div v-if="itemsFiltrados.length === 0" class="col-12 justify-content-center text-center py-5">
          <h2>SIN RESULTADOS</h2>
          <p class="text-muted">
            {{ searchQuery 
              ? `No se encontró contenido para "${searchQuery}"` 
              : 'Próximamente se agregarán nuevos contenidos al Instituto de Investigación.' 
            }}
          </p>
          <button v-if="searchQuery" @click="clearSearch" class="btn btn-secondary">
            Limpiar búsqueda
          </button>
        </div>

        <ul v-else class="row news-listing">
          <li 
            v-for="(item, index) of itemsPaginados" 
            :key="item.uniqueId || index" 
            class="col-xs-6 col-sm-6 grid-item"
          >
            <div class="inner">
              

              <div class="item-image-wrapper">

                <router-link 
                  v-if="item.tipo === 'evento'"
                  :to="{ path: '/instituto/detalle-evento/' + item.itemId }"
                  @click="$store.commit('clickLink')"
                  class="item-link"
                >
                  <img 
                    :src="getDirectUrl(item.imagen)" 
                    :alt="item.titulo"
                    class="img-responsive" 
                    style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;"
                    loading="lazy"
                    @error="handleImageError"
                  />
                </router-link>

                <router-link 
                  v-else-if="item.tipo === 'publicacion'"
                  :to="{ path: '/instituto/detalle-publicacion/' + item.itemId }"
                  @click="$store.commit('clickLink')"
                  class="item-link"
                >
                  <img 
                    :src="getDirectUrl(item.imagen)" 
                    :alt="item.titulo"
                    class="img-responsive" 
                    style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;"
                    loading="lazy"
                    @error="handleImageError"
                  />
                </router-link>

                <img 
                  v-else-if="item.tipo === 'gaceta'"
                  :src="getDirectUrl(item.imagen)" 
                  :alt="item.titulo"
                  class="img-responsive" 
                  style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; opacity: 0.7;"
                  loading="lazy"
                />
                <div v-if="item.tipo === 'gaceta'" class="pdf-icon-overlay">
                  <i class="fa fa-file-pdf-o" aria-hidden="true"></i>
                  <span class="pdf-label">PDF</span>
                </div>
              </div>

              <div class="cnt-block" style="min-height: 220px;">

                <span class="item-badge" :class="`badge-${item.tipo}`">
                  {{ item.tipoLabel }}
                </span>

                <h2>

                  <router-link 
                    v-if="item.tipo === 'gaceta'"
                    :to="{ path: '/instituto/detalle-gaceta/' + item.itemId }"
                    @click="$store.commit('clickLink')"
                    class="read-more"
                  >
                    {{ item.titulo }}
                  </router-link>
     
                  <router-link 
                    v-else-if="item.tipo === 'evento'"
                    :to="{ path: '/instituto/detalle-evento/' + item.itemId }"
                    @click="$store.commit('clickLink')"
                    class="read-more"
                  >
                    {{ item.titulo }}
                  </router-link>
                  
                  <router-link 
                    v-else-if="item.tipo === 'publicacion'"
                    :to="{ path: '/instituto/detalle-publicacion/' + item.itemId }"
                    @click="$store.commit('clickLink')"
                    class="read-more"
                  >
                    {{ item.titulo }}
                  </router-link>
                </h2>
      
                <p v-if="item.descripcion" v-html="sanitizeHtml(item.descripcion)" class="item-description"></p>

                <ul class="post-detail">
                  <li v-if="item.fecha">
                    <span class="fa fa-calendar"></span>
                    <span class="bold">Fecha: </span> 
                    {{ formatearFecha(item.fecha) }}
                  </li>
                  <li v-if="item.hora">
                    <span class="fa fa-clock-o"></span>
                    <span class="bold">Hora: </span> 
                    {{ item.hora }}
                  </li>
                  <li v-if="item.lugar">
                    <span class="fa fa-map-marker"></span>
                    <span class="bold">Lugar: </span> 
                    {{ item.lugar }}
                  </li>
                  <li v-if="item.autor">
                    <span class="fa fa-user"></span>
                    <span class="bold">Autor: </span> 
                    {{ item.autor }}
                  </li>
                </ul>

                <router-link 
                  v-if="item.tipo === 'gaceta'"
                  :to="{ path: '/instituto/detalle-gaceta/' + item.itemId }"
                  @click="$store.commit('clickLink')"
                  class="read-more"
                >
                  <span class="icon-play-icon"></span>
                  Ver documento
                </router-link>

                <router-link 
                  v-else
                  :to="{ path: item.tipo === 'evento' ? '/instituto/detalle-evento/' + item.itemId : '/instituto/detalle-publicacion/' + item.itemId }"
                  @click="$store.commit('clickLink')"
                  class="read-more"
                >
                  <span class="icon-play-icon"></span>
                  Ver detalles
                </router-link>
              </div>
            </div>
          </li>
        </ul>

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

        <div class="search-mobile-only">
          <div class="search-input-group">
            <i class="fa fa-search search-icon" aria-hidden="true"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              @input="onSearchInput"
              @keyup.enter="onSearchEnter"
              placeholder="Buscar..."
              class="search-input"
            />
            <button v-if="searchQuery" @click="clearSearch" class="search-clear">
              <i class="fa fa-times" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <SidebarCustom />
      </div>
    </div>
  </div>

  <div v-if="loading" class="loading-overlay">
    <div class="spinner"></div>
    <p>Cargando contenido del Instituto de Investigación...</p>
  </div>
</template>

<script>
import SidebarCustom from "@/components/SidebarCustom.vue";
import { mapState } from "vuex";
import api from '@/plugins/axios';

export default {
  name: "InstitutoView",
  
  components: { SidebarCustom },
  
  data() {
    return {
      loading: false,
      institucionLocal: {},
      gacetasLocal: [],
      eventosLocal: [],
      publicacionesLocal: [],

      NUM_RESULTS: 6,
      pag: 1,
      searchQuery: '',
      searchTimeout: null,
      isSearching: false,
    };
  },

  computed: {
    ...mapState(["Institucion"]),
    
    institucionData() {
      const vuexData = this.Institucion?.Descripcion || this.Institucion;
      if (vuexData && Object.keys(vuexData).length > 0) return vuexData;
      return this.institucionLocal;
    },

    itemsFiltrados() {
      const query = this.searchQuery.toLowerCase().trim();

      const allItems = [
        ...this.gacetasFiltradas.map(g => ({
          ...g,
          tipo: 'gaceta',
          tipoLabel: 'Gaceta',
          titulo: g.gaceta_titulo,
          descripcion: '',
          fecha: g.gaceta_fecha,
          documento: g.gaceta_documento,
          imagen: null,
          itemId: g.gaceta_id,
          uniqueId: `gaceta-${g.gaceta_id}`
        })),
        ...this.eventosFiltrados.map(e => ({
          ...e,
          tipo: 'evento',
          tipoLabel: 'Evento',
          titulo: e.evento_titulo,
          descripcion: e.evento_descripcion,
          fecha: e.evento_fecha,
          hora: e.evento_hora,
          lugar: e.evento_lugar,
          imagen: e.evento_imagen,
          itemId: e.evento_id,
          uniqueId: `evento-${e.evento_id}`
        })),
        ...this.publicacionesFiltradas.map(p => ({
          ...p,
          tipo: 'publicacion',
          tipoLabel: 'Publicación',
          titulo: p.publicaciones_titulo,
          descripcion: p.publicaciones_descripcion,
          fecha: p.publicaciones_fecha,
          autor: p.publicaciones_autor,
          imagen: p.publicaciones_imagen,
          itemId: p.publicaciones_id,
          uniqueId: `pub-${p.publicaciones_id}`
        }))
      ];

      if (query) {
        return allItems.filter(item => {
          const titulo = item.titulo?.toLowerCase() || '';
          const descripcion = item.descripcion?.toLowerCase() || '';
          return titulo.includes(query) || descripcion.includes(query);
        });
      }
 
      return allItems.sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));
    },
    
    pager() {
      return Math.ceil(this.itemsFiltrados.length / this.NUM_RESULTS);
    },
    
    itemsPaginados() {
      const start = (this.pag - 1) * this.NUM_RESULTS;
      const end = start + this.NUM_RESULTS;
      return this.itemsFiltrados.slice(start, end);
    },

    gacetasFiltradas() {
      const vuexGacetas = this.Institucion?.upea_gaceta_universitaria || [];
      const localGacetas = this.gacetasLocal;
      const allGacetas = vuexGacetas.length ? vuexGacetas : localGacetas;
      
      return allGacetas.filter(g => 
        g?.gaceta_tipo?.toUpperCase().trim() === 'INSTITUTO DE INVESTIGACION' &&
        g?.gaceta_documento  
      );
    },

    eventosFiltrados() {
      const vuexEventos = this.Institucion?.upea_evento || [];
      const localEventos = this.eventosLocal;
      const allEventos = vuexEventos.length ? vuexEventos : localEventos;
      
      return allEventos.filter(e => 
        e?.tipo_evento?.toUpperCase().trim() === 'INSTITUTO DE INVESTIGACION' &&
        e?.evento_imagen  
      );
    },

    publicacionesFiltradas() {
      const vuexPubs = this.Institucion?.upea_publicaciones || [];
      const localPubs = this.publicacionesLocal;
      const allPubs = vuexPubs.length ? vuexPubs : localPubs;
      
      return allPubs.filter(p => 
        p?.publicaciones_tipo?.toUpperCase().trim() === 'INSTITUTO DE INVESTIGACION' &&
        p?.publicaciones_imagen  
      );
    },
  },

  methods: {

    contentMatches(keyword) {
      if (!this.searchQuery) return true;
      return this.searchQuery.toLowerCase().includes(keyword.toLowerCase());
    },

    getDirectUrl(path) {
      if (!path || typeof path !== 'string') return '';
      const cleaned = path.trim();

      if (cleaned.startsWith('https://')) return cleaned;

      if (process.env.NODE_ENV === 'production' && cleaned.startsWith('http://')) {
        return cleaned.replace('http://', 'https://');
      }

    },

    sanitizeHtml(html) {
      if (!html || typeof html !== 'string') return '';
      return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/vbscript:/gi, '')
        .slice(0, 2000);
    },

    handleImageError(event) {
      if (event?.target) {
        event.target.style.display = 'none';
      }
    },

    formatearFecha(fechaISO) {
      if (!fechaISO) return '';
      const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
      const fecha = new Date(fechaISO);
      if (isNaN(fecha.getTime())) return fechaISO;
      return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    },

    formatNombreCarrera(nombre) {
      if (!nombre || typeof nombre !== 'string') return '';
      return nombre
        .split(' ')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(' ');
    },

    onSearchInput() {
      this.isSearching = true;
      if (this.searchTimeout) clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => { 
        this.pag = 1;
        this.isSearching = false;
      }, 300);
    },
    
    onSearchEnter() {
      this.isSearching = true;
      if (this.searchTimeout) clearTimeout(this.searchTimeout);
      this.pag = 1;
    },
    
    clearSearch() {
      this.searchQuery = '';
      this.isSearching = false;
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
      if (this.pag > 1) { this.pag--; this.scrollToTop(); }
    },
    nextPage() {
      if (this.pag < this.pager) { this.pag++; this.scrollToTop(); }
    },
    scrollToTop() {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    },

    async fetchGacetas() {
      try {
        const idInstitucion = process.env.VUE_APP_ID_INSTITUCION || '9';
        const res = await api.get(`/institucion/${idInstitucion}/gacetaEventos`);
        const data = res.data;
        
        this.gacetasLocal = (data.upea_gaceta_universitaria || [])
          .filter(g => g?.gaceta_estado !== "0")
          .map(this._limpiar);
        
        if (this.gacetasLocal.length > 0) {
          this.$store.commit('setInstitucion', {
            ...this.Institucion,
            upea_gaceta_universitaria: this.gacetasLocal
          });
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[Instituto] Error cargando gacetas:', error.message);
        }
      }
    },

    async fetchEventos() {
      try {
        const idInstitucion = process.env.VUE_APP_ID_INSTITUCION || '9';
        const res = await api.get(`/institucion/${idInstitucion}/gacetaEventos`);
        const data = res.data;
        
        this.eventosLocal = (data.upea_evento || [])
          .filter(e => e?.evento_estado !== "0")
          .map(this._limpiar);
        
        if (this.eventosLocal.length > 0) {
          this.$store.commit('setInstitucion', {
            ...this.Institucion,
            upea_evento: this.eventosLocal
          });
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[Instituto] Error cargando eventos:', error.message);
        }
      }
    },

    async fetchPublicaciones() {
      try {
        const idInstitucion = process.env.VUE_APP_ID_INSTITUCION || '9';
        const res = await api.get(`/institucion/${idInstitucion}/recursos`);
        const data = res.data;
        
        this.publicacionesLocal = (data.upea_publicaciones || [])
          .filter(p => p?.publicaciones_estado !== "0")
          .map(this._limpiar);
        
        if (this.publicacionesLocal.length > 0) {
          this.$store.commit('setInstitucion', {
            ...this.Institucion,
            upea_publicaciones: this.publicacionesLocal
          });
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[Instituto] Error cargando publicaciones:', error.message);
        }
      }
    },

    _limpiar(obj) {
      if (!obj || typeof obj !== 'object') return obj;
      const cleaned = { ...obj };
      Object.keys(cleaned).forEach(key => {
        if (typeof cleaned[key] === 'string') {
          cleaned[key] = cleaned[key].trim();
        } else if (cleaned[key] && typeof cleaned[key] === 'object' && !Array.isArray(cleaned[key])) {
          cleaned[key] = this._limpiar(cleaned[key]);
        }
      });
      return cleaned;
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

  async created() {
    this.$store.commit("loading");
    this.loading = true;
    this.applyDynamicColors();
    
    try {
      await Promise.all([
        this.fetchGacetas(),
        this.fetchEventos(),
        this.fetchPublicaciones()
      ]);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[Instituto] Error cargando datos:', error.message);
      }
    } finally {
      this.loading = false;
    }
  },

  mounted() {
    this.applyDynamicColors();
  },
  
  beforeUnmount() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
  },

  watch: {
    itemsFiltrados: {
      handler() { if (this.pag > this.pager) this.pag = 1; },
      immediate: true
    },
    Institucion: {
      handler() { this.applyDynamicColors(); },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style scoped>

.bg-overlay-img { background-image: url("@/assets/Fondo2.jpg"); }
.text-muted { color: #6c757d; }
.text-center { text-align: center; }
.py-5 { padding: 3rem 0; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1.5rem; }
.mb-0 { margin-bottom: 0; }
.small { font-size: 0.85rem; }
.padding-lg { padding: 3rem 0; }
.justify-content-center { justify-content: center; }

.instituto-mission {
  padding: 2rem 0;
  background: linear-gradient(135deg, rgba(4, 36, 108, 0.02) 0%, rgba(252, 1, 2, 0.02) 100%);
  border-bottom: 1px solid rgba(4, 36, 108, 0.1);
}

.mission-text {
  font-size: 1.5rem;
  line-height: 1.8;
  color: #2c3e50;
  text-align: justify;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, rgba(4, 36, 108, 0.03) 0%, rgba(255, 255, 255, 0) 100%);
  border-left: 4px solid var(--main-color, #04246C);
  border-radius: 0 8px 8px 0;
  margin: 0;
  transition: box-shadow 0.3s ease;
}

.mission-text:hover {
  box-shadow: 0 4px 20px rgba(4, 36, 108, 0.1);
}

.mission-text strong {
  color: var(--main-color, #04246C);
  font-weight: 700;
}

.mission-text em {
  color: #04246C;
  font-style: italic;
  font-weight: 500;
}

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
  border-color: var(--main-color, #04246C);
  box-shadow: 0 0 0 3px rgba(4, 36, 108, 0.1);
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
  color: var(--main-color, #04246C);
}
.search-results-count {
  font-size: 0.9rem;
  color: #666;
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
  background: var(--main-color, #04246C);
  color: #fff;
  border-color: var(--main-color, #04246C);
}
.pagination.blue li.disable a { opacity: 0.5; cursor: not-allowed; }
.pagination.blue li a:hover:not(.disable) {
  background: var(--main-color, #04246C);
  color: #fff;
}

.news-listing {
  list-style: none;
  padding: 0;
  margin: 0;
}
.grid-item {
  margin-bottom: 1.5rem;
}
.grid-item .inner {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  transition: box-shadow 0.2s;
  background: #fff;
}
.grid-item .inner:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-image-wrapper {
  position: relative;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
}
.item-image-wrapper .item-link {
  display: block;
  text-decoration: none;
  color: inherit;
}
.item-image-wrapper img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
  display: block;
}
.grid-item .inner:hover .item-image-wrapper img {
  transform: scale(1.05);
}

.pdf-icon-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(220, 53, 69, 0.9);
  color: #fff;
  padding: 1rem;
  border-radius: 8px;
  font-size: 2.5rem;
  pointer-events: none;
}
.pdf-icon-overlay .pdf-label {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.item-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  letter-spacing: 0.5px;
}
.badge-gaceta {
  background: #dc3545;
  color: #fff;
}
.badge-evento {
  background: #04246C;
  color: #fff;
}
.badge-publicacion {
  background: #6c757d;
  color: #fff;
}

.cnt-block h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
  line-height: 1.4;
}
.cnt-block h2 a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s;
}
.cnt-block h2 a:hover {
  color: var(--main-color, #04246C);
}

.item-description {
  font-size: 0.95rem;
  color: #6c757d;
  margin-bottom: 1rem;
  line-height: 1.5;
}
.item-description:deep(*) {
  font-size: 0.95rem;
  color: #6c757d;
}

.post-detail {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}
.post-detail li {
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #6c757d;
}
.post-detail .bold {
  font-weight: 600;
  color: #2c3e50;
}
.post-detail .fa {
  font-size: 0.9rem;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--main-color, #04246C);
  text-decoration: none;
  font-weight: 500;
  margin-top: 0.5rem;
  transition: gap 0.2s;
}
.read-more:hover {
  gap: 0.6rem;
  color: #031a4d;
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

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top-color: var(--main-color, #04246C);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}
@keyframes spin {
  to { transform: rotate(360deg); }
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
  .grid-item {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .post-detail {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .mission-text {
    font-size: 1.5rem;
    padding: 1.25rem 1.5rem;
    text-align: left;
  }
}
</style>