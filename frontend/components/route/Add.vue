<template>

  <v-card
      title="Add Route"
      class="mx-xxl-auto mx-xl-auto mx-9 w-fill c-inline-size"
      variant="outlined"
  >
    <v-card-text>
      <v-text-field
          v-model="routeName"
          label="Route Name"
          prepend-icon="las la-tag"
          variant="outlined"
          @keyup="routeNameChanged"
      />
      <RouteDropZone
          support-text="Trip Files (allowed are files of type gpx)"
          :allowed-file-extensions="['gpx']"
          @onFilesChanged="onFilesChanged"
      />
      <span
          v-if="status"
          data-cy="status-msg"
      >{{ status }}</span>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {useRouteUpload, useUpload} from "~/composables/useUpload";
import {type RouteDto} from "~/types/route";
import {usePatch} from "~/composables/usePatch";
import type {GPXFile} from "~/types/gpx";

const status: Ref<string> = ref("");

const files: Ref<File[]> = ref([]);

const routeName: Ref<string> = ref("");

interface Props {
  tripId: number;
}

const props = defineProps<Props>();

let emptyRoute: Ref<RouteDto | null> = ref(null);

async function createEmptyRoute(): Promise<RouteDto> {
  return await useUpload('/api/routes', {
    tripId: props.tripId
  }) as Promise<RouteDto>;
}

/**
 * @param trips
 */
async function onFilesChanged(trips: GPXFile[]): Promise<void> {
  if (emptyRoute.value === null) {
    emptyRoute.value = await createEmptyRoute();
  }

  for (const trip of trips) {
    const route = trip.routeDto;
    for (const segment of route!.segments) {
      await useUpload('/api/routes/segment', {
        name: segment.name,
        coordinates: segment.coordinates,
        routeId: emptyRoute.value.id
      });
    }
  }

  files.value = trips;
}

/**
 *
 */
async function upload() {
  await useRouteUpload(routeName.value, files.value);
}

/**
 * @param newValue
 */
async function routeNameChanged() {
  if (emptyRoute.value === null) {
    emptyRoute.value = await createEmptyRoute();
  }

  emptyRoute.value.name = routeName.value;
  await usePatch(`/api/routes/${emptyRoute.value.id}`, {name: routeName.value});
}
</script>