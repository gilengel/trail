<template>
  <TTile :title="trip?.name as string">
    <TripAspects
      :trip-is-loop="tripIsALoop"
      :trip-length="trip?.segments[0].length"
      :ascending="trip?.segments[0].accumulatedAscent"
      :descending="trip?.segments[0].accumulatedDescent"
    />
  </TTile>
  <TTile title="Description">
    <p>
      {{ trip?.description }}
    </p>
  </TTile>
  <TTile title="Feed">
    <TripFeedItem v-for="segment in trip?.segments" :key="segment.id" :segment="segment" />
  </TTile>
</template>

<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'

const trip: Ref<LeafletRoute | null> = inject('trip') as Ref<LeafletRoute | null>
import TTile from '@/components/layout/TTile.vue'
import TripAspects from '@/components/TripAspects.vue'
import TripFeedItem from '@/components/TripFeedItem.vue'
import type { LeafletRoute } from '@/stores/route/types'

const tripIsALoop = computed(() => {
  if (trip.value?.segments.length == 0) {
    return false
  }

  return trip.value?.segments[0] == trip.value?.segments[trip.value?.segments.length - 1]
})
</script>

<style scoped></style>
