<template>
  <Tile>
    <h1 data-cy="upload-header">Trip Upload</h1>

    <DropZone :allowed-file-extensions="['gpx']" @onFilesChanged="onFilesChanged"></DropZone>
    <span data-cy="status-msg" v-if="status">{{ status }}</span>
    <AnimatedButton title="Upload Trip" />
  </Tile>
</template>

<script setup lang="ts">
import Tile from './Tile.vue'
import AnimatedButton from './AnimatedButton.vue'
import DropZone from './DropZone.vue'
import axios from 'axios'
import { ref, type Ref } from 'vue'

const status: Ref<String> = ref('')

function uploadTrips(trips: File[]) {
  const formData = new FormData()

  for (var i = 0; i < trips.length; ++i) {
    console.log(trips[i])
    formData.append(`file`, trips[i])
  }

  axios
    .post('/api/routes/gpx', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => (status.value = ':)'))
    .catch((error) => (status.value = ':/'))
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
