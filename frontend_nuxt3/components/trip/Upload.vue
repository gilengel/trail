<template>
  <LayoutTTile title="Trip Upload">
    <FormsSingleLineText
      @value-changed="routeNameChanged"
      support-text="Trip Name"
    />

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
  </LayoutTTile>
</template>

<script setup lang="ts">
import { useRouteUpload } from "~/composables/useUpload";

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
