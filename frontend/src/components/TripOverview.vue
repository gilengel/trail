<template>
  <Tile>
    <h1 data-cy="trip-overview-h">Trip Overview</h1>
    <ul>
      <li
        data-cy="trip-entry"
        v-for="trip in trips"
        :key="trip.id"
        v-on:click="emit('selectedTripChanged', trip.id)"
      >
        {{ trip.name }}
      </li>
    </ul>

    <h2 data-cy="error-empty-text" v-if="!error && trips.length == 0">
      😞 Looks like you don't have any trips stored yet
    </h2>
    <h2 data-cy="error-network-text" v-if="error">😞 Looks like there was a network problem.</h2>
  </Tile>
</template>

<script setup lang="ts">
import Tile from './Tile.vue'

import { onMounted, ref, type Ref } from 'vue'
import axios from 'axios'

interface RouteDto {
  id: number
  name: string
}

let trips: Ref<RouteDto[]> = ref([])
let error: Ref<boolean> = ref(false)

const emit = defineEmits<{
  (e: 'selectedTripChanged', id: number): void
}>()

onMounted(() => {
  axios
    .get('/api/routes')
    .then((response) => {
      trips.value = response.data
    })
    .catch(() => (error.value = true))
})
</script>

<style lang="scss" scoped>
$yellow: #d79921;

ul {
  list-style: none;
  padding: 0;
  li {
    color: $yellow;
    padding: 0.5em;
  }

  li:hover {
    cursor: pointer;
    background: $yellow;
    color: black;
  }
}
</style>
