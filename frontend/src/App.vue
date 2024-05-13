<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
body {
  @import './style/layout';
  @import './style/border';

  background: #90a17d;
  background: white;

  #app {
    color: black;
    height: 2000px;
    container-type: inline-size;
  }
}
</style>
