<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div id="editor-primary-toolbar"/>

  <v-row no-gutters>
    <v-col
        sm="9"
        no-gutters
    >
      <div ref="el">
        <GridEditorRow
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
          :is="selectedElementPropertiesComponent"
          v-bind="selectedProps as ElementProps<object>"
          v-if="selectedElementPropertiesComponent"
      />
    </v-col>
  </v-row>

  <v-snackbar-queue
      v-model="messages"
      color="warning"
  />
</template>

<script setup lang="ts" generic="T">
import {computed, type Ref, ref, provide, watch} from 'vue';
import {v4 as uuidv4} from 'uuid';
import type {SortableEvent} from 'sortablejs';
import {useSortable} from '@vueuse/integrations/useSortable';
import type {Grid, Element, EditorElementProperties} from "./grid";
import {Editor, EditorInjectionKey} from "./editor";
import type {ElementProps} from "~/components/builder/properties";
import {useGridSave} from "~/composables/useGridSave";
import type {ISaveGridFn} from "~/components/GridEditor/editorConfiguration";
import {MoveRow} from "~/stores/editor/actions/moveRow";
import {AddRow} from "~/stores/editor/actions/addRow";
// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<{
  grid: Grid,
  tripId: number,

  save: ISaveGridFn,
}>();

const emit = defineEmits<{
  onElementChanged: [element: Element<object>];
}>();

// ---------------------------------------------------------------------------------------------------------------------

const { registry } = useElementRegistry()

const editor = new Editor(props.grid, useGridSave)

// ---------------------------------------------------------------------------------------------------------------------

const messages: Ref<string[]> = ref([]);

provide(EditorInjectionKey, editor);

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

const selectedElementPropertiesComponent = computed(() => {
  if (!editor.selectedElement.value) {
    return undefined;
  }

  return registry.getPropertyComponent(editor.selectedElement.value.type);
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
