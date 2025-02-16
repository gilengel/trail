<template>
  <div
      ref="mapContainer"
      data-cy="map-container"
      class="map"
  />
</template>

<script setup lang="ts">
import type {MapLibreSegment, MapLibreTrip} from "~/types/route";
import {LngLatBounds, Map} from "maplibre-gl";
import type {Color} from "~/types/color";

type LineStyle = {
  width: number;
  color: string;
  join?: "round" | "bevel" | "miter";
  cap?: "butt" | "round" | "square";
};

interface Props {
  trip?: MapLibreTrip | null
  segments?: MapLibreSegment[] | null,
  lineColor?: Color,
  interactive?: boolean
}

const {
  trip = null,
  segments = null,
  lineColor = 'rgb(75, 192, 192)',
  interactive = true
} = defineProps<Props>()

const map: Ref<Map | null> = ref(null);

const mapContainer: Ref<HTMLElement | null> = ref(null);

defineExpose({
  zoomToSegment,
  zoomToSegments: zoomToTrip,
  fitBounds,
});

let oldSegments: MapLibreSegment[] = [];

/**
 *
 */
function onSegmentsChanged() {


  const removedSegments = oldSegments.filter(x => !segments!.includes(x));
  const addedSegments = segments!.filter(x => !oldSegments.includes(x));

  for (const segment of removedSegments) {
    removeLine(segment.id);
  }

  const bounds = new LngLatBounds();
  for (const segment of oldSegments) {
    bounds.extend(segment.bounds);
  }


  for (const segment of addedSegments) {

    addLine(
        segment.id,
        segment.coordinates.map((e) => e.toArray()),
        {
          width: 5,
          color: lineColor,
        }
    );


    bounds.extend(segment.bounds);

  }


  fitBounds(bounds, true);

  oldSegments = segments!;
}


// Set up the watcher
watch(() => segments, onSegmentsChanged, {deep: true});

onMounted(() => {
  if (!trip) {
    //return;
  }
  map.value = new Map({
    container: mapContainer.value!,
    style: new URL('@/assets/map_styles/terrain.json', import.meta.url).href,
    zoom: 16,
    interactive
  });

  /*
  map.value = new Map({
    container: mapContainer.value!,
    style: new URL('@/assets/map_styles/terrain.json', import.meta.url).href,
    center: props.trip.bounds.getCenter(),
    zoom: 16,
  });
  */

  map.value!.on("load", () => {
    if (!trip && !segments) {
      return;
    }


    if (segments && segments.length > 0) {
      oldSegments = segments;
      for (const segment of segments) {
        addLine(
            segment.id,
            segment.coordinates.map((e) => e.toArray()),
            {
              width: 5,
              color: lineColor,
            }
        );
      }

      zoomToSegments(segments);
      return;
    }

    if (trip) {
      for (const segment of trip.segments) {
        addLine(
            segment.id,
            segment.coordinates.map((e) => e.toArray()),
            {
              width: 5,
              color: lineColor,
            }
        );
      }
      zoomToTrip(trip, false);
    }
  });
});

/**
 * @param id
 */
function routeId(id: number) {
  return `route_${id}`;
}

/**
 * @param id
 */
function removeLine(id: number) {
  const _id = routeId(id);
  map.value!.removeLayer(_id);
  map.value!.removeSource(_id);
}

/**
 * @param id
 * @param coordinates
 * @param style
 */
function addLine(id: number, coordinates: number[][], style: LineStyle) {
  const _id = routeId(id);
  map.value!.addSource(_id, {
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
    id: _id,
    type: "line",
    source: _id,
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

/**
 * @param trip
 * @param animate
 */
function zoomToTrip(trip: MapLibreTrip, animate: boolean = true) {
  fitBounds(trip.bounds, animate);
}

/**
 * @param segment
 * @param animate
 */
function zoomToSegment(segment: MapLibreSegment, animate: boolean = true) {
  fitBounds(segment.bounds, animate);
}

/**
 * @param segments
 * @param animate
 */
function zoomToSegments(segments: MapLibreSegment[], animate: boolean = true) {
  const bounds = new LngLatBounds();
  for (const segment of segments) {
    bounds.extend(segment.bounds);
  }

  fitBounds(bounds, animate);
}

/**
 * @param bounds
 * @param animate
 */
function fitBounds(bounds: LngLatBounds, animate: boolean) {
  if (bounds.isEmpty()) {
    return;
  }

  map.value!.fitBounds(bounds, {
    padding: {top: 10, bottom: 25, left: 15, right: 5},
    animate,
  });

  if (!animate) {
    const center = bounds.getCenter();
    map.value!.setCenter(center);
  }
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
