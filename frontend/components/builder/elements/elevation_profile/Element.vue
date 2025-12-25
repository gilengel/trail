<template>
  <BuilderHighlightableElement :is-highlighted="highlighted">
    <v-alert v-if="invalid" type="warning" variant="outlined" prominent>
      No segment is selected for this elevation. Please do so in the property
      panel on the right side.
      <hr />
      {{ element.instanceId }}
      {{ highlighted }}
    </v-alert>

    <Line ref="lineChart" v-else-if="data" :data :options="chartOptions" />
  </BuilderHighlightableElement>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { Line } from "vue-chartjs";
import { addAlphaToColor } from "~/types/color";
import { useRouteStore } from "~/stores/route";
import {
  type ChartOptions,
  type ChartData,
  Scale,
  type CoreScaleOptions,
  type Chart,
} from "chart.js";
import type { EditorElementProperties } from "@trail/grid-editor/grid";
import { ElevationProfileElement } from "~/components/builder/elements/elevation_profile/index";
import { EditorInjectionKey } from "@trail/grid-editor/editor";
import type { BuilderHighlightableElement } from "#components";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P];
};

// ---------------------------------------------------------------------------------------------------------------------

const props =
  defineProps<EditorElementProperties<typeof ElevationProfileElement>>();

// ---------------------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey, null);

const lineChart = ref<{
  chart: Chart;
} | null>(null);

if (!editor && props.changeable) {
  throw new Error(
    'Editor instance was not injected in element "ElevationProfile"',
  );
}

const chartOptions = ref<DeepPartial<ChartOptions<"line">>>({
  plugins: {
    filler: {
      propagate: true,
    },
    legend: {
      display: false, // Hides the legend
    },
    tooltip: {
      callbacks: {
        label: function () {
          return ""; // Hides the label
        },
      },
    },
  },

  scales: {
    x: {
      type: "linear",
      ticks: {
        stepSize: 100,
        callback: function (
          this: Scale<CoreScaleOptions>,
          tickValue: string | number,
        ) {
          return `${tickValue}m`;
        },
      },
      grid: {
        display: false, // Hide grid lines for the x-axis
      },
    },
    y: {
      ticks: {
        callback: function (
          this: Scale<CoreScaleOptions>,
          tickValue: string | number,
        ) {
          return `${tickValue}m`;
        },
      },

      grid: {
        display: false, // Hide grid lines for the y-axis
      },
    },
  },

  responsive: true,
  maintainAspectRatio: false,
});

// ---------------------------------------------------------------------------------------------------------------------

const routeStore = useRouteStore();

// ---------------------------------------------------------------------------------------------------------------------

const segments = computedAsync(
  async () => {
    const segmentsIds = props.element.properties.route.segmentIds;
    const routeId = props.element.properties.route.id;
    if (!segmentsIds || !routeId) {
      return null;
    }

    const route = await routeStore.getByRouteId(routeId);
    return route?.segments.filter((segment) =>
      segmentsIds.includes(segment.id),
    );
  },
  null, // initial state
);

const invalid = computed(() => {
  return (
    !props.element.properties.route ||
    !props.element.properties.route.segmentIds ||
    props.element.properties.route.segmentIds?.length == 0
  );
});

const color = computed(() => {
  if (!props.element.properties || !props.element.properties.color) {
    return "rgb(0, 0, 0)";
  }

  return props.element.properties.color;
});

const highlighted = computed(() => {
  return editor ? editor.isHighlighted(props.element) : false;
});

const coordinates = computed(() => {
  if (!segments.value) {
    return [];
  }

  return segments.value
    .filter((segment) => segment.coordinates !== undefined)
    .map((segment) => segment.coordinates)
    .flat(1);
});
const elevations = computed(() => {
  return coordinates.value.map((coordinate) => coordinate![2]);
});

function equal(x: number, y: number, tolerance = Number.EPSILON) {
  return Math.abs(x - y) < tolerance;
}

const tolerance = 0.01;
watch(
  () => props.element.properties.marker,
  (marker) => {
    const coords = coordinates.value;

    if (!coords) {
      return;
    }

    const index = coords.findIndex(
      (coordinate: [number, number, number] | undefined) =>
        equal(coordinate![0], marker!.lat, tolerance) &&
        equal(coordinate![1], marker!.lng, tolerance),
    );
    if (index == -1) {
      return;
    }

    const markerData = data.value.datasets[1].data as any[];
    markerData[0].x = index;
    markerData[0].y = coords[index]![2];

    lineChart.value!.chart.update("none");
  },
  { flush: "post" },
);

const data = computed<ChartData<"line">>(() => {
  if (!elevations.value) {
    return {
      labels: [],
      datasets: [],
    };
  }

  return {
    labels: elevations.value.map((_, index) => index.toString()), // labels should be strings
    datasets: [
      {
        label: "Elevation",
        fill: "start",
        borderColor: color.value,
        backgroundColor: addAlphaToColor(color.value, 0.2),
        tension: 0.1,
        data: elevations.value,
        radius: 0,
      },
      {
        label: "Marker",
        parsing: false,
        animation: false,
        showLine: false,
        data: [{ x: 1000, y: 3000 }],
        borderColor: "rgb(75, 192, 192)",
        fill: true,
        tension: 0.1,
        pointRadius: 8, // Size of the point
        pointBackgroundColor: color.value, // Color of the point
        pointBorderColor: "white", // Border color
        pointBorderWidth: 2, // Border width
        pointStyle: "circle", // 'circle', 'rect', 'triangle', 'cross', etc.
      },
    ],
  };
});
</script>

<style scoped lang="scss">
div {
  width: 100%;
}
</style>
