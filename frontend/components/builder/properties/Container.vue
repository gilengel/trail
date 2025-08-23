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
              @click="propertySelected(item as string, PropertyDirection.Consumed)"
          >
            <template #prepend>
              <v-icon icon="las la-arrow-circle-right"/>
            </template>

            <v-list-item-title v-text="item"/>
          </v-list-item>
        </v-list>

        Consumed
        <v-list>
          <v-list-item
              v-for="(item, i) in props.consumedProperties"
              :key="i"
              :value="item"

          >
            <template v-slot:prepend>
              <v-icon icon="las la-arrow-circle-left" :color="isConnected(item) ? 'warning' : ''"/>
            </template>

            <v-list-item-title :class="isConnected(item) ? 'text-warning' : ''"
                               v-text="item"/>

            <template v-slot:append v-if="isConnected(item)">
              <v-btn
                  color="warning"
                  icon="las la-trash-alt"
                  variant="text"
                  @click="clearConnection(item as string)"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts" generic="Properties extends object,
    ProvidedProperties extends Array<keyof Properties> = [],
    ConsumedProperties extends Array<keyof Properties> = []"
>
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
  id: string,
  properties: Properties,
  providedProperties: ProvidedProperties,
  consumedProperties: ConsumedProperties,
  connectedProvidedProperties: Partial<Record<ProvidedProperties[number], string>>,
  connectedConsumedProperties: Partial<Record<ConsumedProperties[number], string>>,
}>();

// ---------------------------------------------------------------------------------------------------------------------

const emit = defineEmits<(e: "connectedConsumedPropertyRemoved", property: string) => void>();

// ---------------------------------------------------------------------------------------------------------------------

const switchMode = inject(SwitchModeKey);
if (!switchMode) {
  throw new Error("Container component is missing the 'switchMode' injected function.");
}

const editor: Editor = inject("editor")
if (!editor) {
  throw new Error("Container component is missing the 'editor' injected object.");
}

// ---------------------------------------------------------------------------------------------------------------------

enum PropertyDirection {
  Provided = "Provided",
  Consumed = "Consumed",
}

// ---------------------------------------------------------------------------------------------------------------------

function isConnected(item: string | number | symbol) {
  if (!props.connectedProvidedProperties) {
    return false
  }

  return item in props.connectedProvidedProperties;
}

function clearConnection(item: string) {
  emit("connectedConsumedPropertyRemoved", item);
}

/**
 * Searches in all elements the elements that have the given properties with the given direction.
 *
 * @param propertyKeys The keys of properties (or in other terms names) the element needs to have
 * @param grid The grid where all elements are searched in
 * @param direction Either Provided or Consumed.
 *
 * @returns All the elements that have the properties
 */
function findAllElementsWithProperties(propertyKeys: string[], grid: Grid, direction: PropertyDirection): Element<object>[] {
  function areAllKeysOf<T extends readonly string[]>(arr: string[], obj: T): boolean {
    return arr.every(key => obj.includes(key));
  }

  return grid.rows.flatMap(row =>
      row.columns
          .map(column => column.element)
          .filter(element => element &&
              element.id != props.id &&
              areAllKeysOf(propertyKeys, direction == PropertyDirection.Provided ? element.providedProperties : element.consumedProperties))
          .filter(Boolean) as Element<object>[]
  );
}

function propertySelected(propertyKey: string, direction: PropertyDirection) {
  const filtered = findAllElementsWithProperties([propertyKey], props.grid, direction)

  editor.highlightHandler.clear();
  editor.highlightHandler.push(filtered);

  editor.switchMode(BuilderMode.ConnectProperty, {property: propertyKey})
}

</script>