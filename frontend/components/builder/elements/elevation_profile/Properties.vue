<template>
  <BuilderPropertiesContainer :grid="props.grid"
                              :id="props.element.id"
                              :properties="props.element.attributes"
                              :provided-properties="['routeId', 'segmentsIds']"
                              :consumed-properties="['routeId', 'segmentsIds']">
    <template #title>
      Elevation Profile Properties
    </template>

    <template #properties>
      {{ element.attributes.segmentsIds }}
      <BuilderPropertiesSegments :routes
                                 :route-id="element.attributes.routeId"
                                 :segments-ids="element.attributes.segmentsIds"
                                 :is-consumed="element.connectedConsumedProperties.segmentsIds !== undefined"
                                 @update:selected-segment-ids="onSelectionChanged"
                                 @update:selected-route-id="onRouteIdChanged"
      />


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

import type {Color} from "~/types/color";
import type {ElevationProfileProperties} from "~/components/builder/elements/elevation_profile/Properties";
import type {ConsumedPropertiesRoute, ProvidedPropertiesRoute} from "~/components/builder/elements/RouteProperty";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<ElementProps<ElevationProfileProperties, ProvidedPropertiesRoute, ConsumedPropertiesRoute>>();

// ---------------------------------------------------------------------------------------------------------------------

const tripStore = useTripStore();
const routeStore = useRouteStore();
const gridModuleStore = useGridStore();

const route = useRoute();

// ---------------------------------------------------------------------------------------------------------------------


const trip = await tripStore.get(Number(route.params.id));
const routes = await routeStore.getByTripId(trip!.id);


function onRouteIdChanged(routeId: number) {
  gridModuleStore
      .updateElementAttribute<ElevationProfileProperties, "routeId", ProvidedPropertiesRoute, ConsumedPropertiesRoute>(props.element, "routeId", routeId);
}

function onSelectionChanged(segmentIds: number[]) {
  gridModuleStore
      .updateElementAttribute<ElevationProfileProperties, "segmentsIds", ProvidedPropertiesRoute, ConsumedPropertiesRoute>(props.element, "segmentsIds", segmentIds);
}

// ---------------------------------------------------------------------------------------------------------------------

const color = computed(() => props.element.attributes.color);

/**
 * @param newValue
 */
function onColorChange(newValue: Color) {
  gridModuleStore.updateElementAttribute(props.element, "color", newValue);
}
</script>