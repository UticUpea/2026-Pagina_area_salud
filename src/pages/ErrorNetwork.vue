<template>
  <div class="main404">
    <div class="container_404">
      <h1>ERROR DE RED</h1>
      <h5>
        Estamos teniendo problemas con los servidores; por favor, inténtelo más tarde.
      </h5>
      <br />
      <button class="boton" @click="reload()">
        <i class="fa fa-home"></i> Volver a intentarlo
      </button>
    </div>
  </div>
</template>

<style scoped>
* {
  user-select: none;
}
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
  font-size: 125px;
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
  methods: {
    reload() {
      this.$router.push("/");
    },
  },
  created() {
    this.$store.commit("loading");
  },
};
</script>