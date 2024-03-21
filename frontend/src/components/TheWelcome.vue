<script setup lang="ts">
import TripUpload from './TripUpload.vue'
import TripOverview from './TripOverview.vue'
import TripDetails from './TripDetails.vue'

import { ref, type Ref } from 'vue'

const selectedRouteId: Ref<number | null> = ref(null)

const routes = ref(null)
fetch('http://localhost:3000/routes')
  .then((response) => response.json())
  .then((data) => (routes.value = data))
</script>

<template>
  <div class="container">
    <div>
      <TripUpload></TripUpload>
      <TripOverview @selectedTripChanged="(id) => (selectedRouteId = id)"></TripOverview>
    </div>
    <div>
      <TripDetails :route-id="selectedRouteId"></TripDetails>
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
}
</style>
