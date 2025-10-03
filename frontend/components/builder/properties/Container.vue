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
              v-for="(item, i) in props.element.defaults.providedProperties"
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
              v-for="(item, i) in props.element.defaults.consumedProperties"
              :key="i"
              :value="item"

          >
            <template v-slot:prepend>
              <v-icon icon="las la-arrow-circle-left" :color="isConnected(item as string) ? 'warning' : ''"/>
            </template>

            <v-list-item-title :class="isConnected(item as string) ? 'text-warning' : ''"
                               v-text="item"/>

            <template v-slot:append v-if="isConnected(item as string)">
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

<script setup lang="ts" generic="Element extends EditorElementDefinition<any, any, any>">
// ---------------------------------------------------------------------------------------------------------------------
// This is the parent component for all element property components.
//
// ⚠️ It is tightly coupled to the editor (WidgetLayout) as it uses the editors provided functions
// (like switching the internal active state) which was chosen to avoid (re)emitting events up
// the component tree.
// ---------------------------------------------------------------------------------------------------------------------

import {inject} from 'vue';
import type {Grid} from "@trail/grid-editor/grid";
import {BuilderMode, EditorInjectionKey} from "@trail/grid-editor/editor";
import type {EditorElementInstance} from "@trail/grid-editor/editorElementInstanceRegistry";
import type {EditorElementDefinition} from "@trail/grid-editor/editorConfiguration";


// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<{
  grid: Grid,
  id: string,
  element: EditorElementInstance<Element>
}>();

// ---------------------------------------------------------------------------------------------------------------------

const emit = defineEmits<(e: "connectedConsumedPropertyRemoved", property: string) => void>();

// ---------------------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey);
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
  return item in props.element.connections.consumed;
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
function findAllElementsWithProperties(propertyKeys: string[], grid: Grid, direction: PropertyDirection): EditorElementInstance<any>[] {

  function areAllKeysOf(arr: string[], obj: Partial<Record<string, string>> | undefined): boolean {
    if (!obj) return false;
    return arr.every(key => key in obj);
  }

  return grid.rows.flatMap(row =>
      row.columns
          .map(column => column.element)
          .filter(element => element &&
              element.instanceId !== props.id &&
              areAllKeysOf(propertyKeys, direction === PropertyDirection.Provided ? element.connections.provided : element.connections.consumed))
          .filter(Boolean) as EditorElementInstance<any>[]
  );
}

function propertySelected(propertyKey: string, direction: PropertyDirection) {
  const filtered = findAllElementsWithProperties([propertyKey], props.grid, direction)

  editor!.highlightHandler.clear();
  editor!.highlightHandler.add<any>(filtered);

  editor!.switchMode(BuilderMode.ConnectProperty, {property: propertyKey})
}

</script>