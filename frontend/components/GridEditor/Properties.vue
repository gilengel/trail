<template>
  <GridEditorPropertyConnections
      :grid="props.grid"
      :id="props.element.instanceId"
      :element="props.element"
  >
    <template #title>
      Properties
    </template>

    <template #properties>
      <v-expansion-panels
          multiple
          expand-icon="las la-angle-down"
          collapse-icon="las la-angle-up"
          flat>
        <v-expansion-panel
            v-for="(configuration, propertyKey) in props.definition.propertySchema"
            :key="propertyKey"
        >
          <v-expansion-panel-title>
            {{ configuration.label }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <component
                :is="getTypeComponent(configuration)"
                :config="configuration"
                :property-key="propertyKey"
                :model-value="props.element.properties[propertyKey]"
                @update:model-value="updateProperty(propertyKey, $event)"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>


    </template>
  </GridEditorPropertyConnections>
</template>

<script setup lang="ts">
import {inject} from "vue";
import {EditorInjectionKey} from "@trail/grid-editor/editor";
import type {EditorElementProperties} from "@trail/grid-editor/grid";
import {UpdateElementAttribute} from "@trail/grid-editor/undoredo/actions/updateElementAttribute";
import type {PropertyConfig} from "@trail/grid-editor/configuration/elementProperty";
import type {EditorElementInstance} from "@trail/grid-editor/editorElementInstanceRegistry";
import {GroupedUndoRedoAction, type IUndoRedoAction} from "@trail/grid-editor/undoredo";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<EditorElementProperties<any>>();

const {registry} = useElementRegistry();

// ---------------------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey);

// ---------------------------------------------------------------------------------------------------------------------

function getTypeComponent(typeConfiguration: PropertyConfig) {
  if (typeConfiguration.component) {
    return typeConfiguration.component;
  }

  return registry.properties.get(typeConfiguration.type);
}

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Recursively applies the changed property to all connected elements (via consumed property)
 *
 * @param propertyKey
 * @param value
 * @param element
 */
function createActionForDependentElements(propertyKey: string, value: any, element: EditorElementInstance<any>, actions: IUndoRedoAction[]) {
  actions.push(new UpdateElementAttribute<any>(element, propertyKey, value));

  const consumedProperties = element.connections.consumed;
  if (!consumedProperties[propertyKey]) {
    return actions;
  }

  const consumerId = consumedProperties[propertyKey];
  const consumingElement = editor!.findElementWithId(consumerId);
  if (!consumingElement) {
    throw new Error(`Consuming element with id ${consumerId} not found in grid`)
  }

  return createActionForDependentElements(propertyKey, value, consumingElement, actions);
}

function updateProperty(propertyKey: string, value: any) {
  try {
    const actions = createActionForDependentElements(propertyKey, value, props.element, []);
    editor?.executeAction(new GroupedUndoRedoAction(actions));
  } catch (e) {
    console.error(e);
  }
}
</script>

