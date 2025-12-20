<template>
  <GridEditorPropertyConnections
      :grid="props.grid"
      :id="props.element.instanceId"
      :element="props.element"
  >
    <template #title/>


    <template #properties>
      <v-btn
          @click="dialog = true"
          color="surface-variant"
          text="Open Dialog"
          variant="flat"
      />

      <v-dialog max-width="500" v-model="dialog">

        <EventConnections
            :element="props.element"
            :editor
            @event:selected="eventSelected"
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
            v-for="(configuration, propertyKey) in props.definition.propertySchema"
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
                @update:model-value="updateProperty(propertyKey as string, $event)"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </GridEditorPropertyConnections>
</template>

<script setup lang="ts">
import {inject} from "vue";
import {BuilderMode, EditorInjectionKey} from "@trail/grid-editor/editor";
import type {EditorElementProperties} from "@trail/grid-editor/grid";
import {UpdateElementAttribute} from "@trail/grid-editor/undoredo/actions/updateElementAttribute";
import type {PropertyConfig} from "@trail/grid-editor/properties/elementProperty";
import type {EditorElementInstance} from "@trail/grid-editor/instances/instance";
import {GroupedUndoRedoAction, type IUndoRedoAction} from "@trail/grid-editor/undoredo";
import EventConnections from "~/components/GridEditor/EventConnections.vue";
import type {EventConfig} from "@trail/grid-editor/events/eventRegistry";

//-- PROPS -------------------------------------------------------------------------------------------------------------

const props = defineProps<EditorElementProperties<any>>();

// ---------------------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey);

//-- COMPUTED ----------------------------------------------------------------------------------------------------------

const model = computed(() => Object.keys(props.definition.propertySchema as object));

//-- REFS --------------------------------------------------------------------------------------------------------------

const dialog = ref(false)

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
function createActionForDependentElements(propertyKey: string, value: any, element: EditorElementInstance<any>, actions: IUndoRedoAction[]) {
  actions.push(new UpdateElementAttribute<any>(element, propertyKey, value));

  const consumedProperties = element.connections.consumed;
  if (!consumedProperties[propertyKey]) {
    return actions;
  }

  const consumerId = consumedProperties[propertyKey];
  const consumingElement = editor!.findElementWithId(consumerId);
  if (!consumingElement) {
    throw new Error(`Consuming element with id ${consumerId} not found in grid`);
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

function eventSelected(event: EventConfig<string[]>) {
  if (event.payloadType === 'properties') {

  }

  if (event.payloadType === 'partial-properties') {

    event.properties; // keyof T[]
  }

  if (event.payloadType === 'custom') {

    const compatibleElementInstances = editor?.instances.withEvent(event.name)!;
    editor!.highlightElements(compatibleElementInstances);
    editor!.switchMode(BuilderMode.ConnectEvent, {event: event.name})
  }

  dialog.value = false;
}
</script>


