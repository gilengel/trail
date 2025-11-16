<template>
  <BuilderHighlightableElement :is-highlighted="editor ? editor.isHighlighted(props.element) : false">
    <v-alert
        v-if="invalid"
        type="warning"
        variant="outlined"
        prominent
    >
      No segment is selected for this elevation. Please do so in the property panel on the right side.
      <hr>
      {{ element.instanceId }}
    </v-alert>


    <Line
        v-else-if="data"
        :data
        :options="chartOptions"
    />
  </BuilderHighlightableElement>
</template>

<script setup lang="ts">
import {computed, inject} from "vue";
import {Line} from 'vue-chartjs';
import {addAlphaToColor} from "~/types/color";
import {useRouteStore} from "~/stores/route";
import {type ChartOptions, type ChartData, Scale, type CoreScaleOptions} from 'chart.js';
import type {EditorElementProperties} from "@trail/grid-editor/grid";
import {ElevationProfileElement} from "~/components/builder/elements/elevation_profile/index";
import {EditorInjectionKey} from "@trail/grid-editor/editor";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T[P] extends object
          ? DeepPartial<T[P]>
          : T[P];
};

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<EditorElementProperties<typeof ElevationProfileElement>>();

// ---------------------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey, null);

if (!editor && props.changeable) {
  throw new Error('Editor instance was not injected in element "ElevationProfile"');
}

const chartOptions = ref<DeepPartial<ChartOptions<'line'>>>({
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
          return ''; // Hides the label
        },
      },
    },
  },

  scales: {
    x: {
      type: 'linear',
      ticks: {
        stepSize: 100,
        callback: function (
            this: Scale<CoreScaleOptions>,
            tickValue: string | number,
        ) {
          return `${tickValue}m`;
        }
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
      return route?.segments.filter((segment) => segmentsIds.includes(segment.id));
    },
    null, // initial state
);

const invalid = computed(() => {
  return !props.element.properties.route ||
      !props.element.properties.route.segmentIds ||
      props.element.properties.route.segmentIds?.length == 0;
});

const color = computed(() => {
  if (!props.element.properties || !props.element.properties.color) {
    return 'rgb(0, 0, 0)';
  }

  return props.element.properties.color;
});


const elevations = computed(() => {
  if (!segments.value) {
    return [];
  }

  const coordinates = segments.value.filter(segment => segment.coordinates !== undefined).map(segment => segment.coordinates).flat(1);

  return coordinates.map(coordinate => coordinate![2]);
});

const data = computed<ChartData<'line'>>(() => {
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
        label: 'Elevation',
        fill: 'start',
        borderColor: color.value,
        backgroundColor: addAlphaToColor(color.value, 0.2),
        tension: 0.1,
        data: elevations.value,
        radius: 0,
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