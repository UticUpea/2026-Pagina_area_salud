<template>
  <!-- ==============================================
    ** Inner Banner **
    =================================================== -->
  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>{{ tipoCurso }} ABIERTOS EN LA CARRERA.</h1>
            <h4>
              <router-link to="/">INICIO</router-link>
            </h4>
            <h3>{{ tipoCurso }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==============================================
    ** News & Events **
    =================================================== -->
  <div class="container blog-wrapper padding-lg">
    <div class="row">
      <div class="col-sm-8 blog-left">
        <div v-if="cursosFiltrados.length === 0" class="col-12 justify-content-center text-center py-5">
          <h2>SIN {{ tipoCurso }}</h2>
          <p class="text-muted">Próximamente se agregarán nuevos {{ tipoCurso?.toLowerCase() }}.</p>
        </div>
        <ul v-else class="row news-listing">
          <li 
            v-for="(cur, index) of cursosPaginados" 
            :key="cur.iddetalle_cursos_academicos || index" 
            class="col-xs-6 col-sm-6 grid-item"
          >
            <div class="inner">

              <router-link 
                :to="'/detalleCurso/' + cur.iddetalle_cursos_academicos" 
                @click="$store.commit('clickLink')"
              >
                <img 
                  :src="imageUrl + cur.det_img_portada" 
                  :alt="cur.det_titulo || 'Imagen del curso'"
                  class="img-responsive" 
                  style="width: 100%; height: 400px; object-fit: cover; border-radius: 8px;"
                />
              </router-link>

              <div class="cnt-block" style="min-height: 250px;">
                <ul class="post-detail">
                  <li>
                    <span class="fa fa-clock-o"></span>
                    <span class="bold">Carga Horaria: </span> 
                    {{ cur.det_carga_horaria !== undefined ? cur.det_carga_horaria + ' hrs' : 'N/A' }} académicas.
                  </li>
                  <li>
                    <span class="icon-date-icon ico"></span>
                    <span class="bold">Costo: </span> 
                    {{ cur.det_costo !== undefined ? cur.det_costo + ' Bs' : 'N/A' }}
                  </li>
                  <li v-if="cur.det_modalidad">
                    <span class="fa fa-graduation-cap"></span>
                    <span class="bold">Modalidad: </span>
                    {{ cur.det_modalidad }}
                  </li>
                </ul>
                
                <h2>
                  <router-link 
                    :to="'/detalleCurso/' + cur.iddetalle_cursos_academicos" 
                    @click="$store.commit('clickLink')" 
                    class="read-more"
                  >
                    {{ cur.det_titulo }}
                  </router-link>
                </h2>
                
                <div 
                  v-if="cur.facilitadores?.length" 
                  class="author media mt-2"
                >
                  <div class="media-left">
                    <img 
                      :src="imageUrl + cur.facilitadores[0].foto_facilitador" 
                      :alt="cur.facilitadores[0].nombre_facilitador"
                      style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"
                    />
                  </div>
                  <div class="media-body align-self-center">
                    <p class="mb-0 small">
                      {{ cur.facilitadores[0].nombre_facilitador }}
                      <span v-if="cur.facilitadores.length > 1" class="text-muted">
                        +{{ cur.facilitadores.length - 1 }} más
                      </span>
                    </p>
                  </div>
                </div>

                <router-link 
                  :to="'/detalleCurso/' + cur.iddetalle_cursos_academicos" 
                  @click="$store.commit('clickLink')" 
                  class="read-more"
                >
                  <span class="icon-play-icon"></span>
                  Leer más
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

.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1.5rem; }
.mb-0 { margin-bottom: 0; }
.small { font-size: 0.85rem; }

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
img.img-responsive {
  max-width: 100%;
  height: auto;
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

.post-detail .bold {
  font-weight: 600;
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

.read-more .icon-play-icon {
  font-size: 0.9rem;
}

/* Grid items */
.grid-item {
  margin-bottom: 1.5rem;
}

.grid-item .inner {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  transition: box-shadow 0.2s;
}

.grid-item .inner:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Media (facilitador) */
.media {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.media-left img {
  border-radius: 50%;
}

.media-body p {
  margin: 0;
  line-height: 1.3;
}
</style>

<script>
import SidebarCustom from "@/components/SidebarCustom.vue";
import { mapState } from "vuex";

export default {
  name: "CursosView",
  
  data() {
    return {
      // Paginación
      NUM_RESULTS: 4,
      pag: 1,
    };
  },
  
  components: {
    SidebarCustom,
  },
  
  computed: {
    ...mapState(["cursos", "MenuCur", "url_api"]),

    imageUrl() {
      return (process.env.VUE_APP_UPLOADS_URL || 'https://apiadministrador.upea.bo').trim();
    },

    tipoCurso() {
      const tipoId = this.$route.params.tipo_cur;
      if (!tipoId || !this.MenuCur?.length) return 'Cursos';
      const tipo = this.MenuCur.find(t => 
        t.idtipo_curso_otros == tipoId || 
        t.idtipo_curso_otros === parseInt(tipoId)
      );
      
      return tipo?.tipo_conv_curso_nombre || 'Cursos';
    },
    
    cursosFiltrados() {
      const tipoId = this.$route.params.tipo_cur;
      if (!tipoId || !this.cursos?.length) return [];
      
      return this.cursos.filter(c => 
        // Estado activo
        (c.det_estado === "1" || c.det_estado === 1) && 
        (c.idtipo_curso_otros == tipoId || c.idtipo_curso_otros === parseInt(tipoId))
      );
    },
    pager() {
      return Math.ceil(this.cursosFiltrados.length / this.NUM_RESULTS);
    },
    cursosPaginados() {
      const start = (this.pag - 1) * this.NUM_RESULTS;
      const end = start + this.NUM_RESULTS;
      return this.cursosFiltrados.slice(start, end);
    },
  },
  
  methods: {
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
    '$route.params.tipo_cur': {
      handler() {
        this.pag = 1;
      }
    },
    cursosFiltrados: {
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