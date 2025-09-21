<template>
  <BuilderPropertiesContainer
      :grid="props.grid"
      :id="props.element.instanceId"
      :element="props.element"
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
                                 :is-consumed="'segmentsIds' in element.connections.provided"
                                 @update:selected-segment-ids="onSelectionChanged"
                                 @update:selected-route-id="onRouteIdChanged"
      />

      <v-color-picker
          v-model="color"
          hide-inputs
          show-swatches
      />
    </template>
  </BuilderPropertiesContainer>
</template>

<script setup lang="ts">

import {useTripStore} from "~/stores/trip";
import {useRouteStore} from "~/stores/route";

import type {ProvidedPropertiesRoute} from "~/components/builder/elements/RouteProperty";
import {inject} from "vue";
import {EditorInjectionKey} from "~/components/GridEditor/editor";
import {UpdateElementAttribute} from "~/stores/editor/actions/updateElementAttribute";
import {type EditorElementProperties} from "~/components/GridEditor/grid"
import {ElevationProfileElement} from "~/components/builder/elements/elevation_profile/index";
import type {EditorElementInstance} from "~/components/GridEditor/editorElementInstanceRegistry";
import type {ElementProvidedProperties} from "~/components/GridEditor/editorConfiguration";

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

function onConsumedPropertyRemoved(property: ElementProvidedProperties<typeof ElevationProfileElement>) {
  if (property in props.element.connections.provided) {
    console.error("Cannot remove consumed properties.");
    return;
  }


  const providerElementId = props.element.connections.provided[property];

  const providerElement = editor!.findElementWithId(providerElementId!, props.grid)!;

  // Necessary to reconstruct here as connected
  const {[property]: _, ...rest} = props.element.connections.provided;
  props.element.connections.provided = rest;

  const {[property]: __, ...restProvider} = providerElement.connections.consumed;
  providerElement.connections.consumed = restProvider;

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


  const consumedProperties = element.connections.consumed;
  if (!consumedProperties[property]) {
    return;
  }

  const consumerId = consumedProperties[property];
  const consumingElement = editor!.findElementWithId(consumerId, props.grid);
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

const color = computed({
  get() {
    return props.element.properties.color
  },
  set(newValue) {
    editor?.executeAction(new UpdateElementAttribute<typeof ElevationProfileElement>(props.element, "color", newValue));
  }
});
</script>