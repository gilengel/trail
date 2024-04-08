<template>
  <div data-cy="trip-details" class="trip-details">
    <div class="overview">
      <TMap data-cy="map-component" ref="map" />

      <ul>
        <li
          data-cy="trip-segment"
          class="segment"
          v-for="segment in trip.segments"
          :key="segment.id"
          @click="map?.zoomToSegment(segment)"
        >
          <div :style="{ 'background-color': segment.color }" class="tborder-radius"></div>
          <span>
            {{ segment.name }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import TMap from './map/TMap.vue'
import { type ExtendedLeafletSegment } from './map/map'

import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'flag-icons/css/flag-icons.min.css'

import { ref, type Ref, onMounted } from 'vue'
import { LeafletRoute, LeafletSegment } from '@/stores/route/types'

let map: Ref<InstanceType<typeof TMap> | null> = ref(null)

const tripSegments: Ref<ExtendedLeafletSegment[]> = ref([])

const props = defineProps({
  trip: {
    type: LeafletRoute,
    required: true
  },

  markers: Array<L.Marker>
})

function createSegment(dtoSegment: LeafletSegment): ExtendedLeafletSegment {
  var startIcon = L.divIcon({ className: 'marker-start-end', html: '<p>S</p>' })
  const startMarker = L.marker(dtoSegment.start as L.LatLng, { icon: startIcon }) // TODO: Don't enforce but check for null
  map.value?.add(startMarker)

  var endIcon = L.divIcon({ className: 'marker-start-end', html: '<p>E</p>' })
  const endMarker = L.marker(dtoSegment.end as L.LatLng, { icon: endIcon }) // TODO: Don't enforce but check for null
  map.value?.add(endMarker)

  /*
  dtoSegment
  const route = L.polyline(dtoSegment.coordinates, {
    color: dtoSegment.color,
    weight: 3,
    opacity: 1,
    smoothFactor: 1
  })
  */

  const route = dtoSegment.polyline
  map.value?.add(route)

  return {
    id: dtoSegment.id,
    name: dtoSegment.name,
    color: dtoSegment.color,
    start: startMarker,
    end: endMarker
  }
}

onMounted(() => {
  for (const segment of props.trip.segments) {
    const leafletSegment = createSegment(segment)
    tripSegments.value.push(leafletSegment)
  }

  if (!props.markers) {
    return
  }

  for (const marker of props.markers) {
    map.value?.add(marker)
  }

  map.value?.zoomToSegments(props.trip.segments)
})
</script>

<style lang="scss">
.trip-details {
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
