<template>
  <v-card variant="outlined">
    <template #title>
      <span data-cy="overview-title">My Latest Trips</span>
    </template>
    <v-card-text>
      <v-list lines="one">
        <v-list-item
          v-for="trip in routes"
          :key="trip.id"
          :title="trip.name"
          @click="onTripClicked(trip)"
        />
      </v-list>


      <h2
        v-if="!networkError && routes?.length == 0"
        data-cy="error-empty-text"
      >
        😞 Looks like you don't have any trips stored yet
      </h2>
      <h2
        v-if="networkError"
        data-cy="error-network-text"
      >
        😞 Looks like there was a network problem.
      </h2>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type {RouteWithoutSegments} from "~/types/types";

const emit = defineEmits<(e: "selectedTripChanged", id: number) => void>();

/**
 * @param trip
 */
function onTripClicked(trip: RouteWithoutSegments) {
  emit('selectedTripChanged', trip.id)
}

const networkError = ref(false);

const {data: routes} = await useFetch<RouteWithoutSegments[]>("/api/routes")

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
