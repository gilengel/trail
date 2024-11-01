<template>
  <v-card variant="outlined">
    <template v-slot:title >
      <span data-cy="overview-title">My Latest Trips</span>
    </template>
    <v-card-text>
      <v-list lines="one">
        <v-list-item
            v-for="trip in routes"
            :key="trip.id"
            :title="trip.name"
            @click="onTripClicked(trip)"
        ></v-list-item>
      </v-list>


    <h2 data-cy="error-empty-text" v-if="!networkError && routes?.length == 0">
      😞 Looks like you don't have any trips stored yet
    </h2>
    <h2 data-cy="error-network-text" v-if="networkError">
      😞 Looks like there was a network problem.
    </h2>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { RouteWithoutSegments } from "~/data/routes/types";

function onTripClicked(trip: RouteWithoutSegments) {
  emit('selectedTripChanged', trip.id)
}

const networkError = ref(false);
const { data: routes } = await useApiFetch<RouteWithoutSegments[]>("/routes", {
  onResponseError({ request, response, options }) {
    networkError.value = true;
  },
});

const emit = defineEmits<(e: "selectedTripChanged", id: number) => void>();
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  padding: 0;

  max-height: 50vh;

  overflow: scroll;
  li {
    //color: $text;
    padding: 8px 16px;
  }

  li:hover {
    cursor: pointer;
    //background: $primary;
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
