<template>
  <v-card class="mx-auto">
    <v-toolbar color="transparent">
      <template #prepend>
        <v-icon>{{ definition?.metadata?.icon }}</v-icon>
      </template>

      <v-toolbar-title class="text-h6">
        {{ definition?.name }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>

      <v-list density="compact">
        <v-list-subheader>Properties</v-list-subheader>

        <v-list-item
            v-for="(item, i) in providedProperties"
            :key="i"
            :value="item"
            color="primary"
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

        <v-list-item
            v-for="(event, i) in providedEvents"
            :key="i"
            :value="event"
            color="primary"

            @click="eventSelected(event)"
        >
          <v-list-item-title>
            {{ event.label }}
            <v-tooltip
                activator="parent"
                location="top"
            >
              {{ event.description }}
            </v-tooltip>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type {EditorElementInstance} from "@trail/grid-editor/instances/instance";
import type {EventConfig} from "@trail/grid-editor/events/eventRegistry";
import type {Editor} from "@trail/grid-editor/editor";

//-- PROPS --------------------------------------------------------------------------------------------------------------

const props = defineProps<{
  editor: Editor,
  element: EditorElementInstance,
}>();

//-- EMITS -------------------------------------------------------------------------------------------------------------

const emit = defineEmits<(e: "event:selected", event: EventConfig<string[]>) => void>();

//-- COMPUTED ----------------------------------------------------------------------------------------------------------

const definition = computed(() => props.editor.definitions.get(props.element.elementId)!);

const providedProperties = computed(() => {
  return definition.value.defaults.connections.provided.properties;
});

const providedEvents = computed(() => {
  return definition.value.defaults.connections.provided.events;
});

//----------------------------------------------------------------------------------------------------------------------

function eventSelected(event: EventConfig<string[]>) {
  if (event.payloadType === 'properties') {

  }

  if (event.payloadType === 'partial-properties') {

    event.properties; // keyof T[]
  }

  if (event.payloadType === 'custom') {
    const instancesWithEvent = props.editor.instances.withEvent(event.name);
    props.editor.highlightElements(instancesWithEvent);
  }

  emit("event:selected", event);
}

/*
function propertySelected(propertyKey: string, direction: PropertyDirection) {
  const inverseDirection = direction === PropertyDirection.Consumed ? PropertyDirection.Provided : PropertyDirection.Consumed;
  const filtered = findAllElementsWithProperties([propertyKey], props.grid, inverseDirection);

  editor!.clearAllHighlightedElements();
  editor!.highlightElements(filtered);

  editor!.switchMode(BuilderMode.ConnectProperty, {property: propertyKey});
}
 */
</script>