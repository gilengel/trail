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

        <v-divider/>
        <span class="v-expansion-panel-title v-expansion-panel-title--static">Provided</span>
        <v-list>
          <v-list-item
              v-for="(item, i) in provided"
              :key="i"
              :value="item"
              color="primary"
              @click="propertySelected(item.property, Direction.Consumed)"
          >
            <template #prepend>
              <v-icon
                  icon="las la-arrow-circle-right"
                  :color="item.connected ? 'warning' : ''"
              />
            </template>

            <v-list-item-title :class="item.connected ? 'text-warning' : ''">
              {{ item.property }}
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider/>
        <span class="v-expansion-panel-title v-expansion-panel-title--static">Consumed</span>

        <v-list>
          <v-list-item
              v-for="(item, i) in consumed"
              :key="i"
              :value="item"
          >
            <template #prepend>
              <v-icon
                  icon="las la-arrow-circle-left"
                  :color="item.connected ? 'warning' : ''"
              />
            </template>

            <v-list-item-title :class="item.connected ? 'text-warning' : ''">
              {{ item.property }}
            </v-list-item-title>

            <template
                #append
                v-if="item.connected"
            >
              <v-btn
                  color="warning"
                  icon="las la-trash-alt"
                  variant="text"
                  @click="clearConnection(item.property)"
              />
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts" generic="Element extends EditorElementDefinition<any, any, any, any>">
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
import type {EditorElementInstance} from "@trail/grid-editor/instances/instance";
import type {EditorElementDefinition} from "@trail/grid-editor/definition/elementDefinition";
import {Direction} from "@trail/grid-editor/instances/iinstanceRegistry";


// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<{
  grid: Grid,
  id: string,
  element: EditorElementInstance<Element>,
}>();

// ---------------------------------------------------------------------------------------------------------------------

const emit = defineEmits<(e: "connectedConsumedPropertyRemoved", property: string) => void>();

// ---------------------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey);
if (!editor) {
  throw new Error("Container component is missing the 'editor' injected object.");
}

// ---------------------------------------------------------------------------------------------------------------------

const provided = computed(() => {
  function fn(property: string) {
    return {
      property,
      connected: (props.element.connections.provided as Record<string, unknown>)[property] !== undefined
    };
  }

  const definition = editor.definitions.get(props.element.elementId);
  return definition!.defaults.connections.provided.properties.map(fn);
});

const consumed = computed(() => {
  function fn(property: string) {
    return {
      property,
      connected: (props.element.connections.consumed as Record<string, unknown>)[property] !== undefined
    };
  }

  const definition = editor.definitions.get(props.element.elementId);
  return definition!.defaults.connections.provided.properties.map(fn);
});

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
function findAllElementsWithProperties(propertyKeys: string[], grid: Grid, direction: Direction): EditorElementInstance<any>[] {

  function otherElementHasAllPropertiesAsConnections(_propertyKeys: string[], obj: Partial<Record<string, string[]>> | undefined): boolean {
    if (!obj) return false;
    return _propertyKeys.every(_propertyKeys => _propertyKeys in obj);
  }

  const otherElementThanCurrentInstances = (element: EditorElementInstance) => element.instanceId !== props.id
  const getCorrectProperties = (element: EditorElementInstance) => {
    if (direction === Direction.Provided) {
      return element.connections.provided.properties
    }

    return element.connections.consumed.properties
  }
  return grid.rows.flatMap(row =>
      row.columns
          .map(column => column.element)
          .filter(element => element &&
              otherElementThanCurrentInstances(element) &&
              otherElementHasAllPropertiesAsConnections(propertyKeys, getCorrectProperties(element)))
          .filter(Boolean) as EditorElementInstance[]
  );
}

function propertySelected(propertyKey: string, direction: Direction) {
  const inverseDirection = direction === Direction.Consumed ? Direction.Provided : Direction.Consumed;
  const filtered = findAllElementsWithProperties([propertyKey], props.grid, inverseDirection);


  editor!.clearAllHighlightedElements();
  editor!.highlightElements(filtered);

  editor!.switchMode(BuilderMode.ConnectProperty, {property: propertyKey});
}

</script>

<style lang="scss">
.v-expansion-panel-title {
  padding: 0 !important;
}
</style>