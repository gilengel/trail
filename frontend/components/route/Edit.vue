<template>
  <v-card
      :title="title"
      class="rounded-sm"
  >
    <v-card-text>
      <v-text-field
          v-model="changedRouteData.routeName"
          label="Route Name"
          prepend-icon="las la-tag"
          variant="outlined"
          @keyup="routeNameChanged"
      />

      <v-textarea
          v-model="changedRouteData.routeDescription"
          label="Route Description"
          prepend-icon="las la-comment"
          variant="outlined"
          @keyup="routeDescriptionChanged"
      />

      <IconForm icon="las la-map-signs">
        <Map
            :segments="mapSegments"
            :interactive="false"
            v-if="mapSegments.length > 0"
        />
      </IconForm>
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
</template>

<script setup lang="ts">
import {useUpload} from "~/composables/useUpload";
import {usePatch} from "~/composables/usePatch";
import type {GPXFile} from "~/types/gpx";
import {RouteSegmentDto2MapLibreRouteSegment} from "~/types/route";
import type {RouteDto, RouteSegmentDto} from "~/types/dto";

const status: Ref<string> = ref("");
const files: Ref<File[]> = ref([]);
const addedSegments: Ref<RouteSegmentDto[]> = ref([]);

interface Props {
  route: RouteDto,
  title: string;
}

const props = defineProps<Props>();

const changedRouteData: Ref<{
  routeName?: string;
  routeDescription?: string;
}> = ref({routeName: props.route.name, routeDescription: props.route.description});

const mapSegments = computed(() => {
  if (!props.route.segments) {
    return [];
  }

  return props.route.segments.map((segment) => RouteSegmentDto2MapLibreRouteSegment(segment));
});

/**
 * @param trips
 */
async function onFilesChanged(trips: GPXFile[]): Promise<void> {

  for (const trip of trips) {
    const route = trip.routeDto;
    for (const segment of route!.segments) {
      const newRouteSegment = await useUpload<RouteSegmentDto>('/api/routes/segment', {
        name: segment.name,
        coordinates: segment.coordinates,
        routeId: props.route.id
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
  if (!changedRouteData.value.routeName || changedRouteData.value.routeName.length === 0) {
    return;
  }

  await usePatch(`/api/routes/${props.route.id}`, {name: changedRouteData.value.routeName});
}

async function routeDescriptionChanged() {
  if (!changedRouteData.value.routeDescription || changedRouteData.value.routeDescription.length === 0) {
    return;
  }

  await usePatch(`/api/routes/${props.route.id}`, {description: changedRouteData.value.routeDescription});
}
</script>