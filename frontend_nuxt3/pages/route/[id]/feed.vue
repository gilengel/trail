<template>
  <LayoutTTile :title="trip?.name as string">
    <TripAspects
      :trip-is-loop="tripIsALoop"
      :trip-length="trip?.segments[0].length"
      :ascending="trip?.segments[0].accumulatedAscent"
      :descending="trip?.segments[0].accumulatedDescent"
    />
  </LayoutTTile>
  <LayoutTTile title="Description">
    <p>
      {{ trip?.description }}
    </p>
  </LayoutTTile>
  <LayoutTTile title="Feed">
    <TripFeedItem
      v-for="segment in trip?.segments"
      :key="segment.id"
      :segment="segment"
    />
  </LayoutTTile>
</template>

<script setup lang="ts">
import { computed, inject, type Ref } from "vue";
import type { MapLibreTrip } from "~/data/routes/types";

const trip: Ref<MapLibreTrip | null> = inject(
  "trip"
) as Ref<MapLibreTrip | null>;

const tripIsALoop = computed(() => {
  if (trip.value?.segments.length == 0) {
    return false;
  }

  return (
    trip.value?.segments[0] ==
    trip.value?.segments[trip.value?.segments.length - 1]
  );
});
</script>
