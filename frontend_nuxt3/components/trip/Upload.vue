<template>
  <v-card title="Upload" variant="outlined">
    <v-card-text>
      <v-text-field label="Trip Name" @value-changed="routeNameChanged" variant="outlined"></v-text-field>
      <DropZone
          support-text="Trip Files (allowed are files of type gpx)"
          class="tflex-grow-2"
          :allowed-file-extensions="['gpx']"
          @onFilesChanged="onFilesChanged"
      />
      <span data-cy="status-msg" v-if="status">{{ status }}</span>
      <FormsAnimatedButton
          data-cy="upload-btn"
          title="Upload Trip"
          @click="upload"
      />
    </v-card-text>
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

<style lang="scss" scoped>
input::file-selector-button {
  @include trail-button;
}

button {
  @include trail-button;
}
</style>
