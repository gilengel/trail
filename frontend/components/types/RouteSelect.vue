<template>
  <div class="t-route-select">

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
  </div>

  <v-btn @click="overlay = !overlay">
    Edit Routes
  </v-btn>

  <v-overlay v-model="overlay"
             activator=".t-route-select"
             location-strategy="connected"
             location="start"
             scroll-strategy="close"
  >
    <v-card class="pa-2">
      <v-card-text>
        <v-select
            label="Select Route"
            :items="routes?? []"
            item-value="id"
            item-title="name"

            v-model="selectedRoute"

            @update:model-value="(routeId: number) => selectedRouteChanged(routes?.find((r) => r.id === routeId)!)"
        >
          <template #item="{ props, item }">
            <v-list-item v-bind="props"/>
          </template>
        </v-select>
        <v-list
            :max-height="availableHeight()"
            v-model:selected="selection"
            select-strategy="leaf"
        >
          <v-list-item
              v-for="item in items"
              :key="item.type === 'segment' ? item.value : item.title"
              :value="item.type === 'segment' ? item.value : undefined"
          >
            <v-list-item-title>
              {{ item.title }}

              <template v-if="item.type === 'segment'">
                <Map
                    class="t-map"
                    :interactive="false"
                    :segments="[item.segment!]"
                />
              </template>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn
            color="orange-lighten-2"
            text="Explore"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script setup lang="ts">

import type {CustomPropertyConfig} from "@trail/grid-editor/properties/elementProperty";
import type {Route} from "~/components/builder/elements/RouteProperty";
import {useTripStore} from "~/stores/trip";
import {useRouteStore} from "~/stores/route";
import {inject} from "vue";
import {EditorInjectionKey} from "@trail/grid-editor/editor";
import type {RouteDto} from "~/types/dto";
import * as changeCase from "change-case";
import {MapLibreSegment} from "~/types/route";

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
}>();

const emit = defineEmits<{
  'update:modelValue': [value: Route | undefined]
}>();

// ---------------------------------------------------------------------------------------------------------------------

function availableHeight() {
  return window.screen.height * 0.6;
}

function selectedRouteChanged(route: RouteDto): void {
  emit('update:modelValue', {id: route.id, segmentIds: []});
  //selectedRoute.value = route;

  //emit("update:selectedRouteId", route.id);
}

const overlay: Ref<boolean> = ref(false);

const selectedRoute = computed(() => {
  return props.modelValue?.id
})

const selection = computed({
  get() {
    if (!props.modelValue) {
      return [];
    }

    return props.modelValue.segmentIds;
  },

  set(value) {
    emit('update:modelValue', {id: routeModel.value!.id, segmentIds: value});
  }
});

const routeModel: ComputedRef<RouteDto | undefined> = computed(() => {
  return routes!.find((route) => route.id === props.modelValue?.id);
});


type RouteItemSubheader = {
  type: 'subheader';
  title: string;
};

type RouteItemSegment = {
  type: 'segment';
  title: string;
  value: number;
  segment: MapLibreSegment | undefined;
};

export type RouteItem = RouteItemSubheader | RouteItemSegment;


const items = computedAsync<RouteItem[]>(async () => {
  if (!routeModel?.value) return [];

  const route = await routeStore.getMapLibreRoute(Number(routeModel.value.id));

  const segments: RouteItemSegment[] = routeModel.value.segments.map(
      (value, index) => ({
        type: 'segment',
        title: changeCase.sentenceCase(value.name ?? 'Untitled'),
        value: value.id,
        segment: route?.segments[index],
      })
  );

  const header: RouteItemSubheader = {
    type: 'subheader',
    title: changeCase.sentenceCase(routeModel.value.name ?? 'Untitled'),
  };

  return [
    header,
    ...segments,
  ];
});
</script>

<style scoped lang="scss">
.t-route-select {
  position: relative;
  padding: 0;
}

.t-map {
  min-width: 400px;
}
</style>