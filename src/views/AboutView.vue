<template>
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
      <div class="col-sm-8 blog-left">
        <p class="content left-aligned" 
           v-html="$sanitize(institucionData?.institucion_sobre_ins) || 'Cargando...'">
        </p>
      </div>
      <div class="col-sm-4">
        <SidebarCustom />
      </div>
    </div>
  </div>

  <section class="mission-vision-section padding-lg">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6 col-lg-6">
          <div class="our_solution_category">
            <div class="solution_cards_box">
              <div class="solution_card vision-card">
                <div class="hover_color_bubble"></div>
                <div class="solu_title">
                  <h3><i class="fa fa-eye" aria-hidden="true"></i> Visión</h3>
                </div>
                <div class="solu_description">
                  <p class="left-aligned" 
                     v-html="$sanitize(institucionData?.institucion_vision) || 'Cargando...'">
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-6">
          <div class="our_solution_category">
            <div class="solution_cards_box">
              <div class="solution_card mission-card">
                <div class="hover_color_bubble"></div>
                <div class="solu_title">
                  <h3><i class="fa fa-bullseye" aria-hidden="true"></i> Misión</h3>
                </div>
                <div class="solu_description">
                  <p class="left-aligned" 
                     v-html="$sanitize(institucionData?.institucion_mision) || 'Cargando...'">
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

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
            <img :src="buildSafeImageUrl(autoridad.foto_autoridad)" 
                 width="123" 
                 height="124" 
                 :alt="'Foto de ' + autoridad.nombre_autoridad">
          </figure>
          
          <h3>{{ autoridad.nombre_autoridad }}</h3>
          <span class="designation">{{ autoridad.cargo_autoridad }}</span>
          
          <ul class="teachers-follow">
            <li v-if="autoridad.facebook_autoridad?.trim() && $isSafeLink(autoridad.facebook_autoridad)">
              <a :href="autoridad.facebook_autoridad.trim()" 
                 target="_blank" 
                 rel="noopener noreferrer">
                <i class="fa fa-facebook" aria-hidden="true"></i>
              </a>
            </li>

            <li v-if="autoridad.twiter_autoridad?.trim() && $isSafeLink(autoridad.twiter_autoridad)">
              <a :href="autoridad.twiter_autoridad.trim()" 
                 target="_blank" 
                 rel="noopener noreferrer">
                <i class="fa fa-twitter" aria-hidden="true"></i>
              </a>
            </li>

            <li v-if="autoridad.celular_autoridad">
              <a :href="buildWhatsAppUrl(autoridad.celular_autoridad)" 
                 target="_blank" 
                 rel="noopener noreferrer">
                <i class="fa fa-whatsapp" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
        </li>
      </ul>

      <div class="text-center mt-3" v-if="pager > 1">
        <button @click.prevent="prevPage" :disabled="pag <= 1" class="btn btn-sm" type="button">
          « Anterior
        </button>
        <span class="mx-2">{{ pag }} / {{ pager }}</span>
        <button @click.prevent="nextPage" :disabled="pag >= pager" class="btn btn-sm" type="button">
          Siguiente »
        </button>
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
          colorinstitucion: [],
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
      const url = process.env.VUE_APP_UPLOADS_URL?.trim();
      if (process.env.VUE_APP_ENV === 'production' && !url) {
        return '';
      }
      return url;
    },
  },
  
  methods: {
    applyInstitutionColors() {
      const colors = this.institucionData?.colorinstitucion;
      
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
    
    buildSafeImageUrl(path) {
      if (!path) return '';
      const cleaned = String(path).trim();
      if (cleaned.startsWith('http')) {
        return cleaned.replace('http://', 'https://');
      }
      const base = this.imageUrl?.replace(/\/$/, '');
      return `${base}${cleaned.startsWith('/') ? cleaned : `/${cleaned}`}`;
    },
    
    buildWhatsAppUrl(celular) {
      if (!celular) return '#';
      const cleaned = String(celular).replace(/[^0-9]/g, '');
      return `https://wa.me/+591${cleaned}`;
    },
    
    updatePager() {
      const total = this.autoridadesList?.length || 0;
      this.pager = Math.ceil(total / this.NUM_RESULTS);
      if (this.pag > this.pager && this.pager > 0) this.pag = this.pager;
      if (this.pag < 1) this.pag = 1;
    },
    
    prevPage() {
      if (this.pag > 1) {
        this.pag--;
        this.scrollToAuthorities();
      }
    },
    
    nextPage() {
      if (this.pag < this.pager) {
        this.pag++;
        this.scrollToAuthorities();
      }
    },
    
    goToPage(page) {
      if (page >= 1 && page <= this.pager) {
        this.pag = page;
        this.scrollToAuthorities();
      }
    },
    
    scrollToAuthorities() {
      const section = document.querySelector('.browse-teacher');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
  },
  
  watch: {
    institucionData: {
      handler() { 
        this.updatePager();
        this.pag = 1;
        this.applyInstitutionColors();
      },
      immediate: true,
      deep: true
    },
  },
  
  created() {
    this.$store.commit("loading");
    this.updatePager();
    this.applyInstitutionColors();
  },
  
  mounted() {
    this.$nextTick(() => {
      this.applyInstitutionColors();
    });
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
  text-align: justify; 
  line-height: 1.8; 
}
.mt-3 { 
  margin-top: 1rem; 
}
.mx-2 { 
  margin: 0 0.5rem; 
}
.mission-vision-section { 
  padding: 60px 0; 
  background: #f8f9fa; 
}
.mission-vision-section .container-fluid { 
  max-width: 1400px; 
  margin: 0 auto; 
  padding: 0 30px;
 }
.our_solution_category { 
  display: flex; 
  flex-direction: row; 
  flex-wrap: wrap; 
}
.our_solution_category .solution_cards_box { 
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
}
.solution_cards_box .solution_card { 
  flex: 0 50%; 
  background: #fff; 
  box-shadow: 0 2px 4px 0 rgba(185, 186, 194, 0.2), 0 5px 15px 0 rgba(90, 91, 99, 0.15); border-radius: 15px; 
  padding: 40px 45px;
  position: relative; 
  z-index: 1; 
  overflow: visible; 
  min-height: auto; 
  height: auto; 
  transition: 0.7s; 
  display: flex; 
  flex-direction: column; 
  pointer-events: auto; 
  border-left: 4px solid var(--main-color, #C00014); 
}
.solution_cards_box 
.solution_card:hover { 
  background: var(--main-color, #C00014); 
  color: #fff; 
  transform: scale(1.05); 
  z-index: 10; 
  pointer-events: auto; 
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2); 
}
.solution_cards_box .solution_card:hover::before { 
  background: rgba(183, 187, 204, 0.1); 
}
.solution_cards_box 
.solution_card:hover 
.solu_title h3, 
.solution_cards_box 
.solution_card:hover 
.solu_description p, 
.solution_cards_box 
.solution_card:hover 
.solu_title i { 
  color: #fff; 
}
.solution_cards_box 
.solution_card:before { 
  content: "";
  position: absolute; background: rgba(98, 99, 102, 0.05); width: 100%; height: 100%; z-index: -1; transform: rotate(42deg); right: -56px; top: -23px; border-radius: 35px; }
.solution_card .solu_title { position: relative; z-index: 1; margin-bottom: 20px; }
.solution_card .solu_title h3 { font-size: 28px; margin-bottom: 15px; word-wrap: break-word; font-weight: 700; color: var(--main-color, #C00014); display: flex; align-items: center; gap: 10px; }
.solution_card .solu_title i { font-size: 24px; color: var(--main-color, #C00014); }
.solution_card .solu_description { flex: 1; overflow: visible; position: relative; z-index: 1; }
.solution_card .solu_description p { font-size: 16px; margin-bottom: 0; line-height: 1.8; overflow: visible; word-wrap: break-word; hyphens: auto; color: #555; }
.hover_color_bubble { position: absolute; background: rgba(143, 148, 172, 0.15); width: 200px; height: 200px; border-radius: 50%; top: -50px; right: -50px; z-index: 0; transition: 0.7s; pointer-events: none; }
.solution_cards_box .solution_card:hover .hover_color_bubble { top: 50%; right: 50%; transform: translate(50%, -50%); opacity: 0.3; }
.vision-card { border-left-color: var(--main-color-2, #0B1C6B); }
.vision-card .solu_title h3, .vision-card .solu_title i { color: var(--main-color-2, #0B1C6B); }
.mission-card { border-left-color: var(--main-color-3, #32312F); }
.mission-card .solu_title h3, .mission-card .solu_title i { color: var(--main-color-3, #32312F); }
.browse-teacher { background: #f8f9fa; }
.browse-teachers-list { display: flex; flex-wrap: wrap; margin: 0 -15px; }
.browse-teachers-list > li { padding: 0 15px; margin-bottom: 30px; list-style: none; }
.browse-teachers-list figure { margin: 0 0 15px 0; text-align: center; }
.browse-teachers-list figure img { border-radius: 50%; border: 4px solid var(--main-color, #C00014); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15); transition: transform 0.3s ease; }
.browse-teachers-list figure img:hover { transform: scale(1.05); }
.browse-teachers-list h3 { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 5px; text-align: center; }
.browse-teachers-list .designation { display: block; font-size: 14px; color: var(--main-color, #C00014); margin-bottom: 15px; text-align: center; }
.teachers-follow { display: flex; justify-content: center; gap: 10px; padding: 0; margin: 0; list-style: none; }
.teachers-follow li a { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: var(--main-color, #C00014); color: #fff; font-size: 16px; transition: all 0.3s ease; text-decoration: none; }
.teachers-follow li a:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); background: var(--main-color-2, #0B1C6B); }
.btn { padding: 8px 16px; background: var(--main-color, #C00014); color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; transition: all 0.3s ease; }
.btn:hover:not(:disabled) { background: var(--main-color-2, #0B1C6B); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(192, 0, 20, 0.3); }
.btn:disabled { background: #ccc; cursor: not-allowed; opacity: 0.6; }
.btn-sm { padding: 6px 12px; font-size: 0.9rem; }
.text-center { text-align: center; }
@media (max-width: 768px) {
  .mission-vision-section .container-fluid { padding: 0 15px; }
  .solution_cards_box .solution_card { padding: 30px 25px; margin-bottom: 30px; }
  .solution_card .solu_title h3 { font-size: 24px; }
  .solution_card .solu_description p { font-size: 15px; line-height: 1.6; }
  .hover_color_bubble { width: 150px; height: 150px; }
  .browse-teachers-list > li { width: 100%; max-width: 100%; flex: 0 0 100%; }
}
@media screen and (min-width: 320px) { .our_solution_category { width: 100%; margin: 8px auto; } .our_solution_category .solution_cards_box { flex: auto; } }
@media only screen and (min-width: 768px) { .our_solution_category .solution_cards_box { flex: 1; } }
@media only screen and (min-width: 1024px) { .our_solution_category { width: 80%; margin: 8px auto; } }
</style>