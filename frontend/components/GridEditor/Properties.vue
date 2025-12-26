<template>
  <GridEditorPropertyConnections
    :grid="props.grid"
    :id="props.element.instanceId"
    :element="props.element"
  >
    <template #title />

    <template #properties>
      <v-dialog
        max-width="500"
        v-model="dialog"
      >
        <GridEditorEventConnections
          :element="props.element"
          :editor
          @event:selected="eventSelected"
          @event:remove-listener="eventRemoveListener"
          @property:selected="propertySelected"
        />
      </v-dialog>

      <v-row
        align="center"
        justify="center"
      >
        <v-col cols="auto">
          <v-btn
            variant="flat"
            icon="las la-link"
            @click="dialog = true"
          />
        </v-col>
      </v-row>
      <v-expansion-panels
        static
        multiple
        expand-icon="las la-angle-down"
        collapse-icon="las la-angle-up"
        flat
        v-model="model"
      >
        <v-expansion-panel
          v-for="(configuration, propertyKey) in props.definition
            .propertySchema"
          :key="propertyKey"
          :value="propertyKey"
        >
          <v-expansion-panel-title>
            {{ configuration!.label }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <component
              :is="getTypeComponent(configuration!)"
              :config="configuration"
              :property-key="propertyKey"
              :model-value="props.element.properties[propertyKey as string]"
              @update:model-value="
                updateProperty(propertyKey as string, $event)
              "
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </GridEditorPropertyConnections>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { BuilderMode, EditorInjectionKey } from "@trail/grid-editor/editor";
import type { EditorElementProperties } from "@trail/grid-editor/grid";
import { UpdateElementAttribute } from "@trail/grid-editor/undoredo/actions/updateElementAttribute";
import type { PropertyConfig } from "@trail/grid-editor/properties/elementProperty";
import type {
  EditorElementInstance,
  ElementInstanceId,
} from "@trail/grid-editor/instances/instance";
import {
  GroupedUndoRedoAction,
  type IUndoRedoAction,
} from "@trail/grid-editor/undoredo";
import type { EventConfig } from "@trail/grid-editor/events/eventRegistry";
import { Direction } from "@trail/grid-editor/instances/iinstanceRegistry";

//-- PROPS -------------------------------------------------------------------------------------------------------------

const props = defineProps<EditorElementProperties<any>>();

// ---------------------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey)!;

//-- COMPUTED ----------------------------------------------------------------------------------------------------------

const model = defineModel<string[]>();

watchEffect(() => {
  if (!model.value) {
    model.value = Object.keys(
      props.definition.propertySchema as Record<string, unknown>,
    );
  }
});

//-- REFS --------------------------------------------------------------------------------------------------------------

const dialog = ref(false);

//----------------------------------------------------------------------------------------------------------------------

function getTypeComponent(typeConfiguration: PropertyConfig) {
  if (typeConfiguration.component) {
    return typeConfiguration.component;
  }

  return editor!.properties.get(typeConfiguration.type);
}

/**
 * Recursively applies the changed property to all connected elements (via consumed property)
 *
 * @param propertyKey
 * @param value
 * @param element
 * @param actions
 */
function createActionForDependentElements(
  propertyKey: string,
  value: any,
  element: EditorElementInstance,
  actions: IUndoRedoAction[],
) {
  actions.push(new UpdateElementAttribute<any>(element, propertyKey, value));

  const consumedProperties = element.connections.consumed;
  if (!consumedProperties.properties[propertyKey]) {
    return actions;
  }

  const consumerIds = consumedProperties.properties[propertyKey];
  for (const id of consumerIds) {
    const consumingElement = editor!.findElementWithId(id);
    if (!consumingElement) {
      throw new Error(`Consuming element with id ${id} not found in grid`);
    }

    createActionForDependentElements(
      propertyKey,
      value,
      consumingElement,
      actions,
    );
  }

  return actions;
}

function updateProperty(propertyKey: string, value: any) {
  try {
    const actions = createActionForDependentElements(
      propertyKey,
      value,
      props.element,
      [],
    );
    editor?.executeAction(new GroupedUndoRedoAction(actions));
  } catch (e) {
    console.error(e);
  }
}

function eventSelected(event: EventConfig) {
  if (event.payloadType === "custom") {
    const compatibleElementInstances = editor?.instances.withEvent(event.name);
    editor!.highlightElements(compatibleElementInstances);
    editor!.switchMode(BuilderMode.ConnectEvent, { event: event.name });
  }

  dialog.value = false;
}

function eventRemoveListener(
  event: EventConfig,
  instanceId: ElementInstanceId,
) {
  editor.eventManager.unsubscribe(
    props.element.instanceId,
    event.name,
    instanceId,
  );
}

function propertySelected(propertyKey: string) {
  if (!editor) {
    // TODO log error
    return;
  }

  // TODO make current element visually disabled
  editor!.clearAllHighlightedElements();
  const compatibleElementInstances = editor.instances.withProperty(
    propertyKey,
    Direction.Consumed,
  );

  // Don't highlight the current selected element as it is prohibited to connect properties from an element
  // to itself as this would result in an infinite loop
  if (editor!.selectedElement) {
    compatibleElementInstances.splice(
      compatibleElementInstances.indexOf(editor!.selectedElement.value!),
      1,
    );
  }

  editor!.highlightElements(compatibleElementInstances);
  editor!.switchMode(BuilderMode.ConnectProperty, { property: propertyKey });

  dialog.value = false;
}
</script>
