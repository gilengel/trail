<template>
  <BuilderHighlightableElement :is-highlighted="editor.isHighlighted(props.element)">
    <Map :segments="mapSegments"/>
  </BuilderHighlightableElement>
</template>

<script setup lang="ts">
import type {MapLibreSegment} from "~/types/route";
import type {EditorElementProperties} from "@trail/grid-editor/grid";
import type {MapElement} from "~/components/builder/elements/map/index";
import {inject} from "vue";
import {EditorInjectionKey} from "@trail/grid-editor/editor";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<EditorElementProperties<typeof MapElement>>();

// ---------------------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey);
if (!editor) {
  throw new Error('Editor instance was not injected in "Map" element');
}

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