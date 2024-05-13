<template>
  <div class="tflex-row">
    <TripAspect :icon="tripIsLoop ? 'update' : 'multiple_stop'">
      <span data-cy="trip-loop-indicator" v-if="tripIsLoop">Loop</span>
      <span data-cy="trip-route-indicator" v-else>Route</span>
    </TripAspect>
    <TripAspect icon="nordic_walking">
      <span v-if="tripLength">{{ Math.floor(tripLength / 1000) }}km</span>
    </TripAspect>
    <TripAspect icon="elevation">
      <span v-if="ascending">Up {{ Math.floor(ascending) }}m</span><br />
      <span v-if="descending">Down {{ Math.floor(descending) }}m</span>
    </TripAspect>
    <TripAspect icon="cell_tower" />
    <TripAspect icon="sunny" />
  </div>
</template>

<script setup lang="ts">
import TripAspect from '@/components/TripAspect.vue'

defineProps({
  tripIsLoop: Boolean,
  tripLength: Number,
  ascending: Number,
  descending: Number
})
</script>

<style scoped lang="scss">
@import '../style/colors.scss';

.tflex-row {
  gap: 24px;
  border-top: solid 1px $border;
  border-bottom: solid 1px $border;
  padding-top: 1em;
  padding-bottom: 1em;
}

@container (max-width: 1200px) {
  .tflex-row {
    justify-content: center;
  }
}
</style>
