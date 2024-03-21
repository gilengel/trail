<template>
  <Tile>
    <h1 data-testid="upload">Trip Upload</h1>

    <DropZone :allowed-file-extensions="['svg']"></DropZone>

    <AnimatedButton title="Upload Trip" />
  </Tile>
</template>

<script setup lang="ts">
import Tile from './Tile.vue'
import AnimatedButton from './AnimatedButton.vue'
import DropZone from './DropZone.vue'
import { ref } from 'vue'
import axios from 'axios'

const fileInput = ref<HTMLInputElement | null>()
const files = ref<FileList | null>()

function uploadTrips(trips: FileList) {
  const formData = new FormData()

  for (var i = 0; i < trips.length; ++i) {
    formData.append(`file`, trips[i])
  }

  axios
    .post('api/routes/gpx', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => console.log(':/'))
    .catch((error) => console.log(':)'))
}

function onFilesUpload() {
  if (!files.value) {
    return
  }

  uploadTrips(files.value)
}

function onFilesChanged() {
  files.value = fileInput.value?.files
}
</script>

<style lang="scss" scoped>
@import '../style/button.scss';

input::file-selector-button {
  @include trail-button;
}

button {
  @include trail-button;
}
</style>
