<template>
  <main>
    <NuxtLayout name="page">
      <template #toolbar>
        <ToolbarTToolbar class="focused-toolbar">
          <ToolbarTToolbarButton
            data-cy="button-edit"
            icon="las la-edit"
            @click="$router.push({ path: `../${route.params.id}/edit` })"
          />
        </ToolbarTToolbar>
      </template>

      <template #content>
        <NuxtPage />
      </template>

      <template #overview>
        <TripMap :trip="trip!" ref="map" class="map" />
      </template>
    </NuxtLayout>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

import type { RouteDto } from "~/components/route";
import { TripDto2MapLibreTrip } from "~/data/routes/types";

const route = useRoute();

const { data: tripDto } = await useApiFetch<RouteDto>(
  `/routes/${route.params.id}`
);

const trip = TripDto2MapLibreTrip(tripDto.value!);

provide("trip", trip);
</script>

<style lang="scss" scoped>
.focused-toolbar {
  background-color: rgba($yellow, 0.1);
}
</style>
