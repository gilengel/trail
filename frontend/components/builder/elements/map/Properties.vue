<template>
  <BuilderPropertiesContainer :grid="props.grid"
                              :id="props.element.id"
                              :properties="props.element.attributes"
                              :provided-properties="['routeId', 'segmentsIds']"
                              :consumed-properties="['routeId', 'segmentsIds']">
    <template #title>
      Map Properties
    </template>

    <template #properties>

      <v-alert
          v-if="props.element.connectedConsumedProperties.segmentsIds"
          type="warning"
          variant="outlined"
          prominent
      >
        Data is connected to another element. You can change it in that element here.
      </v-alert>


      <CollapsableList
          :collapse-number="3"
          :items="routes!"
          :text="(routeDto: RouteDto) => routeDto.name"
          @on-selection-changed="(e) => selectedRoute = e"
      />
      <v-list
          v-model:selected="selection"
          :disabled="props.element.connectedConsumedProperties.segmentsIds !== undefined"
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
import {
  type ConsumedProperties,
  type ProvidedProperties
} from "~/components/builder/elements/map/Properties";
import type {RouteProperty} from "~/components/builder/elements/RouteProperty";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<ElementProps<RouteProperty, ProvidedProperties, ConsumedProperties>>();

// ---------------------------------------------------------------------------------------------------------------------

const tripStore = useTripStore();
const routeStore = useRouteStore();
const gridStore = useGridStore();

const route = useRoute();

// ---------------------------------------------------------------------------------------------------------------------

const trip = await tripStore.get(Number(route.params.id));
const routes = await routeStore.getByTripId(trip!.id);

const selectedRoute: Ref<RouteDto | null> = ref(null);

const segments = computed(() => {
  if (!selectedRoute) {
    return null;
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
    gridStore.updateElementAttribute(props.element, "segmentsIds", selectedIds);
  }
});

watch(selectedRoute, () => {
  gridStore
      .updateElementAttribute(props.element, "routeId", selectedRoute.value!.id);
});
</script>