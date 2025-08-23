<template>
  <v-alert
      v-if="isConsumed"
      type="warning"
      variant="outlined"
      prominent
  >
    Data is connected to another element. You can change it in that element here.
  </v-alert>
  <CollapsableList
      :collapse-number="3"
      :items="routes"
      :text="(routeDto: RouteDto) => routeDto.name"
      @on-selection-changed="selectedRouteChanged"
  />
  <v-list
      :disabled="isConsumed"
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
</template>

<script setup lang="ts">

import type {RouteDto} from "~/types/dto";
import * as changeCase from "change-case";
import type {RouteProperty} from "~/components/builder/elements/RouteProperty";

// ---------------------------------------------------------------------------------------------------------------------

interface Props extends RouteProperty {
  routes: RouteDto[],
  isConsumed: boolean
}

const {routeId, segmentsIds = [], routes, isConsumed} = defineProps<Props>();

// ---------------------------------------------------------------------------------------------------------------------

const emit = defineEmits<{
  (event: 'update:selectedSegmentIds', segmentIds: number[]): void
  (event: 'update:selectedRouteId', routeId: number): void
}>();
// ---------------------------------------------------------------------------------------------------------------------

const selectedRoute: Ref<RouteDto | null> = ref(null);

const segments = computed(() => {
  if (routeId && segmentsIds) {

    const route = routes.find((route) => route.id === routeId);

    if (!route) {
      return [];
    }

    return route.segments;
  }

  return selectedRoute.value?.segments;
});

const selection = ref([...segmentsIds]);


watch(selection, (selectedSegments) => {
  if (!routeId) {
    throw new Error(`SegmentsComponent set selectedSegments without a valid routeID`);
  }

  emit("update:selectedRouteId", routeId);
  emit("update:selectedSegmentIds", selectedSegments);
});

function selectedRouteChanged(route: RouteDto): void {
  selectedRoute.value = route;

  emit("update:selectedRouteId", route.id);
}

</script>

<style scoped lang="scss">

</style>