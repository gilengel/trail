<template>
  <v-row>
    <v-col cols="12">
      <v-card
          title="Add Route"
          class="rounded-sm"
          variant="flat"
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
              @on-files-changed="onFilesChanged"
              @on-segment-name-changed="onNameChanged"
              @on-segment-description-changed="onDescriptionChanged"
          />
          <span
              v-if="status"
              data-cy="status-msg"
          >{{ status }}</span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import {useUpload} from "~/composables/useUpload";
import {usePatch} from "~/composables/usePatch";
import type {GPXFile} from "~/types/gpx";
import type {RouteDto, RouteSegmentDto} from "~/types/dto";

const status: Ref<string> = ref("");

const files: Ref<File[]> = ref([]);

const routeName: Ref<string> = ref("");

interface Props {
  tripId: number;
}

const props = defineProps<Props>();

const emptyRoute: Ref<RouteDto | null> = ref(null);

const addedSegments: Ref<RouteSegmentDto[]> = ref([]);

async function createEmptyRoute(): Promise<RouteDto> {
  return await useUpload<RouteDto>('/api/routes', {
    tripId: props.tripId
  });
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
      const newRouteSegment = await useUpload<RouteSegmentDto>('/api/routes/segment', {
        name: segment.name,
        coordinates: segment.coordinates,
        routeId: emptyRoute.value.id
      });

      addedSegments.value.push(newRouteSegment);
    }
  }

  files.value = trips;
}

async function onNameChanged(index: number, name: string): Promise<void> {
  await usePatch(`/api/routes/segment/${addedSegments.value[index].id}`, {
    name
  });
}

async function onDescriptionChanged(index: number, description: string): Promise<void> {
  await usePatch(`/api/routes/segment/${addedSegments.value[index].id}`, {
    description
  });
}

async function routeNameChanged() {
  if (emptyRoute.value === null) {
    emptyRoute.value = await createEmptyRoute();
  }

  emptyRoute.value.name = routeName.value;
  await usePatch(`/api/routes/${emptyRoute.value.id}`, {name: routeName.value});
}
</script>