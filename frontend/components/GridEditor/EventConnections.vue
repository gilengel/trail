<template>
  <v-card class="mx-auto">
    <v-img
      class="align-end text-white bg-primary"
      width="826"
      height="349"
      src="/images/backgrounds/connections.dark.svg"
      cover
    >
      <v-card-title>
        <v-toolbar color="transparent">
          <template #prepend>
            <v-icon>{{ definition?.metadata?.icon }}</v-icon>
          </template>
          <v-toolbar-title class="text-h6">
            {{ definition?.name }}
          </v-toolbar-title>
        </v-toolbar>
      </v-card-title>
    </v-img>

    <v-card-text>
      <v-list density="compact">
        <v-list-subheader>Properties</v-list-subheader>

        <v-list-item
          v-for="(item, i) in providedProperties"
          :key="i"
          :value="item"
          color="primary"
          @click="propertySelected(item)"
        >
          <v-list-item-title>
            {{ definition.propertySchema![item]!.label }}
            <v-tooltip
              activator="parent"
              location="top"
            >
              {{ definition.propertySchema![item]!.description }}
            </v-tooltip>
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list density="compact">
        <v-list-subheader>Events</v-list-subheader>

        <GridEditorConnectionsTree
          :editor="props.editor"
          :element="props.element"
          @event:selected="eventSelected"
          @event:remove-listener="
            (event, instanceId) =>
              emit('event:removeListener', event, instanceId)
          "
        />
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type {
  EditorElementInstance,
  ElementInstanceId,
} from "@trail/grid-editor/instances/instance";
import type { EventConfig } from "@trail/grid-editor/events/eventRegistry";
import type { Editor } from "@trail/grid-editor/editor";

//-- PROPS --------------------------------------------------------------------------------------------------------------

const props = defineProps<{
  editor: Editor;
  element: EditorElementInstance;
}>();

//-- EMITS -------------------------------------------------------------------------------------------------------------

const emit = defineEmits<{
  "event:selected": [event: EventConfig];
  "event:removeListener": [event: EventConfig, instanceId: ElementInstanceId];
  "property:selected": [propertyKey: string];
}>();

//-- COMPUTED ----------------------------------------------------------------------------------------------------------

const definition = computed(
  () => props.editor.definitions.get(props.element.elementId)!,
);

const providedProperties = computed(() => {
  return definition.value.defaults.connections.provided.properties;
});

//----------------------------------------------------------------------------------------------------------------------

function propertySelected(propertyKey: string) {
  emit("property:selected", propertyKey);
}

function eventSelected(event: EventConfig) {
  if (event.payloadType === "custom") {
    const instancesWithEvent = props.editor.instances.withEvent(event.name);
    props.editor.highlightElements(instancesWithEvent);
  }

  emit("event:selected", event);
}
</script>
