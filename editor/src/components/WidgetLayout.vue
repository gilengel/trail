<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div id="editor-primary-toolbar"/>

  <v-row no-gutters>
    <v-col
        sm="9"
        no-gutters
    >
      <div ref="el">
        <LayoutRow
            v-for="(element, index) in grid.rows"
            data-key="itemId"
            data-value="Row"
            :key="element.id"
            :model="element"
            :grid="grid"
            :row-index="index"
            :selected-element-id="selectedElementId"
            :data-testid="`layout-row-${index}`"
            :active-mode="editor.activeMode"
        />
      </div>
      <v-row
          no-gutters
          style="margin-top: 24px; margin-right: 16px"
      >
        <v-spacer/>
        <v-btn
            @click="addRow()"
            color="primary rounded-sm"
            variant="outlined"
            prepend-icon="las la-plus"
        >
          Add Row
        </v-btn>
      </v-row>
    </v-col>
    <v-col
        ref="options_container"
        sm="3"
        class="options-container"
    >
      <component
          :is="selectedComponent"
          v-bind="selectedProps as ElementProps<object>"
          v-if="selectedComponent"
      />
    </v-col>
  </v-row>

  <v-snackbar-queue
      v-model="messages"
      color="warning"
  />
</template>

<script setup lang="ts" generic="T">
import {computed, type Ref, ref} from 'vue';
import {v4 as uuidv4} from 'uuid';
import type {SortableEvent} from 'sortablejs';
import {useSortable} from '@vueuse/integrations/useSortable';
import {BuilderMode, CreateElementKey, SelectElementKey, SwitchModeKey} from "./BuilderMode";
import type {Grid, Element, Column, EditorElementProperties} from "../types/grid";
import type {ElementTypeRegistry} from "../types/editor/editor.elements";
import {Editor, EditorInjectionKey} from "../types/editor/editor";
import type {ElementProps} from "../types/editor/property";
import {SetElement} from "../stores/actions/setElement";
import {MoveRow} from "../stores/actions/moveRow";
import {AddRow} from "../stores/actions/addRow";


// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<{
  grid: Grid,
  tripId: number,

  save: ISaveGridFn
}>();

const emit = defineEmits<{
  onElementChanged: [element: Element<object>];
}>();

// ---------------------------------------------------------------------------------------------------------------------

const editor = new Editor(props.grid, props.save);

// ---------------------------------------------------------------------------------------------------------------------

const messages: Ref<string[]> = ref([]);

provide(SwitchModeKey, (newMode: BuilderMode, meta: Record<string, unknown>) => {
  editor.switchMode(newMode, meta);
});

provide(EditorInjectionKey, editor);

provide(SelectElementKey, (element: Element<any, readonly string[]>) => {
  editor.handleSelectElement(element);
});

provide(CreateElementKey, (elementType: keyof ElementTypeRegistry, column: Column) => {
  const element: Element<any> = editor.elements.create(elementType) as Element<any>;
  editor.executeAction(new SetElement(column, element));
  emit('onElementChanged', element);
});

// ---------------------------------------------------------------------------------------------------------------------

watch(props.grid, async (newValue) => {
  newValue.tripId = props.tripId;
  await props.save(newValue);
});

// ---------------------------------------------------------------------------------------------------------------------

const el = ref<HTMLElement | null>(null);
useSortable(el, props.grid.rows, {
  handle: '.drag-handle',
  onUpdate
});

// ---------------------------------------------------------------------------------------------------------------------

const selectedComponent = computed(() => {
  if (!editor.selectedElement.value) {
    return undefined;
  }

  return editor.elements.get(editor.selectedElement.value.type).propertyElement;
});

const selectedElementId = computed(() => {
  if (!editor.selectedElement.value) {
    return undefined;
  }

  return editor.selectedElement.value.id;
});

const selectedProps = computed<EditorElementProperties<object> | undefined>(() => {
  if (!editor.selectedElement.value) {
    return undefined;
  }

  return {
    grid: props.grid,
    element: editor.selectedElement.value,
    selected: true,
    highlighted: editor.highlightHandler.isHighlighted(editor.selectedElement.value)
  };
});

// ---------------------------------------------------------------------------------------------------------------------

function addRow() {
  editor.executeAction(new AddRow({
    id: uuidv4(),
    columns: [{id: uuidv4(), width: 12}],
  }, props.grid))
}

/**
 * @param event
 */
function onUpdate(event: SortableEvent): void {
  editor.executeAction(new MoveRow(event.oldIndex!, event.newIndex!, props.grid));
}


</script>

<style scoped lang="scss">
$size: 24px;

line {

  stroke-width: 4px;
}

.linkage-triangle-preview {
  position: absolute;
  stroke-width: 6px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.q-btn-group {
  > button {
    border-radius: 50% !important;
    width: 42px;
    height: 42px;
  }
}

</style>
