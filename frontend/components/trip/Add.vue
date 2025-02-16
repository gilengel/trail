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
      <DropZone
          support-text="Trip Files (allowed are files of type gpx)"
          :allowed-file-extensions="['gpx']"
          @on-files-changed="onFilesChanged"
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
import {useDelete} from "~/composables/useDelete";
import type {RouteDto} from "~/types/route";
import {usePatch} from "~/composables/usePatch";

const status: Ref<string> = ref("");

const files: Ref<File[]> = ref([]);

const routeName: Ref<string> = ref("");

interface Props {
  tripId: number;
}

const props = defineProps<Props>();

let emptyRoute: RouteDto;

onMounted(async () => {
  emptyRoute = await createEmptyRoute();
})

onUnmounted(async () => {
  if (emptyRoute.name !== undefined || emptyRoute.segments.length > 0) {
    return;
  }

  await useDelete(`/api/routes/${emptyRoute.id}`)
})


async function createEmptyRoute(): Promise<RouteDto> {
  return await useUpload('/api/routes', {
    tripId: props.tripId
  }) as Promise<RouteDto>;
}

/**
 * @param trips
 */
function onFilesChanged(trips: File[]) {
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
function routeNameChanged() {
  emptyRoute.name = routeName.value;
  usePatch(`/api/routes/${emptyRoute.id}`, {name: routeName.value})
      .then((r) => console.log(routeName.value))
      .catch((e) => console.error(e));




}
</script>