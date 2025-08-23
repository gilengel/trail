<template>
  <BuilderPropertiesContainer
      :grid="props.grid"
      :id="props.element.id"
      :properties="props.element.attributes"
      :provided-properties="['routeId', 'segmentsIds']"
      :consumed-properties="['routeId', 'segmentsIds']"
  >
    <template #title>
      Map Properties
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
    </template>
  </BuilderPropertiesContainer>
</template>

<script setup lang="ts">

import {useTripStore} from "~/stores/trip";
import type {ElementProps} from "~/components/builder/properties";
import {useRouteStore} from "~/stores/route";
import type {RouteDto} from "~/types/dto";
import type {
  ConsumedPropertiesRoute,
  ProvidedPropertiesRoute,
  RouteProperty
} from "~/components/builder/elements/RouteProperty";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<ElementProps<RouteProperty, ProvidedPropertiesRoute, ConsumedPropertiesRoute>>();

// ---------------------------------------------------------------------------------------------------------------------

const tripStore = useTripStore();
const routeStore = useRouteStore();
const gridStore = useGridStore();

const route = useRoute();

// ---------------------------------------------------------------------------------------------------------------------

const trip = await tripStore.get(Number(route.params.id));
const routes = await routeStore.getByTripId(trip!.id);

const selectedRoute: Ref<RouteDto | null> = ref(null);

// ---------------------------------------------------------------------------------------------------------------------

watch(selectedRoute, () => {
  gridStore
      .updateElementAttribute(props.element, "routeId", selectedRoute.value!.id);
});

// ---------------------------------------------------------------------------------------------------------------------

function onRouteIdChanged(routeId: number) {
  gridStore
      .updateElementAttribute<RouteProperty, "routeId", ProvidedPropertiesRoute, ConsumedPropertiesRoute>(props.element, "routeId", routeId);
}

function onSelectionChanged(segmentIds: number[]) {
  gridStore
      .updateElementAttribute<RouteProperty, "segmentsIds", ProvidedPropertiesRoute, ConsumedPropertiesRoute>(props.element, "segmentsIds", segmentIds);
}
</script>