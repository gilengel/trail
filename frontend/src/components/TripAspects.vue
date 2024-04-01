<template>
  <div class="tflex-row">
    <TripAspect :icon="tripIsLoop ? 'update' : 'multiple_stop'">
      <span data-cy="trip-loop-indicator" v-if="tripIsLoop">Loop</span>
      <span data-cy="trip-route-indicator" v-else>Route</span>
    </TripAspect>
    <TripAspect icon="nordic_walking">
      <span>{{ tripLength }}km</span>
    </TripAspect>
    <TripAspect icon="elevation" />
    <TripAspect icon="cell_tower" />
    <TripAspect icon="sunny" />
  </div>
</template>

<script setup lang="ts">
import TripAspect from '@/components/TripAspect.vue'

defineProps({
  tripIsLoop: Boolean,
  tripLength: Number
})
</script>

<style scoped></style>
