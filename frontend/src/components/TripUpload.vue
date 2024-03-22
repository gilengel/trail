<template>
  <Tile>
    <h1 data-testid="upload">Trip Upload</h1>

    <DropZone :allowed-file-extensions="['gpx']" @onFilesChanged="onFilesChanged"></DropZone>

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

function uploadTrips(trips: File[]) {
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

function onFilesChanged(trips: File[]) {
  uploadTrips(trips)
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
