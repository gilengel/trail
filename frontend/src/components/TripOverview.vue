<template>
  <TTile title="Trip Overview">
    <ul class="tborder tflex-grow-2">
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
import TTile from '@/components/layout/TTile.vue'

import { useRouteStore } from '@/stores/route'

const routeStore = useRouteStore()

routeStore.getRoutes()

const emit = defineEmits<{
  (e: 'selectedTripChanged', id: number): void
}>()
</script>

<style lang="scss" scoped>
@import '@/style/colors';

ul {
  list-style: none;
  padding: 0;

  max-height: 50vh;

  overflow: scroll;
  li {
    color: $text;
    padding: 0.5em;

    padding-left: 16px;
    padding-right: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  li:hover {
    cursor: pointer;
    background: $primary;
  }
}

/* width */
ul::-webkit-scrollbar {
  width: 10px;
}

/* Track */
ul::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
ul::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
ul::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
