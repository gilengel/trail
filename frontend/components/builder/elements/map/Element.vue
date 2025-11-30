<template>
  <BuilderHighlightableElement :is-highlighted="editor ? editor.isHighlighted(props.element) : false">
    <Map
        :segments
        @segment:hovered-on="segmentHoveredOn"
    />
  </BuilderHighlightableElement>
</template>

<script setup lang="ts">
import type {EditorElementProperties} from "@trail/grid-editor/grid";
import type {MapElement} from "~/components/builder/elements/map/index";
import {inject} from "vue";
import {EditorInjectionKey} from "@trail/grid-editor/editor";
import type {LngLatLike} from "maplibre-gl";

//-- PROPS -------------------------------------------------------------------------------------------------------------

const props = defineProps<EditorElementProperties<typeof MapElement>>();

//-- COMPOSABLES -------------------------------------------------------------------------------------------------------

const routeStore = useRouteStore();

//-- INJECTS --- -------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey, null);

if (!editor && props.changeable) {
  throw new Error('Editor instance was not injected in element "Map"');
}

//-- COMPUTED ----------------------------------------------------------------------------------------------------------

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
);

//----------------------------------------------------------------------------------------------------------------------

function segmentHoveredOn(id: string | null, point: LngLatLike) {
  editor?.eventManager.emit(
      props.element.instanceId,
      'segment-hovered-on',
      {
        point
      }
  );
}

</script>
<style scoped lang="scss">
div {
  width: 100%;
  height: 100%;
}
</style>