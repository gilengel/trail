<script setup lang="ts">
import TripUpload from '../components/TripUpload.vue'
import TripOverview from '../components/TripOverview.vue'
</script>

<template>
  <div data-cy="home-container" class="container">
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
  div {
    padding: 1em;

    div:nth-of-type(1) {
      width: 100%;
      height: 100%;
    }
  }
}

@container (min-width: 1200px) {
  .container {
    display: grid;
    grid-template-columns: 50% 50%;
    margin-top: 10vh;
    width: 80vw;
    height: 80vh;
  }
}
</style>
