<template>
  <!-- ==============================================
    ** Inner Banner **
    =================================================== -->
  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>Sobre nosotros</h1>
          </div>
          <h4>
            <router-link to="/">INICIO</router-link>
          </h4>
        </div>
      </div>
    </div>
  </div>

  <div class="container blog-wrapper padding-lg">
    <div class="row">
      <!-- Start Left Column -->
      <div class="col-sm-8 blog-left">
        <p class="content left-aligned" v-html="institucionData?.institucion_sobre_ins || 'Cargando...'"></p>
      </div>
      <div class="col-sm-4">
        <SidebarCustom />
      </div>
    </div>
  </div>

  <!-- ==============================================
    ** Our Importance **
    =================================================== -->
  <section class="our-impotance padding-lg">
    <div class="container">
      <ul class="row">
        <div class="col-sm-6">
          <h3>Visión</h3>
          <p class="left-aligned" v-html="institucionData?.institucion_vision || 'Cargando...'"></p>
        </div>
        <div class="col-sm-6">
          <h3>Misión</h3>
          <p class="left-aligned" v-html="institucionData?.institucion_mision || 'Cargando...'"></p>
        </div>
      </ul>
    </div>
  </section>

  <!-- ==============================================
    ** Browse Teacher **
    =================================================== -->
  <section class="browse-teacher grey-bg padding-lg">
    <div class="container">
      <h2>
        <span>AUTORIDADES DE LA CARRERA DE {{ institucionData?.institucion_nombre || '...' }}</span> 
        Nuestras Autoridades
      </h2>
      
      <ul class="row browse-teachers-list clearfix">
        <li class="col-12 col-md-4" 
            v-for="(autoridad, id_aut) of autoridadesList" 
            :key="autoridad.id_autoridad || id_aut" 
            v-show="(pag - 1) * NUM_RESULTS <= id_aut && pag * NUM_RESULTS > id_aut">
          
          <figure>
            <img :src="imageUrl + autoridad.foto_autoridad" 
                 width="123" height="124" 
                 alt="Foto de {{ autoridad.nombre_autoridad }}">
          </figure>
          
          <h3>{{ autoridad.nombre_autoridad }}</h3>
          <span class="designation">{{ autoridad.cargo_autoridad }}</span>
          
          <ul class="teachers-follow">
            <li v-if="autoridad.facebook_autoridad?.trim()">
              <a :href="autoridad.facebook_autoridad.trim()" 
                 target="_blank" 
                 rel="noopener noreferrer">
                <i class="fa fa-facebook" aria-hidden="true"></i>
              </a>
            </li>

            <li v-if="autoridad.twiter_autoridad?.trim()">
              <a :href="autoridad.twiter_autoridad.trim()" 
                 target="_blank" 
                 rel="noopener noreferrer">
                <i class="fa fa-twitter" aria-hidden="true"></i>
              </a>
            </li>

            <li v-if="autoridad.celular_autoridad">
              <a :href="'https://wa.me/+591' + String(autoridad.celular_autoridad).replace(/[^0-9]/g, '')" 
                 target="_blank" 
                 rel="noopener noreferrer">
                <i class="fa fa-whatsapp" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
        </li>
      </ul>

      <div class="text-center mt-3" v-if="pager > 1">
        <button @click="prevPage" :disabled="pag <= 1" class="btn btn-sm">« Anterior</button>
        <span class="mx-2">{{ pag }} / {{ pager }}</span>
        <button @click="nextPage" :disabled="pag >= pager" class="btn btn-sm">Siguiente »</button>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import SidebarCustom from "@/components/SidebarCustom.vue";

export default {
  name: "AboutView",
  
  data() {
    return {
      NUM_RESULTS: 4,
      pag: 1,
      pager: 0,
    };
  },
  
  components: {
    SidebarCustom,
  },
  
  computed: {
    ...mapState(["Institucion", "url_api", "autoridades"]),
    
    institucionData() {
      const data = this.Institucion?.Descripcion || this.Institucion;
      if (!data || Object.keys(data).length === 0) {
        return {
          institucion_nombre: '...',
          institucion_sobre_ins: '',
          institucion_vision: '',
          institucion_mision: '',
          autoridad: [],
        };
      }
      return data;
    },
    
    autoridadesList() {
      return this.autoridades?.length 
        ? this.autoridades 
        : this.institucionData?.autoridad || [];
    },

    imageUrl() {
      return (process.env.VUE_APP_UPLOADS_URL || 'https://apiadministrador.upea.bo').trim();
    },
  },
  
  methods: {
    updatePager() {
      const total = this.autoridadesList?.length || 0;
      this.pager = Math.ceil(total / this.NUM_RESULTS);
      if (this.pag > this.pager && this.pager > 0) this.pag = this.pager;
      if (this.pag < 1) this.pag = 1;
    },
    
    prevPage() {
      if (this.pag > 1) {
        this.pag--;
        window.scrollTo(0, 400); 
      }
    },
    
    nextPage() {
      if (this.pag < this.pager) {
        this.pag++;
        window.scrollTo(0, 400);
      }
    },
  },
  
  watch: {
    autoridadesList: {
      handler() { this.updatePager(); },
      immediate: true
    },
  },
  
  created() {

    this.$store.commit("loading");
    this.updatePager();
  },
};
</script>

<style scoped>
.centered-text {
  text-align: center;
  padding: 0 65px;
}

.text-wrap {
  text-align: justify;
  padding: 0 70px;
}

p {
  margin-bottom: 5px;
}

.bg-overlay-img {
  background-image: url("@/assets/Fondo2.jpg");
}

.left-aligned {
  text-align: left;
}

.mt-3 { margin-top: 1rem; }
.mx-2 { margin: 0 0.5rem; }
.btn {
  padding: 4px 12px;
  background: var(--main-color, #c00014);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.btn-sm {
  padding: 2px 8px;
  font-size: 0.85rem;
}
</style>