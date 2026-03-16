<template>
  <div class="main404">
    <div class="container_404">
      <h1>404</h1>
      <h5>
        La ruta asignada no existe. Si se trata de un error, contáctese con el desarrollador.
      </h5>
      <br />
      <button class="boton" @click="$router.go(-1)">
        <i class="fa fa-home"></i> Volver atrás
      </button>
    </div>
  </div>
</template>

<style scoped>
.main404 {
  display: block;
  width: 100vw;
  height: 100vh;
}
.container_404 {
  display: flex;
  width: 100%;
  height: 100%;
  margin: auto;
  padding: 250px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h1 {
  font-size: 250px;
  color: var(--main-color-3);
}
h5 {
  color: var(--main-color-3);
  font-weight: 500;
}
.boton {
  color: var(--main-color-3);
  padding: 10px 25px;
  border: 1px solid var(--main-color-3);
  border-radius: 100px;
}
.boton:hover {
  background-color: var(--main-color-3);
  color: white;
}
</style>

<script>
export default {
  name: "404Page",
  created() {
    this.$store.commit("loading");
  },
};
</script>