<template>
  <TMap :segments="segments" />
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useTripStore} from "~/stores/trip";
import type {MapLibreSegment} from "~/types/route";

const props = defineProps({
  segments: {
    type: Array as PropType<number[]>,
    default: () => []
  }
});

const route = useRoute();
const tripStore = useTripStore();
const trip = await tripStore.get(Number(route.params.id));

// Use computed for reactivity
const segments = computed(() => {
  return props.segments?.map((id) => trip!.segments[id] as MapLibreSegment) ?? [];
});
</script>