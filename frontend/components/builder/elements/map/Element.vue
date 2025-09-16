<template>

  <BuilderHighlightableElement :is-highlighted="props.highlighted">
    <Map :segments="mapSegments"/>
  </BuilderHighlightableElement>
</template>

<script setup lang="ts">
import type {MapLibreSegment} from "~/types/route";
import type {EditorElementProperties} from "~/components/GridEditor/grid";
import type {MapElement} from "~/components/builder/elements/map/index";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<EditorElementProperties<typeof MapElement>>();

// ---------------------------------------------------------------------------------------------------------------------

const routeStore = useRouteStore();

// ---------------------------------------------------------------------------------------------------------------------

const mapSegments: Ref<MapLibreSegment[]> = ref([]);
watch(() => props.element.properties.segmentsIds, async () => {
  const route = await routeStore.getMapLibreRoute(Number(props.element.properties.routeId!));

  const filtered = route?.segments.filter((segment) => props.element.properties.segmentsIds?.includes(segment.id));
  if (!filtered) {
    return;
  }

  mapSegments.value = filtered;

}, {deep: true, immediate: true});

</script>
<style scoped lang="scss">
div {
  width: 100%;
  height: 100%;
}
</style>