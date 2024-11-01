<template>
  <v-card title="Upload" variant="outlined">
    <v-card-text>
      <v-text-field label="Trip Name" @value-changed="routeNameChanged" variant="outlined"></v-text-field>
      <DropZone
          support-text="Trip Files (allowed are files of type gpx)"
          :allowed-file-extensions="['gpx']"
          @onFilesChanged="onFilesChanged"
      />
      <span data-cy="status-msg" v-if="status">{{ status }}</span>
    </v-card-text>
    <v-card-actions>
      <v-btn
          :readonly="files.length === 0"
          variant="outlined"
             data-cy="upload-btn" @click="upload">Upload Trip
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import {useRouteUpload} from "~/composables/useUpload";

const status: Ref<string> = ref("");

const files: Ref<File[]> = ref([]);

const routeName: Ref<string> = ref("");

function onFilesChanged(trips: File[]) {
  files.value = trips;
}

async function upload() {
  const config = useRuntimeConfig();

  useRouteUpload(config, {
    name: routeName.value,
    files: files.value,
  });
}

function routeNameChanged(newValue: string) {
  routeName.value = newValue;
}
</script>