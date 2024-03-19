<script setup lang="ts">
import TripUpload from './TripUpload.vue'

import { ref } from 'vue';

const selectedRoute = ref(null);

const routes = ref(null);
fetch('http://localhost:3000/routes')
  .then(response => response.json())
  .then(data => routes.value = data);

</script>

<template>
  <div class="container">
    <div>
      <h1>Trip Overview</h1>
      <ul>
        <!--
        <li v-for="(route, i) in routes" :key="i" @click="selectedRoute = route.coordinates">
          {{ route.name }}
        </li>
      -->
      </ul>
      <h1 data-testid="upload">Trip Upload</h1>
      <TripUpload></TripUpload>
    </div>
    <div>
      <h1>World View</h1>
    </div>


  </div>
</template>

<style scoped lang="scss">
.container {
  margin: 0 auto;
  display: flex;
  width: 80vw;
  height: 80vh;
  justify-content: center;
  align-content: stretch;
  margin-top: 10vh;

  div {
    //border: solid 1px white;
    width: 50%;
    padding: 1em;

    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>