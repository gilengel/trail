<template>
  <NuxtPage />
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

import type { RouteDto } from "~/components/route";
import { TripDto2MapLibreTrip } from "~/data/routes/types";

const route = useRoute();

const { data: tripDto } = await useApiFetch<RouteDto>(
  `/api/routes/${route.params.id}`
);

const trip = TripDto2MapLibreTrip(tripDto.value!);

provide("trip", trip);
</script>
