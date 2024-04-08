<script setup lang="ts">
import TripUpload from '../components/TripUpload.vue'
import TripOverview from '../components/TripOverview.vue'

import { ref } from 'vue'

const routes = ref(null)
fetch('http://localhost:3000/routes')
  .then((response) => response.json())
  .then((data) => (routes.value = data))
</script>

<template>
  <div class="container">
    <div>
      <TripUpload />
    </div>
    <div>
      <TripOverview @selectedTripChanged="(id) => $router.push(`route/${id}/feed`)"></TripOverview>
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

    div:nth-of-type(1) {
      width: 100%;
      height: 100%;
    }
  }

  .scroll {
    max-height: 1000px;
    overflow: scroll;
  }
}
</style>
