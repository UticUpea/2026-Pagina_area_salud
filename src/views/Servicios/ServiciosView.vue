<template>
  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>SERVICIOS EN LA CARRERA</h1>
          </div>
          <h4>
            <router-link to="/">INICIO</router-link>
          </h4>
          <h5>SERVICIOS</h5>
        </div>
      </div>
    </div>
  </div>

  <div class="container blog-wrapper padding-lg">

    <div v-if="serviciosList.length === 0" class="text-center py-5">
      <h2>NO HAY SERVICIOS</h2>
      <p class="text-muted">Próximamente se agregarán nuevos servicios.</p>
    </div>

    <div v-else>
      <div 
        v-for="(serv, index) of serviciosPaginados" 
        :key="serv.serv_id || index"
        class="row mb-4"
      >
        <div class="col-sm-8 blog-left">
          <ul class="blog-listing">
            <li>
              <img 
                style="width: 750px; height: 270px; object-fit: cover; border-radius: 8px;" 
                :src="buildSafeImageUrl(serv.serv_imagen)" 
                class="img-responsive" 
                :alt="serv.serv_nombre || 'Imagen de servicio'" 
              />
              <br />
              <div class="left-aligned">
                <ul class="post-detail">
                  <li>
                    <span class="icon-date-icon ico"></span>
                    <span class="bold">{{ formatearFecha(serv.serv_registro) }}</span>
                  </li>
                  <li v-if="serv.serv_nro_celular">
                    <i class="fa fa-phone"></i>
                    <a :href="'tel:+591' + String(serv.serv_nro_celular).replace(/[^0-9]/g, '')" class="bold">
                      {{ serv.serv_nro_celular }}
                    </a>
                  </li>
                  <li><span class="label">SERVICIOS</span></li>
                </ul>

                <h2>
                  <router-link
                    :to="'/detalleServicio/' + serv.serv_id"
                    @click="$store.commit('clickLink')"
                  >
                    {{ serv.serv_nombre }}
                  </router-link>
                </h2>
              </div>
            </li>
          </ul>
        </div>

        <div class="col-sm-4">
          <SidebarCustom />
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
            <a href="#" @click.prevent="pag = i">
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
  </div>
</template>

<style scoped>
.bg-overlay-img {
  background-image: url("@/assets/Fondo2.jpg");
}
.text-muted {
  color: #6c757d;
}
.py-5 {
  padding: 3rem 0;
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
.post-detail a {
  color: inherit;
  text-decoration: none;
}
.post-detail a:hover {
  color: var(--main-color, #c00014);
}
</style>

<script>
import SidebarCustom from "@/components/SidebarCustom.vue";
import { mapState } from "vuex";

export default {
  name: "ServiciosView",
  
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
    ...mapState(["servicios", "url_api"]),

    imageUrl() {
      const url = process.env.VUE_APP_UPLOADS_URL?.trim();
      if (process.env.VUE_APP_ENV === 'production' && !url) {
        console.error('❌ VUE_APP_UPLOADS_URL no definida en producción');
        return '';
      }
      return url || (process.env.VUE_APP_ENV !== 'production' ? 'https://apiadministrador.upea.bo' : '');
    },

    serviciosList() {
      return this.servicios?.filter(s => s.serv_active === "1" || s.serv_active === 1) || [];
    },

    pager() {
      return Math.ceil(this.serviciosList.length / this.NUM_RESULTS);
    },
    
    serviciosPaginados() {
      const start = (this.pag - 1) * this.NUM_RESULTS;
      const end = start + this.NUM_RESULTS;
      return this.serviciosList.slice(start, end);
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
  },
  
  watch: {
    serviciosList: {
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