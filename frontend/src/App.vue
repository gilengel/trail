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
  display: flex;

  #app {
    flex-grow: 1;

    display: flex;
    flex-direction: row;

    color: black;
  }
}
</style>
