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
import { useRouteStore } from "@/stores/route";

const routeStore = useRouteStore();

const status: Ref<string> = ref("");

const files: Ref<File[]> = ref([]);

const routeName: Ref<string> = ref("");

function onFilesChanged(trips: File[]) {
  files.value = trips;
}

async function upload() {
  const config = useRuntimeConfig();

  const formData = new FormData();

  formData.append("name", routeName.value);
  for (const tripFile of files.value) {
    formData.append("files", tripFile);
  }

  await $fetch(`/routes/gpx`, {
    baseURL: config.public.baseURL,
    method: "POST",
    //headers: {
    //  "Content-Type": "multipart/form-data; boundary=MyBoundary",
    //},
    body: formData,
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
