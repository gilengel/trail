<template>
  <main>
    <div class="toolbars">
      <ToolbarTToolbar>
        <ToolbarTToolbarButton
          icon="las la-hand-point-left"
          @click="$router.push({ path: '/' })"
        ></ToolbarTToolbarButton>
      </ToolbarTToolbar>

      <router-view name="toolbar" class="focused-toolbar" />
    </div>

    <div class="details">
      <router-view name="content" />
      <NuxtPage />
    </div>

    {{ route.params.id }}

    <TripMap :trip="trip!" ref="map" class="map" />
  </main>
</template>

<script setup lang="ts">
import type { RouteDto } from "~/components/route";
import {
  MapLibreTrip,
  MapLibreSegment,
  TripDto2MapLibreTrip,
} from "~/stores/route/types";

const route = useRoute();

const { data: tripDto } = await useApiFetch<RouteDto>(
  `/routes/${route.params.id}`
);

const trip = TripDto2MapLibreTrip(tripDto.value!);

provide("trip", trip);
</script>

<style lang="scss" scoped>
main {
  width: 100%;
}

.focused-toolbar {
  background-color: rgba($yellow, 0.1);
}

@container (max-width: 1200px) {
  main {
    display: flex;
    flex-direction: column;
  }

  .toolbars {
    order: 0;
    display: flex;
  }

  .map {
    order: 1;
  }

  .details {
    order: 2;
  }
}

@container (min-width: 1200px) {
  .toolbars {
    border-right: rgb(230, 230, 230) 1px solid;
  }
  main {
    display: grid;
    grid-template-columns: 64px auto min-content;
  }
}

.details {
  padding: 1em;

  display: flex;
  flex-direction: column;

  justify-content: stretch;
  align-items: stretch;

  gap: 24px;
}
</style>
