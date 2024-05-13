<template>
  <SingleLineText :value="route?.name" @value-changed="routeNameChanged" support-text="Trip Name" />

  <SingleLineText
    :value="route?.description"
    @value-changed="routeDescriptionChanged"
    support-text="Trip Description"
  />

  {{ status }}

  <DropZone
    :allowed-file-extensions="['jpg', 'jpeg', 'tif', 'tiff']"
    @onFilesChanged="onFilesChanged"
  ></DropZone>
  <span data-cy="status-msg" v-if="status">{{ status }}</span>

  <div class="btn-container">
    <TButton data-cy="button-save" label="Save" @click="$router.push({ name: 'route-edit' })"
      ><TIcon icon="save"
    /></TButton>
  </div>
</template>

<script setup lang="ts">
import SingleLineText from '@/components/forms/SingleLineText.vue'
import DropZone from '@/components/DropZone.vue'
import TIcon from '@/components/TIcon.vue'
import TButton from '@/components/forms/TButton.vue'
import { LeafletRoute } from '@/stores/route/types'
import { useRouteStore } from '@/stores/route'
import { useImageStore } from '@/stores/image'
import { onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'

const routeStore = useRouteStore()
const imageStore = useImageStore()

const vueRoute = useRoute()

let route: Ref<LeafletRoute | null> = ref(null)

const status: Ref<String> = ref('')

function onFilesChanged(images: File[]) {
  console.log('STORE IMAGES')
  imageStore
    .addImages(images)
    .then(() => (status.value = ':)'))
    .catch(() => (status.value = ':/'))
}

async function routeNameChanged(newValue: string) {
  if (!route.value) {
    return
  }

  route.value.name = newValue
  routeStore.updateRoute(route.value)
}

async function routeDescriptionChanged(newValue: string) {
  if (!route.value) {
    return
  }

  route.value.description = newValue
  routeStore.updateRoute(route.value)
}

onMounted(async () => {
  const id = parseInt(vueRoute.params.id as string)

  route.value = await routeStore.getRoute(id)
})
</script>

<style scoped></style>
