<template>
  <TTile title="Trip Upload">
    <SingleLineText @value-changed="routeNameChanged" support-text="Trip Name" />

    <DropZone
      support-text="Trip Files (allowed are files of type gpx)"
      class="tflex-grow-2"
      :allowed-file-extensions="['gpx']"
      @onFilesChanged="onFilesChanged"
    ></DropZone>
    <span data-cy="status-msg" v-if="status">{{ status }}</span>
    <AnimatedButton data-cy="upload-btn" title="Upload Trip" @click="upload" />
  </TTile>
</template>

<script setup lang="ts">
import TTile from '@/components/layout/TTile.vue'
import AnimatedButton from '@/components/forms/AnimatedButton.vue'
import SingleLineText from '@/components/forms/SingleLineText.vue'
import DropZone from './DropZone.vue'
import { ref, type Ref } from 'vue'
import { useRouteStore } from '@/stores/route'

const routeStore = useRouteStore()

const status: Ref<String> = ref('')

const files: Ref<File[]> = ref([])

const routeName: Ref<string> = ref('')

function onFilesChanged(trips: File[]) {
  files.value = trips
}

function upload() {
  routeStore
    .addRoute(routeName.value, files.value)
    .then(() => (status.value = ':)'))
    .catch(() => (status.value = ':/'))
}

function routeNameChanged(newValue: string) {
  routeName.value = newValue
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
