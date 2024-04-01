<template>
  <TTile>
    <h1 data-cy="upload-header">Trip Upload</h1>

    <DropZone :allowed-file-extensions="['gpx']" @onFilesChanged="onFilesChanged"></DropZone>
    <span data-cy="status-msg" v-if="status">{{ status }}</span>
    <AnimatedButton title="Upload Trip" />
  </TTile>
</template>

<script setup lang="ts">
import TTile from './TTile.vue'
import AnimatedButton from './AnimatedButton.vue'
import DropZone from './DropZone.vue'
import { ref, type Ref } from 'vue'
import { useRouteStore } from '@/stores/route'

const routeStore = useRouteStore()

const status: Ref<String> = ref('')

function onFilesChanged(trips: File[]) {
  routeStore
    .addRoute(trips)
    .then(() => (status.value = ':)'))
    .catch(() => (status.value = ':/'))
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
