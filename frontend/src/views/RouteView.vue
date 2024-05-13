<template>
  <main>
    <div class="toolbars">
      <TToolbar>
        <TToolbarButton icon="arrow_back" @click="$router.push({ path: '/' })"></TToolbarButton>
      </TToolbar>

      <router-view name="toolbar" class="focused-toolbar" />
    </div>

    <div class="details">
      <!--
      <TTile :title="trip?.name as string">
        <TripAspects
          :trip-is-loop="tripIsALoop"
          :trip-length="trip?.segments[0].length"
          :ascending="trip?.segments[0].accumulatedAscent"
          :descending="trip?.segments[0].accumulatedDescent"
        />
      </TTile>
      <TTile title="Description">
        <p>
          {{ trip?.description }}
        </p>
      </TTile>
      <TTile title="Feed">
        <TripFeedItem v-for="segment in trip?.segments" :key="segment.id" :segment="segment" />
      </TTile>
    -->

      <router-view name="content" />
    </div>

    <TripMap ref="map" :trip="trip" :markers="imageMarkers" v-if="trip" class="map" />
  </main>
</template>

<script setup lang="ts">
import { onMounted, type Ref, ref, provide } from 'vue'
import { useRoute } from 'vue-router'
import TToolbar from '@/components/toolbar/TToolbar.vue'
import TToolbarButton from '@/components/toolbar/TToolbarButton.vue'
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

provide('trip', trip)

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
      .catch(() => {})
  })
})

const id: Ref<number | undefined> = ref(undefined)
</script>

<style lang="scss" scoped>
@import '@/style/colors';

main {
  width: 100%;
}

.focused-toolbar {
  background-color: rgba($yellow, 0.1);
}

@container (max-width: 1200px) {
  main {
    display: flex;
    flex-direction: column;
  }

  .toolbars {
    order: 0;
    display: flex;
  }

  .map {
    order: 1;
  }

  .details {
    order: 2;
  }
}

@container (min-width: 1200px) {
  .toolbars {
    border-right: rgb(230, 230, 230) 1px solid;
  }
  main {
    display: grid;
    grid-template-columns: 64px auto min-content;
  }
}

.details {
  padding: 1em;

  display: flex;
  flex-direction: column;

  justify-content: stretch;
  align-items: stretch;

  gap: 24px;
}

/*
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

@container (min-width: 1200px) {
  h1 {
    font-size: 3em;
    font-weight: normal;
  }
}
*/
</style>
