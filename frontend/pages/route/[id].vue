<template>
  {{ tripDto }}
  <NuxtPage/>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

import type {RouteDto} from "~/types/route";
import {type TripDto, TripDto2MapLibreTrip} from "~/data/routes/types";

const route = useRoute();


const {data: routeDto} = await useApiFetch<RouteDto>(
    `/api/routes/${route.params.id}`
);

const trip = TripDto2MapLibreTrip(routeDto.value!);

provide("trip", trip);
</script>
