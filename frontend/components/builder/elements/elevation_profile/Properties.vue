<template>
  <BuilderPropertiesContainer>
    <template #title>
      Elevation Profile Properties
    </template>

    <template #properties>
      <CollapsableList
        :collapse-number="3"
        :items="routes!"
        :text="(routeDto: RouteDto) => routeDto.name"
        @on-selection-changed="(e) => selectedRoute = e"
      />
      <v-list
        v-model:selected="selection"
        select-strategy="leaf"
        multiple
        max-height="600px"
      >
        <v-list-item
          v-for="item in segments"
          :key="item.id"
          :title="changeCase.sentenceCase(item.name ?? 'Untitled')"
          :value="item.id"
        >
          <template #prepend="{ isSelected }">
            <v-list-item-action start>
              <v-checkbox-btn
                color="primary"
                :model-value="isSelected"
              />
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>

      <v-color-picker
        v-model="color"
        hide-inputs
        show-swatches
        @update:model-value="onColorChange"
      />
    </template>
  </BuilderPropertiesContainer>
</template>

<script setup lang="ts">

import {useTripStore} from "~/stores/trip";
import type {ElementProps} from "~/components/builder/properties";
import {useRouteStore} from "~/stores/route";
import CollapsableList from "~/components/CollapsableList.vue";
import * as changeCase from "change-case";
import type {RouteDto} from "~/types/dto";
import type {ElevationProfileProps} from "~/components/builder/elements/elevation_profile/Props";
import type {Color} from "~/types/color";

// ---------------------------------------------------------------------------------------------------------------------


const props = defineProps<ElementProps<ElevationProfileProps>>();

// ---------------------------------------------------------------------------------------------------------------------

const tripStore = useTripStore();
const routeStore = useRouteStore();
const gridModuleStore = useGridStore();

const route = useRoute();

// ---------------------------------------------------------------------------------------------------------------------


const trip = await tripStore.get(Number(route.params.id));
const routes = await routeStore.getByTripId(trip!.id);

const selectedRoute: Ref<RouteDto | null> = ref(null);

const segments = computed(() => {
  if (!selectedRoute) {
    return [];
  }

  return selectedRoute.value?.segments;
});


const selection = computed({
  get() {
    if (!props.element.attributes || props.element.attributes.segmentsIds === undefined) {
      return [];
    }

    return props.element.attributes.segmentsIds;
  },
  set(selectedIds: number[]) {
    gridModuleStore.updateElementAttribute(props.element, "segmentsIds", selectedIds);
  }
});

watch(selectedRoute, () => {
  gridModuleStore
      .updateElementAttribute(props.element, "routeId", selectedRoute.value!.id);
});
// ---------------------------------------------------------------------------------------------------------------------

const color = computed(() => props.element.attributes.color);

/**
 * @param newValue
 */
function onColorChange(newValue: Color) {
  gridModuleStore.updateElementAttribute(props.element, "color", newValue);
}
</script>