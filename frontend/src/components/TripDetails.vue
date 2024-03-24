<template>
  <div class="trip-details">
    <div class="main">
      <h1>Trip Details</h1>
      <span class="fi fi-no"></span> <span class="fi fi-se"></span>
      {{ trip?.name }}

      <ul>
        <li class="segment" v-for="item in trip?.segments" :key="item.id">
          <div :style="{ 'background-color': item.color }"></div>
          <span>
            {{ item.name }}
          </span>
        </li>
      </ul>
    </div>

    <div class="overview">
      <div class="map" id="map" />
      <ul>
        <li class="segment" v-for="item in trip?.segments" :key="item.id">
          <div :style="{ 'background-color': item.color }"></div>
          <span>
            {{ item.name }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tile from './Tile.vue'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'flag-icons/css/flag-icons.min.css'

import { onMounted, ref, watch, type Ref } from 'vue'
import axios from 'axios'

const props = defineProps(['routeId'])

onMounted(() => {
  mapElement.value = L.map('map').setView([23.8041, 90.4152], 6)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mapElement.value)
  tripLayer.value = L.featureGroup().addTo(mapElement.value)
})

function randomColor() {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)

  return `rgb(${r}, ${g}, ${b})`
}
function createSegment(coordinates: L.LatLng[], color: string) {
  if (!mapElement.value) {
    return
  }
  console.log(coordinates)

  const start = coordinates.slice(-1)[0]
  const startMarker = L.marker(start).addTo(mapElement.value)
  const endMarker = L.marker(coordinates[0]).addTo(mapElement.value)

  const line = L.polyline(coordinates, {
    color: color,
    weight: 3,
    opacity: 1,
    smoothFactor: 1
  }).addTo(mapElement.value)

  return {
    startMarker,
    endMarker,
    line
  }
}
function updateTrip(data: any) {
  trip.value = data

  // TODO: this is not necessary as at this point we can be sure that the trip returned from the backend is valid -> for the moment we need it due to the any type
  if (!trip.value || !mapElement.value || !tripLayer.value) {
    return
  }

  console.log(data)

  tripLayer.value.clearLayers()
  for (const segment of trip.value.segments) {
    segment.color = randomColor()
    let result: number[][] = segment.coordinates.filter(
      (coordinateTuple) => coordinateTuple.length == 3
    )
    const coordinates = result.map((coordinate) => new L.LatLng(coordinate[0], coordinate[1]))

    const leafletSegment = createSegment(coordinates, segment.color)
    tripLayer.value.addLayer(leafletSegment?.startMarker as L.Layer)
  }

  mapElement.value.panTo(tripLayer.value.getBounds().getCenter(), { animate: true })

  //mapElement.value.fitBounds(tripLayer.getBounds())
}

watch(
  () => props.routeId,
  (newRouteId) => {
    axios
      .get(`/api/routes/${newRouteId}`)
      .then((response) => updateTrip(response.data))
      .catch((error) => console.log(error))
  }
)

interface RouteDto {
  id: number
  name: string
  segments: RouteSegmentDto[]
}

interface RouteSegmentDto {
  id: number
  name: string
  coordinates: number[][]
  color: string
}

let trip: Ref<RouteDto | null> = ref(null)

let zoom = ref(9)
let center = ref([47.41322, -1.219482])

const mapElement: Ref<L.Map | null> = ref(null)
const tripLayer: Ref<L.FeatureGroup | null> = ref(null)
</script>

<style lang="scss">
.trip-details {
  // TODO: replace this placeholder position with relative, correct one
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;

  color: black;

  display: flex;

  .main {
    border-right: rgb(230, 230, 230) 1px solid;
    flex-grow: 2;

    ul {
      position: relative;
      list-style: none;
      padding: 0;
      margin-left: 1em;

      li.segment {
        display: flex;
        align-items: center;

        height: 3em;

        div {
          width: 2em;
          height: 2em;
          border-radius: 1em;

          margin-right: 0.5em;
        }

        span {
          font-family: 'Amatic SC', cursive;
          font-size: 2em;
        }
      }
    }

    ul:before {
      z-index: -1;
      $border-width: 2px;
      position: absolute;
      left: calc(1em - $border-width / 2);
      top: 1em;
      bottom: 1em;
      display: block;
      content: ' ';
      background: rgb(230, 230, 230);
      width: $border-width;
    }
  }

  .overview {
    min-width: 600px; // TODO: not use pixels

    padding: 1em;
    .map {
      aspect-ratio: 1/1;
      width: 100%;
    }

    ul {
      list-style: none;
      padding: 0;

      li.segment {
        display: flex;
        align-items: center;

        height: 3em;

        div {
          width: 8px;
          height: 2em;

          margin-right: 0.5em;
        }
      }
    }
  }

  .fi {
    position: relative;
    width: 6em;
    height: 4.5em;
    border: solid 1px rgb(230, 230, 230);
    margin: 20px;
    margin-right: 10px;
    margin-left: 10px;
  }
  .fi::before {
    border: solid 1px rgb(230, 230, 230);
    content: ' ';

    position: absolute;
    left: -10px;
    right: -10px;
    top: -10px;
    bottom: -10px;
  }
}
</style>
