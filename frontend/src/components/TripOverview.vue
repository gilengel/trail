<template>
  <TTile>
    <h1 data-cy="trip-overview-h">Trip Overview</h1>
    <ul>
      <li
        data-cy="trip-entry"
        v-for="trip in routeStore.routesWithoutSegments"
        :key="trip.id"
        v-on:click="emit('selectedTripChanged', trip.id)"
      >
        {{ trip.name }}
      </li>
    </ul>

    <h2
      data-cy="error-empty-text"
      v-if="!routeStore.networkError && routeStore.routesWithoutSegments?.length == 0"
    >
      😞 Looks like you don't have any trips stored yet
    </h2>
    <h2 data-cy="error-network-text" v-if="routeStore.networkError">
      😞 Looks like there was a network problem.
    </h2>
  </TTile>
</template>

<script setup lang="ts">
import TTile from './TTile.vue'

import { useRouteStore } from '@/stores/route'

const routeStore = useRouteStore()

const emit = defineEmits<{
  (e: 'selectedTripChanged', id: number): void
}>()
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
