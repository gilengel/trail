<template>
  <v-card class="mx-xxl-auto mx-xl-auto mx-9 w-xxl-50 w-xl-50 w-fill c-inline-size" variant="outlined">
    <v-card-item>
      <v-card-title>{{ trip?.name }} </v-card-title>
    </v-card-item>

    <v-card-text>
      {{ trip?.description }}

      <TMap v-if="trip" :trip="trip" />

      <TripAspects
        :trip-is-loop="tripIsALoop"
        :trip-length="trip?.segments[0].length"
        :ascending="trip?.segments[0].accumulatedAscent"
        :descending="trip?.segments[0].accumulatedDescent"
      />
    </v-card-text>
  </v-card>

  <v-card
      class="mx-xxl-auto mx-9 w-xxl-50 w-fill"
      variant="outlined"
    v-for="segment in trip?.segments"
    :key="segment.id"
  >
    <v-card-item>
      <v-card-title>{{ segment.name }} </v-card-title>
    </v-card-item>

    <v-card-text>
      <TripImages :segment="segment" />
    </v-card-text>

    <v-card-actions>
      <v-list-item class="w-100">
        <template v-slot:prepend>
          <v-avatar
            color="grey-darken-3"
            image="https://randomuser.me/api/portraits/women/51.jpg"
          ></v-avatar>
        </template>

        <v-list-item-title>Anne Traveler</v-list-item-title>

        <v-list-item-subtitle>@traveler</v-list-item-subtitle>

        <template v-slot:append>
          <div class="justify-self-end">
            <v-icon class="me-1" icon="mdi-heart"></v-icon>
            <span class="subheading me-2">256</span>
            <span class="me-1">·</span>
            <v-icon class="me-1" icon="mdi-share-variant"></v-icon>
            <span class="subheading">45</span>
          </div>
        </template>
      </v-list-item>
    </v-card-actions>
  </v-card>


</template>

<script setup lang="ts">
import { computed, inject, type Ref } from "vue";
import type { MapLibreTrip } from "~/data/routes/types";
import TMap from "~/components/map/TMap.vue";

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

