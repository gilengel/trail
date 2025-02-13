<template>
  <v-card
    title="Upload"
    variant="outlined"
  >
    <v-card-text>
      <v-text-field
        label="Trip Name"
        variant="outlined"
        @value-changed="routeNameChanged"
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
    <v-card-actions>
      <v-btn
        :readonly="files.length === 0"
        variant="outlined"
        data-cy="upload-btn"
        @click="upload"
      >
        Upload Trip
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import {useRouteUpload} from "~/composables/useUpload";

const status: Ref<string> = ref("");

const files: Ref<File[]> = ref([]);

const routeName: Ref<string> = ref("");

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
function routeNameChanged(newValue: string) {
  routeName.value = newValue;
}
</script>