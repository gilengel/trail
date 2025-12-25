<template>
  <div ref="mapContainer" data-cy="map-container" class="map" />
</template>

<script setup lang="ts">
import type { MapLibreSegment, MapLibreRoute } from "~/types/route";
import {
  LngLatBounds,
  type LngLatLike,
  Map as MapLibreMap,
  Marker,
} from "maplibre-gl";
import { nearestPointOnLine, point } from "@turf/turf";
import type { LineStyle } from "~/types/lineStyle";

interface Props {
  trip?: MapLibreRoute | null;
  segments?: MapLibreSegment[] | null;
  lineStyle?: LineStyle;
  interactive?: boolean;
  animated?: boolean;

  hoverOffset?: number;
}

const {
  trip = null,
  segments = null,
  lineStyle = {
    width: 4,
    color: "rgb(75, 192, 192)",
    join: "round",
    cap: "round",
  },
  interactive = true,
  animated = false,
  hoverOffset = 20,
} = defineProps<Props>();

const map: Ref<MapLibreMap | null> = ref(null);

const mapContainer: Ref<HTMLElement | null> = ref(null);

defineExpose({
  zoomToSegment,
  zoomToSegments: zoomToTrip,
  fitBounds,
  addMarker,
  getMarker,
  removeMarker,
});

const emit = defineEmits<{
  "segment:hoveredOn": [id: string | null, point: LngLatLike];
}>();

let oldSegments: MapLibreSegment[] = [];

const markersById = new Map<number, Marker>();
let linesById: string[] = [];

/**
 *
 */
function onSegmentsChanged() {
  const removedSegments = oldSegments.filter((x) => !segments!.includes(x));
  const addedSegments = segments!.filter((x) => !oldSegments.includes(x));

  for (const segment of removedSegments) {
    removeLine(segment.id);
  }

  const bounds = new LngLatBounds();
  for (const segment of oldSegments) {
    if (removedSegments.includes(segment)) {
      continue;
    }
    bounds.extend(segment.bounds);
  }

  for (const segment of addedSegments) {
    addLine(
      segment.id,
      segment.coordinates.map((e) => e.toArray()),
      lineStyle,
    );

    bounds.extend(segment.bounds);
  }

  fitBounds(bounds, animated);

  oldSegments = segments!;
}

// We use watchers to refresh the map if either trip or segments have changed
watch(
  () => segments,
  async () => {
    if (!map.value || !map.value.isStyleLoaded()) {
      await waitForStyleLoad();
    }
    onSegmentsChanged();
  },
  { deep: true },
);

watch(
  () => lineStyle,
  () => {
    for (const id of linesById) {
      map.value!.setPaintProperty(id, "line-color", lineStyle.color);
      map.value!.setPaintProperty(id, "line-width", lineStyle.width);
    }
  },
  { deep: true },
);

function waitForStyleLoad(): Promise<void> {
  return new Promise((resolve) => {
    if (!map.value) {
      return;
    }

    if (map.value.isStyleLoaded()) {
      resolve();
    } else {
      map.value.once("style.load", resolve);
    }
  });
}

onMounted(() => {
  map.value = new MapLibreMap({
    container: mapContainer.value!,
    style: new URL("@/assets/map_styles/terrain.json", import.meta.url).href,
    zoom: 16,
    attributionControl: false,
    interactive,
  });

  map.value!.on("style.load", () => {
    if (segments && segments.length > 0) {
      oldSegments = segments;
      for (const segment of segments) {
        addLine(
          segment.id,
          segment.coordinates.map((e) => e.toArray()),
          lineStyle,
        );
      }

      zoomToSegments(segments, animated);
      return;
    }

    if (trip) {
      for (const segment of trip.segments) {
        addLine(
          segment.id,
          segment.coordinates.map((e) => e.toArray()),
          lineStyle,
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

  linesById = linesById.filter((item) => item !== _id);

  map.value!.removeLayer(_id);
  map.value!.removeSource(_id);
}

/**
 * Adds a single line to the map. Be aware that there is no logic here to verify if the same
 * route or a similar route was already added to the map.
 *
 * @param id - Unique number for identification. It will get extended to route_{$id}.
 * @param coordinates - It is expected that the first coordinate is the start, the last coordinate the end of the line
 * @param style - The style applied to the line.
 */
function addLine(id: number, coordinates: number[][], style: LineStyle) {
  const _id = routeId(id);

  linesById.push(_id);

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

  map.value!.on("mousemove", (e) => {
    const features = map.value!.queryRenderedFeatures(
      [
        [e.point.x - hoverOffset, e.point.y - hoverOffset],
        [e.point.x + hoverOffset, e.point.y + hoverOffset],
      ],
      { layers: [_id] },
    );

    if (!features.length) return;

    const lineFeature = features[0]; // closest rendered feature
    const mousePoint = point([e.lngLat.lng, e.lngLat.lat]);

    const snapped = nearestPointOnLine(lineFeature as any, mousePoint);

    emit("segment:hoveredOn", _id, {
      lng: snapped.geometry.coordinates[0],
      lat: snapped.geometry.coordinates[1],
    });
  });
}

function addMarker(id: number) {
  const marker = new Marker({
    color: "#FFFFFF",
    draggable: true,
  })
    .setLngLat([30.5, 50.5])
    .addTo(map.value!);

  markersById.set(id, marker);
  return marker;
}

function removeMarker(id: number) {
  const marker = markersById.get(id);
  if (!marker) {
    return;
  }

  marker.remove();
  markersById.delete(id);
}

function getMarker(id: number) {
  return markersById.get(id);
}

/**
 * Changes the visible area of the map so that the entire trip (plus a margin) is visible.
 *
 * @param trip - The trip you want to focus the view on.
 * @param animate - If true the "camera" will zoom out fly over and zoom in again. This can be very irritating if
 *                  often used and/or over longer distances.
 */
function zoomToTrip(trip: MapLibreRoute, animate: boolean = true) {
  fitBounds(trip.bounds, animate);
}

/**
 * Changes the visible area of the map so that the segment (plus a margin) is visible.
 *
 * @param segment - The segment you want to focus the view on.
 * @param animate - If true the "camera" will zoom out fly over and zoom in again. This can be very irritating if
 *                  often used and/or over longer distances.
 */
function zoomToSegment(segment: MapLibreSegment, animate: boolean = true) {
  fitBounds(segment.bounds, animate);
}

/**
 * Changes the visible area of the map so that the segments (plus a margin) are visible.
 *
 * @param segments - The segments you want to focus the view on.
 * @param animate - If true the "camera" will zoom out fly over and zoom in again. This can be very irritating if
 *                  often used and/or over longer distances.
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
    padding: { top: 10, bottom: 25, left: 15, right: 5 },
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
