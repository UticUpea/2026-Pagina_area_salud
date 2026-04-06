<template>
  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>HISTORIA DE LA CARRERA</h1>
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
           v-html="$sanitize(institucionData?.institucion_historia) || '<p class=\'text-center\'>Cargando historia...</p>'">
        </p>
      </div>

      <div class="col-sm-4">
        <SidebarCustom />
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-wrap { text-align: justify; padding: 0 70px; }
h4 { margin-top: 5px; font-size: 15px; }
p { margin-bottom: 5px; }
.image-container { width: 100%; height: 300px; overflow: hidden; }
.thumbnail-img { width: 100%; height: 100%; object-fit: cover; }
.bg-overlay-img { background-image: url("@/assets/Fondo2.jpg"); }
.active-link { background: #540000; }
.content.left-aligned { color: inherit; line-height: 1.8; }
.content.left-aligned a { color: var(--main-color, #c00014); text-decoration: none; }
.content.left-aligned a:hover { color: var(--main-color-2, #0B1C6B); text-decoration: underline; }
</style>

<script>
import { mapState } from "vuex";
import SidebarCustom from "@/components/SidebarCustom.vue";

export default {
  name: "HistoriaView",
  
  components: {
    SidebarCustom,
  },
  
  computed: {
    ...mapState(["Institucion"]),
    
    institucionData() {
      const data = this.Institucion?.Descripcion || this.Institucion;
      if (!data || Object.keys(data).length === 0) {
        return { institucion_historia: '<p class="text-center">Cargando historia...</p>' };
      }
      return data;
    },
  },
  
  methods: {
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
};
</script>