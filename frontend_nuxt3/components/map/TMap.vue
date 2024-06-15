<template>
  <div data-cy="map-container" class="map" id="map" />
</template>

<script setup lang="ts">
import type { MapLibreSegment, MapLibreTrip } from "~/stores/route/types";
import { LngLatBounds, Map } from "maplibre-gl";
import { v4 as uuidv4 } from "uuid";

type LineStyle = {
  width: number;
  color: string;
  join?: "round" | "bevel" | "miter";
  cap?: "butt" | "round" | "square";
};

const map: Ref<Map | null> = ref(null);

const props = defineProps<{
  trip: MapLibreTrip;
}>();

defineExpose({
  zoomToSegment,
  zoomToSegments: zoomToTrip,
  fitBounds,
});

onMounted(() => {
  map.value = new Map({
    container: "map",
    style:
      "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
    center: props.trip.bounds.getCenter(),
    zoom: 16,
  });

  map.value!.on("load", () => {
    for (const segment of props.trip.segments) {
      addLine(
        segment.coordinates.map((e) => e.toArray()),
        {
          width: 5,
          color: "#f00",
        }
      );
    }

    zoomToTrip(props.trip, false);
  });
});

function addLine(coordinates: number[][], style: LineStyle) {
  const id = `route_${uuidv4()}`;
  map.value!.addSource(id, {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates,
      },
    },
  });
  map.value!.addLayer({
    id,
    type: "line",
    source: id,
    layout: {
      "line-join": style.join || "round",
      "line-cap": style.cap || "round",
    },
    paint: {
      "line-color": style.color,
      "line-width": style.width,
    },
  });
}

function zoomToTrip(trip: MapLibreTrip, animate: boolean = true) {
  fitBounds(trip.bounds, animate);
}

function zoomToSegment(segment: MapLibreSegment, animate: boolean = true) {
  fitBounds(segment.bounds, animate);
}

function fitBounds(bounds: LngLatBounds, animate: boolean = true) {
  map.value!.fitBounds(bounds, {
    padding: { top: 10, bottom: 25, left: 15, right: 5 },

    animate,
  });
}
</script>

<style scoped lang="scss">
.map {
  aspect-ratio: 1/1;

  display: block;
  width: 400px;
  height: 400px;
  border: solid 1px black;
}
</style>
