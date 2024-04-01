<template>
  <div data-cy="map-container" class="map" id="map" />
</template>

<script setup lang="ts">
import L from 'leaflet'
import { onMounted, ref, type Ref } from 'vue'
import { LeafletSegment } from '@/stores/route/types'

const mapElement: Ref<L.Map | null> = ref(null)

defineExpose({
  add,
  zoomToSegment,
  panTo,
  fitBounds
})

function zoomToSegment(segment: LeafletSegment) {
  segment.polyline.options.weight = 10
  fitBounds(segment.polyline.getBounds())
  panTo(segment.polyline.getBounds().getCenter())
}

function panTo(coordinate: L.LatLng) {
  mapElement.value?.panTo(coordinate, { animate: true })
}

function fitBounds(bounds: L.LatLngBounds) {
  mapElement.value?.fitBounds(bounds)
}

function add(element: L.Layer) {
  mapElement.value?.addLayer(element)
}

onMounted(() => {
  mapElement.value = L.map('map').setView([23.8041, 90.4152], 6)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mapElement.value)
  //tripLayer.value = L.featureGroup().addTo(mapElement.value)
})
</script>

<style scoped lang="scss">
.map {
  aspect-ratio: 1/1;
  width: 100%;
}
</style>
