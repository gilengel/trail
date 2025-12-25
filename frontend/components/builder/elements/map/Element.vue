<template>
  <BuilderHighlightableElement
    :is-highlighted="editor ? editor.isHighlighted(props.element) : false"
  >
    <Map
      ref="map"
      :line-style
      :segments
      @segment:hovered-on="segmentHoveredOn"
    />
  </BuilderHighlightableElement>
</template>

<script setup lang="ts">
import type { EditorElementProperties } from "@trail/grid-editor/grid";
import type { MapElement } from "~/components/builder/elements/map/index";
import { inject } from "vue";
import { EditorInjectionKey } from "@trail/grid-editor/editor";
import type { LngLatLike } from "maplibre-gl";
import type { BuilderHighlightableElement } from "#components";
import Map from "~/components/Map.vue";
import type { LineStyle } from "~/types/lineStyle";

//-- PROPS -------------------------------------------------------------------------------------------------------------

const props = defineProps<EditorElementProperties<typeof MapElement>>();

//-- COMPOSABLES -------------------------------------------------------------------------------------------------------

const routeStore = useRouteStore();

//-- INJECTS --- -------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey, null);

if (!editor && props.changeable) {
  throw new Error('Editor instance was not injected in element "Map"');
}

const map = useTemplateRef<InstanceType<typeof Map>>("map");

const lineStyle: ComputedRef<LineStyle> = computed(() => {
  return {
    width: 4,
    color: props.element.properties.color ?? "rgb(75, 192, 192)",
    join: "round",
    cap: "round",
  };
});

const markerId = 0;

//-- COMPUTED ----------------------------------------------------------------------------------------------------------

const segments = computedAsync(
  async () => {
    if (!props.element.properties.route) {
      return [];
    }
    if (
      !props.element.properties.route.id ||
      props.element.properties.route.segmentIds.length == 0
    ) {
      return [];
    }

    const route = await routeStore.getMapLibreRoute(
      Number(props.element.properties.route.id!),
    );
    const filtered = route?.segments.filter((segment) =>
      props.element.properties.route.segmentIds?.includes(segment.id),
    );
    if (!filtered) {
      return;
    }

    return filtered;
  },
  [], // Initial state && fallback
);

//----------------------------------------------------------------------------------------------------------------------

watch(
  () => props.element.properties.marker,
  (marker) => {
    if (!marker) {
      return;
    }
    const m = map.value;
    if (!m) {
      return;
    }

    if (!m.getMarker(markerId)) {
      m.addMarker(markerId);
    }

    m.getMarker(markerId)!.setLngLat(marker);
  },
);

function segmentHoveredOn(id: string | null, point: LngLatLike) {
  editor?.eventManager.emit(props.element.instanceId, "segment-hovered-on", {
    point,
  });
}
</script>
<style scoped lang="scss">
div {
  width: 100%;
  height: 100%;
}
</style>
