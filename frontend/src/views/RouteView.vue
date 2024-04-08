<template>
  <main class="tflex-row">
    <TToolbar>
      <TToolbarButton icon="arrow_back" @click="$router.push({ path: '/' })"></TToolbarButton>
      <TToolbarButton icon="add"></TToolbarButton>
    </TToolbar>

    <div class="tflex-row main">
      <div>
        <router-view></router-view>

        <TTile :title="trip?.name as string">
          <TripAspects :trip-is-loop="tripIsALoop" />
        </TTile>
        <TTile title="Description">
          <p>
            {{ trip?.description }}
          </p>
        </TTile>
        <TTile title="Feed">
          <TripFeedItem v-for="segment in trip?.segments" :key="segment.id" :segment="segment" />
        </TTile>
      </div>
    </div>
    <TripMap ref="map" :trip="trip" :markers="imageMarkers" v-if="trip" />
  </main>
</template>

<script setup lang="ts">
import { onMounted, type Ref, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import TTile from '@/components/layout/TTile.vue'
import TripAspects from '@/components/TripAspects.vue'
import TToolbar from '@/components/toolbar/TToolbar.vue'
import TToolbarButton from '@/components/toolbar/TToolbarButton.vue'
import TripFeedItem from '@/components/TripFeedItem.vue'
import TripMap from '@/components/TripMap.vue'
import { useRouteStore } from '@/stores/route'
import type { LeafletRoute } from '@/stores/route/types'
import { useImageStore } from '@/stores/image'
import type { ImageDto } from '@/stores/image/types'
import * as L from 'leaflet'

const route = useRoute()

const routeStore = useRouteStore()
const imageStore = useImageStore()

const map = ref(null)

let trip: Ref<LeafletRoute | null> = ref(null)
let images: Ref<ImageDto[]> = ref([])

let imageMarkers: Ref<L.Marker[]> = ref([])

onMounted(async () => {
  id.value = parseInt(route.params.id as string)

  trip.value = await routeStore.getRoute(id.value)

  trip.value.segments.forEach((s) => {
    imageStore
      .getImagesNearRouteSegment(s, 50000)
      .then((e) => {
        images.value = e

        for (const image of images.value) {
          imageMarkers.value.push(
            L.marker(new L.LatLng(image.coordinates[0], image.coordinates[1], image.coordinates[2]))
          )
        }
      })
      .catch((e) => {})
  })
})

const tripIsALoop = computed(() => {
  if (trip.value?.segments.length == 0) {
    return false
  }

  return trip.value?.segments[0] == trip.value?.segments[trip.value?.segments.length - 1]
})

const id: Ref<number | undefined> = ref(undefined)
</script>

<style lang="scss">
main {
  flex-grow: 1;
  display: flex;
}

.main {
  padding: 4em;
}

.btn-container {
  display: flex;
  gap: 1em;
}

.marker-start-end {
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  min-width: 2em;
  min-height: 2em;
  margin-left: -1em !important;
  margin-top: -1em !important;
  background-color: white;

  p {
    font-weight: bold;
  }
}
</style>
