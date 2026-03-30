<template>
  <!-- ==============================================
    ** Inner Banner **
    =================================================== -->
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

  <!-- ==============================================
    ** Blog Detail **
    =================================================== -->
  <div class="container blog-wrapper padding-lg">
    <div class="row">
      <div class="col-sm-8 blog-left">
        <!-- ✅ Sanitizar HTML antes de renderizar (protección XSS) -->
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
/* ✅ Tus estilos originales se mantienen 100% intactos */
.text-wrap {
  text-align: justify;
  padding: 0 70px;
}

h4 {
  margin-top: 5px;
  font-size: 15px;
}

p {
  margin-bottom: 5px;
}

.image-container {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bg-overlay-img {
  background-image: url("@/assets/Fondo2.jpg");
}

.active-link {
  background: #540000;
}
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
  
  created() {
    this.$store.commit("loading");
  },
};
</script>