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
            @click="$router.push({ path: '../edit/desktop' })"
          />
        </v-list>
      </template>


      <template #content>
        <v-row
          v-for="row in (trip?.layout as Grid).rows"
          :key="row.id"
        >
          <v-col
            v-for="col in row.columns"
            :key="col.id"
            :cols="col.width"
          >
            <!--
            TODO enable this with the new editor registration system
            <component
                :is="componentsMap[col.element.type]"
                v-bind="{element: col.element, selected: false} as object"
                v-if="col.element"
            />
            -->
          </v-col>
        </v-row>
      </template>
    </NuxtLayout>
  </main>
</template>

<script setup lang="ts">

import {useTripStore} from "~/stores/trip";
import type {Grid} from "@trail/grid-editor/grid";

const route = useRoute();

const tripStore = useTripStore();
const trip = await tripStore.get(Number(route.params.id));

</script>

