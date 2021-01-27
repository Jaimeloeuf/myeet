<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* Set all child components to inherit these styles */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* Standardise all input styles */
input {
  width: 80%;
  padding: 1.6em;

  background-color: rgb(240, 240, 240);

  border: none;
  border-radius: 0.6em;
}
</style>
