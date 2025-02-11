<template>
  <main>
    <NuxtLayout name="page">
      <template #primary-toolbar>
        <v-list>
          <v-list-item
            color="primary"
            rounded="xl"
            prepend-icon="las la-arrow-left"
            @click="$router.push({ path: '../feed' })"
          />
        </v-list>
      </template>

      <template #content>
        <BuilderWidgetLayout
          v-if="grid"
          :grid
        />
      </template>
    </NuxtLayout>
  </main>
</template>

<script setup lang="ts">
import * as uuid from 'uuid';
import type {Reactive} from "vue";
import type {TripDto} from "~/types/route";
import type {Grid} from "~/types/grid";

let grid: Reactive<Grid> | undefined = undefined;
try {
  await $fetch<TripDto>(`/api/trips/119`)
      .then((e) => {
        const a = e as object as { id: number, layout: Grid };
        grid = reactive(a.layout);
      });

} catch {
  grid = reactive({
    id: uuid.v4(),

    rows: [
      {
        id: uuid.v4(),
        columns: [
          {width: 4, id: uuid.v4()},
          {width: 8, id: uuid.v4()},
        ],
      },

      {
        id: uuid.v4(),
        columns: [
          {width: 4, id: uuid.v4()},
          {width: 4, id: uuid.v4()},
          {width: 4, id: uuid.v4()},
        ],
      },

      {
        id: uuid.v4(),
        columns: [
          {width: 6, id: uuid.v4()},
          {width: 6, id: uuid.v4()},
        ],
      },
    ],
  });
}

watch(grid!, async (newValue) => {
  await useGridSave(newValue)
})

</script>
