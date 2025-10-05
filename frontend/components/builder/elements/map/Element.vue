<template>
  <BuilderHighlightableElement :is-highlighted="editor.isHighlighted(props.element)">
    <Map :segments/>
  </BuilderHighlightableElement>
</template>

<script setup lang="ts">
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


const segments = computedAsync(
    async () => {
      if (!props.element.properties.route.id || props.element.properties.route.segmentIds.length == 0) {
        return [];
      }

      const route = await routeStore.getMapLibreRoute(Number(props.element.properties.route.id!));
      const filtered = route?.segments.filter((segment) => props.element.properties.route.segmentIds?.includes(segment.id));
      if (!filtered) {
        return;
      }

      return filtered;
    },
    [], // Initial state && fallback
)

</script>
<style scoped lang="scss">
div {
  width: 100%;
  height: 100%;
}
</style>