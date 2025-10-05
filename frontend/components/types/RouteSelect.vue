<template>
  <CollapsableList
      v-if="routes"
      :collapse-number="3"
      :items="routes"
      :text="(routeDto: RouteDto) => routeDto.name"
      @on-selection-changed="selectedRouteChanged"
  />

  <v-list
      v-model:selected="selection"
      select-strategy="leaf"
      multiple
      max-height="600px"
  >
    <v-list-item
        v-for="item in routeModel?.segments"
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

import type {CustomPropertyConfig} from "@trail/grid-editor/configuration/elementProperty";
import type {Route} from "~/components/builder/elements/RouteProperty";
import {useTripStore} from "~/stores/trip";
import {useRouteStore} from "~/stores/route";
import {inject} from "vue";
import {EditorInjectionKey} from "@trail/grid-editor/editor";
import type {RouteDto} from "~/types/dto";
import * as changeCase from "change-case";

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

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<{
  config: CustomPropertyConfig
  propertyKey: string
  modelValue: Route | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Route | undefined]
}>()

// ---------------------------------------------------------------------------------------------------------------------

function selectedRouteChanged(route: RouteDto): void {
  emit('update:modelValue', {id: route.id, segmentIds: []})
  //selectedRoute.value = route;

  //emit("update:selectedRouteId", route.id);
}

const selection = computed({
  get() {
    if (!props.modelValue) {
      return []
    }

    return props.modelValue.segmentIds
  },

  set(value) {
    emit('update:modelValue', {id: routeModel.value?.id!, segmentIds: value})
  }
})

const routeModel: ComputedRef<RouteDto | undefined> = computed(() => {
  return routes!.find((route) => route.id === props.modelValue?.id);
})
</script>