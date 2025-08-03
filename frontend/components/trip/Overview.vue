<template>
  <v-card variant="flat">
    <template #title>
      <span data-cy="overview-title">My Latest Trips</span>
    </template>
    <v-card-text>
      <v-list lines="one">
        <v-list-item
          v-for="trip in trips.values()"
          :key="trip.id"
          :title="trip.name"
          @click="onTripClicked(trip)"
        />
      </v-list>


      <h2
        v-if="!networkError && trips.size === 0"
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

import type {TripDto} from "~/types/dto";

const tripStore = useTripStore();

const emit = defineEmits<(e: "selectedTripChanged", id: number) => void>();

/**
 * @param trip
 */
function onTripClicked(trip: TripDto) {
  emit('selectedTripChanged', trip.id);
}

const networkError = ref(false);

const trips = await tripStore.all();

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
