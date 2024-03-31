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
      <TripUpload></TripUpload>
    </div>
    <div class="scroll">
      <TripOverview @selectedTripChanged="(id) => $router.push(`route/${id}`)"></TripOverview>
      <RouterLink data-testid="link-to-about" to="/about">Go to About</RouterLink>
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

  .scroll {
    max-height: 1000px;
    overflow: scroll;
  }
}
</style>
