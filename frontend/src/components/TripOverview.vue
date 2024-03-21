<template>
  <Tile>
    <h1>Trip Overview</h1>
    <ul>
      <li v-for="trip in trips" :key="trip.id" v-on:click="emit('selectedTripChanged', trip.id)">
        {{ trip.name }}
      </li>
    </ul>

    <h2 v-if="trips.length == 0">😞 Looks like you don't have any trips stored yet</h2>
  </Tile>
</template>

<script setup lang="ts">
import Tile from './Tile.vue'

import { ref, type Ref } from 'vue'
import axios from 'axios'

interface RouteDto {
  id: number
  name: string
}

let trips: Ref<RouteDto[]> = ref([])

const emit = defineEmits<{
  (e: 'selectedTripChanged', id: number): void
}>()

axios
  .get('api/routes')
  .then((response) => (trips.value = response.data))
  .catch((error) => console.log(':)'))
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
