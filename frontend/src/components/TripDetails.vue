<template>
  <div data-cy="trip-details" class="trip-details">
    <!--

    -->
    <div class="main">
      <div class="top-bar">
        <SingleLineText />
        <Button title="Edit" />
      </div>

      <h1>{{ trip?.name }}</h1>
      <div class="bar">
        <TripAspect :icon="tripIsALoop ? 'update' : 'multiple_stop'">
          <span data-cy="trip-loop-indicator" v-if="tripIsALoop">Loop</span>
          <span data-cy="trip-route-indicator" v-else>Route</span>
        </TripAspect>
        <TripAspect icon="nordic_walking">
          <span>{{ Math.round(tripLength) }}km</span>
        </TripAspect>
        <TripAspect icon="elevation" />
        <TripAspect icon="cell_tower" />
        <TripAspect icon="sunny" />
      </div>

      <h1>Description</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>

      <h1>Feed</h1>
      <TripFeedItem />
    </div>

    <div class="overview">
      <Map data-cy="map-component" ref="map" />

      <ul>
        <li
          data-cy="trip-segment"
          class="segment"
          v-for="segment in tripSegments"
          :key="segment.id"
          @click="map?.zoomToSegment(segment)"
        >
          <div :style="{ 'background-color': segment.color }"></div>
          <span>
            {{ segment.name }}
            {{ Math.round(segment.length) }}km
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import SingleLineText from './SingleLineText.vue'
import Button from './Button.vue'
import TripAspect from './TripAspect.vue'
import TripFeedItem from './TripFeedItem.vue'

import Map from './map/Map.vue'
import { type LeafletSegment } from './map/map'

import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'flag-icons/css/flag-icons.min.css'

import { ref, type Ref, computed, onMounted } from 'vue'
import axios from 'axios'

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

export interface TripDetailsProps {
  routeId: number
}
const props = withDefaults(defineProps<TripDetailsProps>(), {
  routeId: undefined
})

function randomColor() {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)

  return `rgb(${r}, ${g}, ${b})`
}

function createSegment(dtoSegment: RouteSegmentDto): LeafletSegment | null {
  let result: number[][] = dtoSegment.coordinates.filter(
    (coordinateTuple) => coordinateTuple.length == 3
  )
  const coordinates = result.map((coordinate) => new L.LatLng(coordinate[0], coordinate[1]))

  let distance = 0
  for (let i = 0; i < coordinates.length - 1; i++) {
    distance += coordinates[i].distanceTo(coordinates[i + 1])
  }

  const start = coordinates.slice(-1)[0]
  const startMarker = L.marker(start)
  map.value?.add(startMarker)

  const endMarker = L.marker(coordinates[0])
  map.value?.add(endMarker)

  const route = L.polyline(coordinates, {
    color: dtoSegment.color,
    weight: 3,
    opacity: 1,
    smoothFactor: 1
  })
  map.value?.add(route)

  return {
    id: dtoSegment.id,
    name: dtoSegment.name,
    color: dtoSegment.color,
    start: startMarker,
    end: endMarker,
    route,
    length: distance / 1000
  }
}

function updateTrip(data: RouteDto) {
  trip.value = data

  tripSegments.value.splice(0, tripSegments.value.length)

  for (const segment of trip.value.segments) {
    segment.color = randomColor()

    const leafletSegment = createSegment(segment) as LeafletSegment
    tripSegments.value.push(leafletSegment)
  }
}

function loadTrip(id: number) {
  if (!id) {
    return
  }

  axios.get(`/api/routes/${id}`).then((response) => updateTrip(response.data))
  //.catch((error) => console.log(error))
}

onMounted(() => {
  loadTrip(props.routeId)
})

let map: Ref<InstanceType<typeof Map> | null> = ref(null)
let trip: Ref<RouteDto | null> = ref(null)

const tripSegments: Ref<LeafletSegment[]> = ref([])

const tripLength = computed(() => {
  return tripSegments.value.reduce((partialSum, a) => partialSum + a.length, 0)
})

const tripIsALoop = computed(() => {
  if (tripSegments.value.length == 0) {
    return false
  }

  return tripSegments.value[0] == tripSegments.value[tripSegments.value.length - 1]
})
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

  h1 {
    margin-top: 1em;
    margin-bottom: 0.5em;

    font-family: 'Amatic SC', cursive;
    font-size: 3em;
  }

  // left side

  .main {
    border-right: rgb(230, 230, 230) 1px solid;
    flex-grow: 2;
    padding: 4em;

    .bar {
      display: flex;
      gap: 1em;
    }

    .top-bar {
      display: flex;
      justify-content: space-between;
    }

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
