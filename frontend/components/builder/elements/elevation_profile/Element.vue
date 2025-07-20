<template>
  <div>
    <v-alert v-if="!props.element.attributes.segmentsIds || props.element.attributes.segmentsIds?.length == 0"
             type="warning"
             variant="outlined"
             prominent
    >
      No segment is selected for this elevation. Please do so in the property panel on the right side.
    </v-alert>


    <Line v-else-if="data"
          :data
          :options="chartOptions"
    />
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {Line} from 'vue-chartjs'
import {addAlphaToColor} from "~/types/color";
import type {ElevationProfileProps} from "~/components/builder/elements/elevation_profile/Props";
import type {ElementProps} from "~/components/builder/properties";
import {useRouteStore} from "~/stores/route";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<ElementProps<ElevationProfileProps>>();

const chartOptions = ref({
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
        callback: function (value: number) {
          return `${value}m`
        }
      },
      grid: {
        display: false, // Hide grid lines for the x-axis
      },
    },
    y: {
      ticks: {
        callback: function (value: number) {
          return `${value}m`
        },
      },

      grid: {
        display: false, // Hide grid lines for the y-axis
      },
    },
  },


  responsive: true,
  maintainAspectRatio: false,
})

// ---------------------------------------------------------------------------------------------------------------------

const routeStore = useRouteStore();

// ---------------------------------------------------------------------------------------------------------------------

const segments = computedAsync(
    async () => {
      const segmentsIds = props.element.attributes.segmentsIds;
      const routeId = props.element.attributes.routeId;
      if (!segmentsIds || !routeId) {
        return null;
      }

      const route = await routeStore.getByRouteId(routeId);
      return route?.segments.filter((segment) => segmentsIds.includes(segment.id));
    },
    null, // initial state
)

const color = computed(() => {
  if (!props.element.attributes || !props.element.attributes.color) {
    return 'rgb(0, 0, 0)';
  }

  return props.element.attributes.color;
})


const elevations = computed(() => {
  if (!segments.value) {
    return;
  }

  let coordinates = segments.value.filter(segment => segment.coordinates !== undefined).map(segment => segment.coordinates).flat(1);

  return coordinates.map(coordinate => coordinate![2])
})

const data = computed(() => {
  if (!elevations.value) {
    return;
  }

  return {
    labels: elevations.value.map((_: unknown, index: number) => {
      return index;
    }),
    datasets: [
      {
        label: 'Elevation',
        fill: 'start', // Fill the area under the curve
        borderColor: color.value, // Border color for the line
        backgroundColor: addAlphaToColor(color.value, 0.2), // Semi-transparent fill color
        tension: 0.1,
        data: elevations.value,

        radius: 0,
      }
    ]
  }
})

</script>


<style scoped lang="scss">
div {
  width: 100%;
}
</style>