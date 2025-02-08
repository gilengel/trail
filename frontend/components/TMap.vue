<template>
  <div data-cy="map-container" class="map" ref="mapContainer"/>
</template>

<script setup lang="ts">
import type {MapLibreSegment, MapLibreTrip} from "~/types/types";
import {LngLatBounds, Map} from "maplibre-gl";
import {v4 as uuidv4} from "uuid";
import type {Color} from "~/types/color";

type LineStyle = {
  width: number;
  color: string;
  join?: "round" | "bevel" | "miter";
  cap?: "butt" | "round" | "square";
};

const map: Ref<Map | null> = ref(null);

const mapContainer: Ref<HTMLElement | null> = ref(null);

const props = defineProps({
  trip: {
    type: Object as PropType<MapLibreTrip>,
    required: false,
  },

  lineColor: {
    type: String as PropType<Color>,
    required: false,
    default: 'rgb(75, 192, 192)'
  }
});

defineExpose({
  zoomToSegment,
  zoomToSegments: zoomToTrip,
  fitBounds,
});

onMounted(() => {
  if (!props.trip) {
    map.value = new Map({
      container: mapContainer.value!,
      style: new URL('@/assets/map_styles/terrain.json', import.meta.url).href,
      zoom: 16,
    });

    return;
  }

  map.value = new Map({
    container: mapContainer.value!,
    style: new URL('@/assets/map_styles/terrain.json', import.meta.url).href,
    center: props.trip.bounds.getCenter(),
    zoom: 16,
  });

  map.value!.on("load", () => {
    if (!props.trip) {
      return;
    }

    for (const segment of props.trip.segments) {
      addLine(
          segment.coordinates.map((e) => e.toArray()),
          {
            width: 5,
            color: props.lineColor,
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
    padding: {top: 10, bottom: 25, left: 15, right: 5},

    animate,
  });
}
</script>

<style lang="scss">
.map {
  display: block;
  width: 100%;
  min-height: 300px;
}

@container (max-width: 699px) {
  .map {
    aspect-ratio: 1/1;
  }

}

@container (min-width: 700px) {
  .map {
    aspect-ratio: 16/9;
  }
}
</style>
