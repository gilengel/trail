<template>
  <div>
    <TMap/>

  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useTripStore} from "~/stores/trip";
import type {MapLibreSegment} from "~/types/route";

interface Props {
  segments?: { route: number, segments: number[] }
}

defineProps<Props>();

const route = useRoute();
const tripStore = useTripStore();
const trip = await tripStore.get(Number(route.params.id));


// Use computed for reactivity

/*
const segments = computed(() => {
  return props.segments?.map((id) => trip!.segments[id] as MapLibreSegment) ?? [];
});
*/

</script>
<style scoped lang="scss">
div {
  width: 100%;
  height: 100%;
}
</style>