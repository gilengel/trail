<template>
  <BuilderPropertiesContainer
      :grid="props.grid"
      :id="props.element.instanceId"
      :element="props.element"
      @connected-consumed-property-removed="(e) => onConsumedPropertyRemoved(e as 'routeId' | 'segmentsIds')"
  >
    <template #title>
      Map Properties
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
    </template>
  </BuilderPropertiesContainer>
</template>

<script setup lang="ts">

import {useTripStore} from "~/stores/trip";
import {useRouteStore} from "~/stores/route";
import type {RouteDto} from "~/types/dto";
import {inject} from "vue";
import {EditorInjectionKey} from "@trail/grid-editor/editor";
import type {EditorElementProperties} from "@trail/grid-editor/grid";
import type {MapElement} from "~/components/builder/elements/map/index";
import {UpdateElementAttribute} from "@trail/grid-editor/undoredo/actions/updateElementAttribute";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<EditorElementProperties<typeof MapElement>>();

// ---------------------------------------------------------------------------------------------------------------------

const tripStore = useTripStore();
const routeStore = useRouteStore();
const route = useRoute();

// ---------------------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey);
if (!editor) {
  throw new Error("Editor instance was not injected in Row");
}

// ---------------------------------------------------------------------------------------------------------------------

const trip = await tripStore.get(Number(route.params.id));
const routes = await routeStore.getByTripId(trip!.id);

const selectedRoute: Ref<RouteDto | null> = ref(null);

// ---------------------------------------------------------------------------------------------------------------------

watch(selectedRoute, () => {
  editor.executeAction(new UpdateElementAttribute<typeof MapElement>(props.element, "routeId", selectedRoute.value!.id))

});

// ---------------------------------------------------------------------------------------------------------------------

function onRouteIdChanged(routeId: number) {
  editor!.executeAction(new UpdateElementAttribute<typeof MapElement>(props.element, "routeId", routeId))
}

function onSelectionChanged(segmentIds: number[]) {
  editor!.executeAction(new UpdateElementAttribute<typeof MapElement>(props.element, "segmentsIds", segmentIds))
}
</script>