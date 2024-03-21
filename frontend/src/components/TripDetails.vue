<template>
  <Tile>
    <h1>Trip Details</h1>
    {{ routeId }}
    {{ trip }}
  </Tile>
</template>

<script setup lang="ts">
import Tile from './Tile.vue'

import { ref, watch, type Ref } from 'vue'
import axios from 'axios'

const props = defineProps(['routeId'])

console.log(props.routeId)

watch(
  () => props.routeId,
  (newRouteId, oldRouteId) => {
    axios
      .get(`api/routes/${newRouteId}`)
      .then((response) => (trip.value = response.data))
      .catch((error) => console.log(':('))

    axios
      .get(`api/routes/length/${newRouteId}`)
      .then((response) => console.log(response.data))
      .catch((error) => console.log('length :('))
  }
)

interface RouteDto {
  id: number
  name: string
}

let trip: Ref<RouteDto | null> = ref(null)
</script>
