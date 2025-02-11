<template>
  <NuxtPage />
</template>

<script setup lang="ts">
import {useTripStore} from "~/stores/trip";

definePageMeta({
  layout: false,
});


const route = useRoute();

const tripStore = useTripStore();
await tripStore.get(Number(route.params.id));

</script>
