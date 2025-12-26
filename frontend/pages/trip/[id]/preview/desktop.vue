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
            <component
              :is="editor.definitions.getComponent(col.element?.elementId)"
              v-bind="
                {
                  grid: trip?.layout as Grid,
                  element: col.element,
                  definition: editor.definitions.get(col.element?.elementId),
                  changeable: false,
                } as EditorElementProperties<any>
              "
              v-if="col.element"
            />
          </v-col>
        </v-row>
      </template>
    </NuxtLayout>
  </main>
</template>

<script setup lang="ts">
import { useTripStore } from "~/stores/trip";
import type { EditorElementProperties, Grid } from "@trail/grid-editor/grid";
import { EditorInjectionKey } from "@trail/grid-editor/editor";

// ---------------------------------------------------------------------------------------------------------------------

const route = useRoute();

const tripStore = useTripStore();

// ---------------------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey);
if (!editor) {
  throw new Error("Editor instance was not injected in Row");
}
// ---------------------------------------------------------------------------------------------------------------------

const trip = await tripStore.get(Number(route.params.id));
</script>
