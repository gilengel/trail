<template>
  <h1>Map Properties</h1>
  <v-list
      v-model:selected="selected"
      select-strategy="leaf"
      multiple
      @update:selected="onSelectionChange"
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
          <v-checkbox-btn :model-value="isSelected"/>
        </v-list-item-action>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">

import {useTripStore} from "~/stores/trip";

interface MapElementProps extends ElementProps {
  segments: number[];
}

const props = defineProps<MapElementProps>();

const gridModuleStore = useGridStore();

const route = useRoute();
const tripStore = useTripStore();
const trip = await tripStore.get(Number(route.params.id));

import type {ElementProps} from "~/components/builder/properties/index";
import {snakeCaseToWords} from "~/utils/text";

const selected = ref(props.attributes.segments);

const onSelectionChange = async (newSelected: number[]) => {
  try {
    await gridModuleStore.updateElementAttribute(props.element, "segments", newSelected)
  } catch (error) {
    console.log(error);
  }
};

// Watch for changes in selectedIndices
/*
watch(selected, (newSelectedIndices: number[]) => {
  onSelectionChange(newSelectedIndices); // Call the callback when selection changes
});
*/
</script>

<style scoped lang="scss">

</style>