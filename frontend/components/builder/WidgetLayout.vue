<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div id="editor-primary-toolbar"/>

  <v-row no-gutters>
    <v-col
        sm="9"
        no-gutters
    >
      <div ref="el">
        <BuilderLayoutRow
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

  <v-snackbar-queue v-model="messages" color="warning"></v-snackbar-queue>
</template>

<script setup lang="ts">
import {computed, type Ref, ref} from 'vue';
import {v4 as uuidv4} from 'uuid';
import type {SortableEvent} from 'sortablejs';
import {useSortable} from '@vueuse/integrations/useSortable';
import {type Column, type EditorElementProperties, Element, ElementType, type Grid} from '~/types/grid';
import {componentsPropertiesMap, createElement} from "~/components/builder/AllElements";
import type {ElementProps} from "~/components/builder/properties";
import {BuilderMode, CreateElementKey, SelectElementKey, SwitchModeKey} from "~/components/builder/BuilderMode";
import {Editor} from "~/types/editor/editor";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<{
  grid: Grid,
  tripId: number,
}>();

const emit = defineEmits<{
  onElementChanged: [element: Element<object>];
}>();

// ---------------------------------------------------------------------------------------------------------------------

const gridModuleStore = useGridStore();

// ---------------------------------------------------------------------------------------------------------------------

const editor = new Editor(gridModuleStore, props.grid);

// ---------------------------------------------------------------------------------------------------------------------

const text = ref('')
const messages: Ref<string[]> = ref([])

provide(SwitchModeKey, (newMode: BuilderMode, meta: Record<string, unknown>) => {
  editor.switchMode(newMode, meta);
});

provide('editor', editor)

provide(SelectElementKey, (element: Element<any, readonly string[]>) => {
  editor.handleSelectElement(element);
});

provide(CreateElementKey, (elementType: ElementType, column: Column) => {
  const element: Element<any> = createElement(elementType) as Element<any>;
  gridModuleStore.setColumnElement(column, element);
  emit('onElementChanged', element);
});

// ---------------------------------------------------------------------------------------------------------------------

watch(props.grid, async (newValue) => {
  newValue.tripId = props.tripId;
  await useGridSave(newValue);
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

  return componentsPropertiesMap[editor.selectedElement.value.type];
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
    highlighted: gridModuleStore.isHighlighted(editor.selectedElement.value)
  };
});

// ---------------------------------------------------------------------------------------------------------------------

function addRow() {
  gridModuleStore.addRow({
    id: uuidv4(),
    columns: [{id: uuidv4(), width: 12}],
  }, props.grid);
}

/**
 * @param event
 */
function onUpdate(event: SortableEvent): void {
  gridModuleStore.moveRow(event.oldIndex!, event.newIndex!, props.grid);
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
