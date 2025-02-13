<template>
  <h1>Map Properties</h1>
  <v-list
    v-model:selected="selection"
    select-strategy="leaf"
    multiple
    max-height="600px"
  >
    <v-list-item
      v-for="(item, index) in trip?.segments"
      :key="item.id"
      :subtitle="item.description"
      :title="snakeCaseToWords(item.name)"
      :value="index"
    >
      <template #prepend="{ isSelected }">
        <v-list-item-action start>
          <v-checkbox-btn :model-value="isSelected" />
        </v-list-item-action>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">

import {useTripStore} from "~/stores/trip";


interface MapElementProps {
  segments: number[]
}

const props = defineProps<ElementProps<MapElementProps>>();

const gridModuleStore = useGridStore();

const route = useRoute();
const tripStore = useTripStore();
const trip = await tripStore.get(Number(route.params.id));

import type {ElementProps} from "~/components/builder/properties/index";
import {snakeCaseToWords} from "~/utils/text";

const selection = computed({
  get() {
    return props.element.attributes.segments;
  },

  set(newSelection: []) {
    gridModuleStore.updateElementAttribute(props.element, "segments", newSelection)
        .then(() => {
        })
        .catch((e) => console.error(e));
  }
})

</script>

<style scoped lang="scss">

</style>