<template>
  <BuilderPropertiesContainer>
    <template #title>
      Map Properties
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
          v-for="(item, index) in segments"
          :key="item.id"
          :title="changeCase.sentenceCase(item.name ?? 'Untitled')"
          :value="index"
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
import {RouteDto} from "~/types/dto";
import * as changeCase from "change-case";

// ---------------------------------------------------------------------------------------------------------------------

interface Props {
  segments: {
    route: number,
    segments: number[]
  }
}

defineProps<ElementProps<Props>>();

// ---------------------------------------------------------------------------------------------------------------------

const tripStore = useTripStore();
const routeStore = useRouteStore();

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
})

/*
const selection = ref(props.element.attributes.segments.segments);
const selection = computed(() => props.element.attributes.segments.segments);

watch(props, (newVal) => {
  selection.value = newVal.element.attributes.segments.segments;
}, {deep: true, immediate: true})

watch(selection, (newVal) => {
  if (!selectedRoute.value) {
    return;
  }
  gridModuleStore
      .updateElementAttribute(props.element, "segments", {
        route: selectedRoute.value!.id,
        segments: newVal

      })
      .catch((e) => console.error(e));
})
*/
</script>