<template>
  <v-app
    id="app"
    class="app"
  >

    <alert-container class="app__alert-container"/>

    <v-content class="app__content">
      <router-view/>
    </v-content>

  </v-app>
</template>

<style scoped lang="scss">
.app {
  position: relative;
  min-width: 100%;
  display: flex;
  font-size: 18px;

  &__alert-container {
    position: absolute;
    top: 5px;
    right: 10px;
    width: 400px;
    z-index: 99;
  }

  &__content {
    display: flex;
    flex: 1;
    min-width: 600px;
    max-width: 600px;
    margin: 50px auto;
  }
}
</style>
