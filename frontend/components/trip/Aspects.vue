<template>
  <div class="d-flex ga-4 justify-center mt-5 py-2 aspects">
    <TripAspect :icon="tripIsLoop ? 'las la-circle-notch' : 'las la-route'">
      <span data-cy="trip-loop-indicator" v-if="tripIsLoop">Loop</span>
      <span data-cy="trip-route-indicator" v-else>Route</span>
    </TripAspect>
    <TripAspect icon="las la-hiking">
      <span v-if="tripLength">{{ Math.floor(tripLength / 1000) }}km</span>
    </TripAspect>
    <TripAspect icon="las la-mountain">
      <span v-if="ascending">Up {{ Math.floor(ascending) }}m</span><br />
      <span v-if="descending">Down {{ Math.floor(descending) }}m</span>
    </TripAspect>
    <TripAspect icon="las la-broadcast-tower" />
    <TripAspect icon="las la-cloud-sun" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  tripIsLoop: Boolean,
  tripLength: Number,
  ascending: Number,
  descending: Number,
});
</script>

<style lang="scss" scoped>
.aspects {
}
</style>