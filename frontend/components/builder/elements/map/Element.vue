<template>
  <div>
    <TMap :segments="mapSegments" />
  </div>
</template>

<script setup lang="ts">
import type {MapLibreSegment} from "~/types/route";

interface Props {
  segments?: { route: number, segments: number[] }
}

const props = defineProps<Props>();

const routeStore = useRouteStore();

const mapSegments: Ref<MapLibreSegment[]> = ref([]);
watch(() => props.segments, async (newSegments) => {
  if(!newSegments?.route){
    return;
  }

  const route = await routeStore.getMapLibreRoute(newSegments?.route);

  const filtered = route?.segments.filter((_, index) => newSegments?.segments.includes(index));
  if (!filtered) {
    return;
  }

  mapSegments.value = filtered;

}, {deep: true, immediate: true})

</script>
<style scoped lang="scss">
div {
  width: 100%;
  height: 100%;
}
</style>