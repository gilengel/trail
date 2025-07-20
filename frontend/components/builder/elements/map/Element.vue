<template>
  <div>
    <TMap :segments="mapSegments"/>
  </div>
</template>

<script setup lang="ts">
import type {MapLibreSegment} from "~/types/route";
import type {MapProps} from "~/components/builder/elements/map/Props";
import type {ElementProps} from "~/components/builder/properties";


const props = defineProps<ElementProps<MapProps>>();

const routeStore = useRouteStore();

const mapSegments: Ref<MapLibreSegment[]> = ref([]);
watch(() => props.element.attributes.segmentsIds, async () => {
  const route = await routeStore.getMapLibreRoute(props.element.attributes.routeId);

  const filtered = route?.segments.filter((segment) => props.element.attributes.segmentsIds?.includes(segment.id));
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