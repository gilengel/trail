<template>
  <main>
    <NuxtLayout name="page">
      <template #primary-toolbar>
        <v-list density="compact" nav>
          <v-list-item
            color="primary"
            rounded="xl"
            prepend-icon="las la-arrow-left"
            @click="$router.push({ path: '../feed' })"
          />
        </v-list>
      </template>

      <template #toolbar>
        <v-list density="compact" nav>
          <v-list-item
            color="primary"
            rounded="xl"
            prepend-icon="las la-glass-cheers"
            @click="$router.push({ path: '../preview/desktop' })"
          />
        </v-list>
      </template>
      <template #content>
        <GridEditor
          v-if="trip?.layout"
          :grid="trip.layout as Grid"
          :trip-id="trip.id"
          :save="useGridSave"
        />
      </template>
    </NuxtLayout>
  </main>
</template>

<script setup lang="ts">
import { useTripStore } from "~/stores/trip";
import { createDefaultGrid, type Grid } from "@trail/grid-editor/grid";
import { useGridSave } from "~/composables/useGridSave";

const route = useRoute();

const tripStore = useTripStore();
const trip = await tripStore.get(Number(route.params.id));

const grid = trip?.layout as Grid;

if (
  !grid ||
  !grid.rows ||
  grid.rows.filter(
    (row) => row === undefined || row === null || row.columns === undefined,
  ).length > 0
) {
  console.error("Grid was stored in an invalid state, revert to default");
  trip!.layout = createDefaultGrid(trip!.id);
}
</script>
