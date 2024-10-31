<template>
  <main>
    <NuxtLayout name="page">
      <template #toolbar>

        <v-list-item
            @click="$router.push({ path: 'edit' })"
            color="primary"
            rounded="xl"

            prepend-icon="mdi-pencil"

            title="Starred"
            value="starred"
        >

        </v-list-item>
      </template>

      <template #content>
        <NuxtPage />
      </template>

      <template #overview>
        <v-list>
          <v-list-item
              v-for="segment in tripDto?.segments"
              :key="segment.id"
              :title=segment.name
              link
          ></v-list-item>
        </v-list>
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
