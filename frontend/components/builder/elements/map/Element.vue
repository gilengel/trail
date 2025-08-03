<template>
  {{ props.element.attributes.segmentsIds }}
  <BuilderHighlightableElement :is-highlighted="props.highlighted">
    <Map :segments="mapSegments" />
  </BuilderHighlightableElement>
</template>

<script setup lang="ts">
import type {MapLibreSegment} from "~/types/route";
import type {ElementProps} from "~/components/builder/properties";
import type {RouteProperty} from "~/components/builder/elements/RouteProperty";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<ElementProps<RouteProperty>>();

// ---------------------------------------------------------------------------------------------------------------------

const routeStore = useRouteStore();

// ---------------------------------------------------------------------------------------------------------------------

const mapSegments: Ref<MapLibreSegment[]> = ref([]);
watch(() => props.element.attributes.segmentsIds, async () => {
  const route = await routeStore.getMapLibreRoute(props.element.attributes.routeId!);

  const filtered = route?.segments.filter((segment) => props.element.attributes.segmentsIds?.includes(segment.id));
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