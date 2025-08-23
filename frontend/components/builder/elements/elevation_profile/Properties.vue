<template>
  <BuilderPropertiesContainer
      :grid="props.grid"
      :id="props.element.id"
      :properties="props.element.attributes"
      :provided-properties="['routeId', 'segmentsIds']"
      :consumed-properties="['routeId', 'segmentsIds']"
      :connected-provided-properties="element.connectedProvidedProperties"
      :connected-consumed-properties="element.connectedConsumedProperties"
      @connected-consumed-property-removed="(e) => onConsumedPropertyRemoved(e as 'routeId' | 'segmentsIds')"
  >
    <template #title>
      Elevation Profile Properties
    </template>

    <template #properties>
      <BuilderPropertiesSegments v-if="routes"
                                 :routes
                                 :route-id="element.attributes.routeId"
                                 :segments-ids="element.attributes.segmentsIds"
                                 :is-consumed="element.connectedProvidedProperties.segmentsIds !== undefined"
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
import {Element} from "~/types/grid";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<ElementProps<ElevationProfileProperties, ProvidedPropertiesRoute, ConsumedPropertiesRoute>>();

// ---------------------------------------------------------------------------------------------------------------------

const tripStore = useTripStore();
const routeStore = useRouteStore();
const gridStore = useGridStore();

const route = useRoute();

// ---------------------------------------------------------------------------------------------------------------------


const trip = await tripStore.get(Number(route.params.id));
const routes = await routeStore.getByTripId(trip!.id);

function onConsumedPropertyRemoved(property: "segmentsIds" | "routeId") {
  if (!(property in props.element.connectedProvidedProperties)) {
    console.error("Cannot remove consumed properties.");
  }

  const providerElementId = props.element.connectedProvidedProperties[property];
  const providerElement = gridStore.findElementWithId<ElevationProfileProperties, ProvidedPropertiesRoute, ConsumedPropertiesRoute>(providerElementId!, props.grid)!;

  // Necessary to reconstruct here as connected
  const {[property]: _, ...rest} = props.element.connectedProvidedProperties;
  props.element.connectedProvidedProperties = rest;

  const {[property]: __, ...restProvider} = providerElement.connectedConsumedProperties;
  providerElement.connectedConsumedProperties = restProvider;
}

function onRouteIdChanged(routeId: number) {
  propagateChangedProperty("routeId", routeId, props.element)
}

/**
 * Recursively applies the changed property to all connected elements (via consumed property)
 *
 * @param property
 * @param value
 * @param element
 */
function propagateChangedProperty(property: ProvidedPropertiesRoute[number], value: any, element: Element<ElevationProfileProperties, ProvidedPropertiesRoute, ConsumedPropertiesRoute>) {
  gridStore
      .updateElementAttribute<ElevationProfileProperties, typeof property, ProvidedPropertiesRoute, ConsumedPropertiesRoute>(element, property, value);

  const consumedProperties = element.connectedConsumedProperties;
  if (!consumedProperties[property]) {
    return;
  }

  const consumerId = consumedProperties[property];
  const consumingElement = gridStore.findElementWithId<ElevationProfileProperties, ProvidedPropertiesRoute, ConsumedPropertiesRoute>(consumerId, props.grid);
  if (!consumingElement) {
    console.error(`Consuming element with id ${consumerId} not found in grid`)
    return;
  }
  gridStore
      .updateElementAttribute<ElevationProfileProperties, typeof property, ProvidedPropertiesRoute, ConsumedPropertiesRoute>(consumingElement, property, value);

  propagateChangedProperty(property, value, consumingElement);
}

function onSelectionChanged(segmentIds: number[]) {
  propagateChangedProperty("segmentsIds", segmentIds, props.element)
}

// ---------------------------------------------------------------------------------------------------------------------

const color = computed(() => props.element.attributes.color);

/**
 * @param newValue
 */
function onColorChange(newValue: Color) {
  gridStore.updateElementAttribute(props.element, "color", newValue);
}
</script>