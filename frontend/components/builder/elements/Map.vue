<template>
  <div>
    <TMap :segments="mapSegments"/>
  </div>
</template>

<script setup lang="ts">
import {useTripStore} from "~/stores/trip";
import type {MapLibreSegment} from "~/types/route";

interface Props {
  segments?: { route: number, segments: number[] }
}

const props = defineProps<Props>();

const route = useRoute();
const tripStore = useTripStore();
const routeStore = useRouteStore();
const trip = await tripStore.get(Number(route.params.id));

const mapSegments: Ref<MapLibreSegment[]> = ref([]);
watch(() => props.segments, async (newSegments) => {
  const route = await routeStore.getMapLibreRoute(newSegments?.route!);

  const filtered = route?.segments.filter((_, index) => newSegments?.segments.includes(index));
  if (!filtered) {
    return;
  }

  mapSegments.value = filtered;

  console.log(mapSegments);
}, {deep: true, immediate: true})
// Use computed for reactivity

/*
const segments = computed(() => {
  return props.segments?.map((id) => trip!.segments[id] as MapLibreSegment) ?? [];
});
*/

</script>
<style scoped lang="scss">
div {
  width: 100%;
  height: 100%;
}
</style>