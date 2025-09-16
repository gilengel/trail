<template>
  <BuilderPropertiesContainer
      :grid="props.grid"
      :id="props.element.id"
      :properties="props.element.properties"
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
                                 :route-id="element.properties.routeId"
                                 :segments-ids="element.properties.segmentsIds"
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
import {useRouteStore} from "~/stores/route";

import type {Color} from "~/types/color";
import type {ConsumedPropertiesRoute, ProvidedPropertiesRoute} from "~/components/builder/elements/RouteProperty";
import {inject} from "vue";
import {EditorInjectionKey} from "~/components/GridEditor/editor";
import {UpdateElementAttribute} from "~/stores/editor/actions/updateElementAttribute";
import {type EditorElementProperties} from "~/components/GridEditor/grid"
import {ElevationProfileElement} from "~/components/builder/elements/elevation_profile/index";
import type {EditorElementInstance} from "~/components/GridEditor/editorElementInstanceRegistry";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<EditorElementProperties<typeof ElevationProfileElement>>();

// ---------------------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey);

// ---------------------------------------------------------------------------------------------------------------------

const tripStore = useTripStore();
const routeStore = useRouteStore();

const route = useRoute();

// ---------------------------------------------------------------------------------------------------------------------


const trip = await tripStore.get(Number(route.params.id));
const routes = await routeStore.getByTripId(trip!.id);

function onConsumedPropertyRemoved(property: "segmentsIds" | "routeId") {
  if (!(property in props.element.connectedProvidedProperties)) {
    console.error("Cannot remove consumed properties.");
  }

  const providerElementId = props.element.connectedProvidedProperties[property];
  const providerElement = editor!.findElementWithId<typeof ElevationProfileElement>(providerElementId!, props.grid)!;

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
function propagateChangedProperty(property: ProvidedPropertiesRoute[number], value: any, element: EditorElementInstance<typeof ElevationProfileElement>) {
  editor?.executeAction(new UpdateElementAttribute<typeof ElevationProfileElement>(element, property, value));

  const consumedProperties = element.connectedConsumedProperties;
  if (!consumedProperties[property]) {
    return;
  }

  const consumerId = consumedProperties[property];
  const consumingElement = editor!.findElementWithId<ElevationProfileProperties, ProvidedPropertiesRoute, ConsumedPropertiesRoute>(consumerId, props.grid);
  if (!consumingElement) {
    console.error(`Consuming element with id ${consumerId} not found in grid`)
    return;
  }
  editor?.executeAction(new UpdateElementAttribute<typeof ElevationProfileElement>(consumingElement, property, value));

  propagateChangedProperty(property, value, consumingElement);
}

function onSelectionChanged(segmentIds: number[]) {
  propagateChangedProperty("segmentsIds", segmentIds, props.element)
}

// ---------------------------------------------------------------------------------------------------------------------

const color = computed(() => props.element.properties.color);

/**
 * @param newValue
 */
function onColorChange(newValue: Color) {

  editor?.executeAction(new UpdateElementAttribute<typeof ElevationProfileElement>(props.element, "color", newValue));
}
</script>