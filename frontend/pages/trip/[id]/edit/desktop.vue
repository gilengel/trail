<template>
  <main>
    <NuxtLayout name="page">
      <template #primary-toolbar>
        <v-list
          density="compact"
          nav
        >
          <v-list-item
            color="primary"
            rounded="xl"
            prepend-icon="las la-arrow-left"
            @click="$router.push({ path: '../feed' })"
          />
        </v-list>
      </template>


      <template #toolbar>
        <v-list
          density="compact"
          nav
        >
          <v-list-item

            color="primary"
            rounded="xl"
            prepend-icon="las la-glass-cheers"
            @click="$router.push({ path: '../preview/desktop' })"
          />
        </v-list>
      </template>
      <template #content>
        <BuilderWidgetLayout
          v-if="trip?.layout"
          :grid="trip.layout"
          :trip-id="trip.id"
        />
      </template>
    </NuxtLayout>
  </main>
</template>

<script setup lang="ts">

import {useTripStore} from "~/stores/trip";

const route = useRoute();

const tripStore = useTripStore();
const trip = await tripStore.get(Number(route.params.id));

</script>
