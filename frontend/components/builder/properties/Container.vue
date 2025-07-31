<template>
  <div class="pa-5">
    <v-card
        class="rounded-sm"
        variant="flat"
    >
      <v-card-title>
        <slot name="title"/>
      </v-card-title>
      <v-card-text>
        <slot name="properties"/>

        Provided
        <v-list>
          <v-list-item
              v-for="(item, i) in props.providedProperties"
              :key="i"
              :value="item"
              color="primary"
          >
            <template v-slot:prepend>
              <v-icon icon="las la-arrow-circle-right"></v-icon>
            </template>

            <v-list-item-title v-text="item"></v-list-item-title>
          </v-list-item>
        </v-list>

        Consumed
        <v-list>
          <v-list-item
              v-for="(item, i) in props.consumedProperties"
              :key="i"
              :value="item"
              color="primary"
              @click="select(item as string)"
          >
            <template v-slot:prepend>
              <v-icon icon="las la-arrow-circle-left"></v-icon>
            </template>

            <v-list-item-title v-text="item"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts" generic="Properties extends object,
    ProvidedProperties extends Array<keyof Properties> = [],
    ConsumedProperties extends Array<keyof Properties> = []">
// ---------------------------------------------------------------------------------------------------------------------
// This is the parent component for all element property components.
//
// ⚠️ It is tightly coupled to the editor (WidgetLayout) as it uses the editors provided functions
// (like switching the internal active state) which was chosen to avoid (re)emitting events up
// the component tree.
// ---------------------------------------------------------------------------------------------------------------------

import {Element, type Grid} from "~/types/grid";
import {inject} from 'vue';

import {
  BuilderMode,
  SwitchModeKey
} from "~/components/builder/BuilderMode";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<{
  grid: Grid,
  id: String,
  properties: Properties,
  providedProperties: ProvidedProperties,
  consumedProperties: ConsumedProperties
}>();

// ---------------------------------------------------------------------------------------------------------------------

const gridModuleStore = useGridStore();

// ---------------------------------------------------------------------------------------------------------------------


const switchMode = inject(SwitchModeKey);
if (!switchMode) {
  throw new Error("Container component is missing the 'switchMode' injected function.")
}

// ---------------------------------------------------------------------------------------------------------------------

function findAllElementsWithProvidedProperties(providedProperties: string[], grid: Grid): Element<object>[] {
  function areAllKeysOf<T extends readonly string[]>(arr: string[], obj: T): boolean {
    return arr.every(key => obj.includes(key));
  }

  return grid.rows.flatMap(row =>
      row.columns
          .map(column => column.element)
          .filter(element => element && element.id != props.id && areAllKeysOf(providedProperties, element.providedProperties))
          .filter(Boolean) as Element<object>[]
  );
}

function select(e: string) {
  const filtered = findAllElementsWithProvidedProperties([e], props.grid);

  gridModuleStore.clearHighlightedElements();
  for (let filteredElement of filtered) {
    gridModuleStore.addHighlightedElement(filteredElement);
  }

  switchMode!(BuilderMode.Connect);
}

</script>