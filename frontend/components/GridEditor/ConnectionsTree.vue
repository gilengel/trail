<template>
  <v-treeview
    v-model="model"
    :items="items"
    item-key="id"
    item-value="id"
    open-all
    expand-icon="las la-angle-down"
    collapse-icon="las la-angle-up"
  >
    <template #prepend="{ item, depth }">
      <v-icon v-if="depth" :icon="item.definition!.metadata!.icon!" />
    </template>
    <template #append="{ item, depth }">
      <v-icon-btn
        v-if="depth"
        :disabled="!depth"
        icon="las la-trash-alt"
        @click="emit('event:removeListener', item.event!, item.id)"
      />

      <v-icon-btn
        v-else
        icon="las la-plus-circle"
        @click="emit('event:selected', item.event!)"
      />
    </template>
  </v-treeview>
</template>

<script
  setup
  lang="ts"
  generic="ElementDefinition extends EditorElementDefinition"
>
// ---------------------------------------------------------------------------------------------------------------------
// This component shows connectable events in a tree and provides callbacks indicating that the user wants to add a
// connection or remove it.
// ---------------------------------------------------------------------------------------------------------------------

import type { EditorElementDefinition } from "@trail/grid-editor/definition/elementDefinition";
import { type Editor } from "@trail/grid-editor/editor";
import type {
  EditorElementInstance,
  ElementInstanceId,
} from "@trail/grid-editor/instances/instance";
import type { EventConfig } from "@trail/grid-editor/events/eventRegistry";

//-- PROPS -------------------------------------------------------------------------------------------------------------

interface Props {
  editor: Editor;
  element: EditorElementInstance;
}

const { editor, element } = defineProps<Props>();

//-- EMITS -------------------------------------------------------------------------------------------------------------

const emit = defineEmits<{
  "event:selected": [event: EventConfig];
  "event:removeListener": [event: EventConfig, instanceId: ElementInstanceId];
}>();

//-- COMPUTED-----------------------------------------------------------------------------------------------------------

const definition = computed(() => {
  return editor.definitions.get(element.elementId);
});
const providedEvents = computed(() => {
  return definition.value?.defaults.connections.provided.events;
});

type EventTreeItemType = {
  id: string;
  title: string;
  event?: EventConfig;
  definition?: EditorElementDefinition;
  children?: EventTreeItemType[];
};
const items: Ref<EventTreeItemType[]> = computed(() => {
  if (!providedEvents.value) {
    return [];
  }

  const events = providedEvents.value;

  const convertChildren = (eventId: string) => {
    const children = element.connections.provided.events.listeners[
      eventId
    ]!.map((child) => {
      const definition = editor.definitions.get(
        editor.instances.getInstance(child)!.elementId,
      )!;

      const c: EventTreeItemType = {
        id: child,
        title: definition.name!,
        definition,
        event: events[eventId],
      };

      return c;
    });

    if (children.length == 0) {
      return undefined;
    }

    return children;
  };

  return Object.keys(events).map((key) => {
    const name = events[key].name;
    const item: EventTreeItemType = {
      id: name,
      title: name,
      children: convertChildren(name),
      event: events[name],
    };

    return item;
  });
});

const model = ref([]);
</script>

<style scoped lang="scss"></style>
