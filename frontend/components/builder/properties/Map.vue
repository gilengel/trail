<template>
  <h1>Map Properties</h1>

  <CollapsableList :collapseNumber="3" :items="routes!" :text="(route: MapLibreRoute) => route.name"
                   @onSelectionChanged="(e) => selectedRoute = e"/>

  <v-list
      v-model:selected="selection"
      select-strategy="leaf"
      multiple
      max-height="600px"
  >
    <v-list-item
        v-for="(item, index) in selectedRoute?.segments"
        :key="item.id"
        :title="snakeCaseToWords(item.name)"
        :value="index"
    >
      <template #prepend="{ isSelected }">
        <v-list-item-action start>
          <v-checkbox-btn :model-value="isSelected"/>
        </v-list-item-action>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">

import {useTripStore} from "~/stores/trip";

interface Props {
  segments: number[]
}

const props = defineProps<ElementProps<Props>>();

const gridModuleStore = useGridStore();

const route = useRoute();
const tripStore = useTripStore();
const routeStore = useRouteStore();

const trip = await tripStore.get(Number(route.params.id));
const routes = await routeStore.getMapLibreRoutesForTrip(trip!.id);

const selectedRoute: Ref<MapLibreRoute | null> = ref(null);

import type {ElementProps} from "~/components/builder/properties/index";
import {snakeCaseToWords} from "~/utils/text";
import {useRouteStore} from "~/stores/route";
import CollapsableList from "~/components/CollapsableList.vue";
import type {MapLibreRoute} from "~/types/route";

const selection = computed({
  get() {
    return props.element.attributes.segments;
  },

  set(newSelection: []) {
    gridModuleStore.updateElementAttribute(props.element, "segments", {
      route: selectedRoute.value?.id,
      segments: newSelection
    })
        .then(() => {
        })
        .catch((e) => console.error(e));
  }
})
</script>

<style scoped lang="scss">

</style>