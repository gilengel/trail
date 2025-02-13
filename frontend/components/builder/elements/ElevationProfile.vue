<template>
  <div style="min-height: 400px">
    <Line
      :data
      :options="chartOptions"
    />
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {Line} from 'vue-chartjs'
import {MapLibreSegment} from "~/types/route";
import {addAlphaToColor, type Color} from "~/types/color";

const props = defineProps({
  segment: {
    type: MapLibreSegment,
    required: true
  },

  color: {
    type: String as PropType<Color>,
    required: false,
    default: 'rgb(75, 192, 192)'
  }
});


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
      grid: {
        display: false, // Hide grid lines for the x-axis
      },
    },
    y: {
      grid: {
        display: false, // Hide grid lines for the y-axis
      },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
})


const elevations = computed(() => {
  return props.segment.coordinates.map(coordinate => coordinate.elevation)
})

const data = computed(() => {
  return {
    //labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "DecemberF"],
    labels: elevations.value.map((el: unknown, index: number) => {
      return index;
    }),
    datasets: [
      {
        label: 'Elevation',
        fill: 'start', // Fill the area under the curve
        borderColor: props.color, // Border color for the line
        backgroundColor: addAlphaToColor(props.color, 0.2), // Semi-transparent fill color
        tension: 0.1,
        data: elevations.value,

        radius: 0,
      }
    ]
  }
})
</script>


<style scoped lang="scss">

</style>