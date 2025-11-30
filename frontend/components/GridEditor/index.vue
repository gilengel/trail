<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div id="editor-primary-toolbar">
    {{ editor.grid.rows.length }}
  </div>

  <v-row
      no-gutters
      class="grid-editor-container"
  >

    <v-col
        class="preview_container"
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
            data-testid="grid-editor-add-row-btn"
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
      <Properties
          v-bind="selectedProps!"
          v-if="selectedProps"
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
import type {ISaveGridFn} from "@trail/grid-editor/editorConfiguration";
import type {EditorElementInstance} from "@trail/grid-editor/instances/instance";
import {EditorInjectionKey} from "@trail/grid-editor/editor";
import type {EditorElementProperties, Grid} from "@trail/grid-editor/grid";
import {MoveRow} from "@trail/grid-editor/undoredo/actions/moveRow";
import {AddRow} from "@trail/grid-editor/undoredo/actions/addRow";
import Properties from "~/components/GridEditor/Properties.vue";

//-- PROPS -------------------------------------------------------------------------------------------------------------

const props = defineProps<{
  grid: Grid,
  tripId: number,

  save: ISaveGridFn,
}>();

//-- EMITS -------------------------------------------------------------------------------------------------------------

defineEmits<{
  onElementChanged: [element: EditorElementInstance];
}>();

//-- PROVIDES-----------------------------------------------------------------------------------------------------------
const {$createGridEditor} = useNuxtApp()

const editor = $createGridEditor(props.grid, props.save);

provide(EditorInjectionKey, editor);

// ---------------------------------------------------------------------------------------------------------------------

const messages: Ref<string[]> = ref([]);


// ---------------------------------------------------------------------------------------------------------------------

watch(props.grid, async (newValue) => {
  for (const row of props.grid.rows) {
    for (const column of row.columns) {
      if (!column.element) continue;

      editor.instances.insertExistingInstance(column.element);
    }
  }

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

const selectedElementId = computed(() => {
  if (!editor.selectedElement.value) {
    return undefined;
  }

  return editor.selectedElement.value.instanceId;
});

const selectedProps = computed<EditorElementProperties<any> | undefined>(() => {
  if (!editor.selectedElement.value) {
    return undefined;
  }

  return {
    grid: editor.grid,
    element: editor.selectedElement.value,
    definition: editor.definitions.get(editor.selectedElement.value.elementId),

    selected: true,
    highlighted: editor.isHighlighted(editor.selectedElement.value),

    changeable: true,
  } as EditorElementProperties<any>;
});

// ---------------------------------------------------------------------------------------------------------------------

function addRow() {
  editor.executeAction(new AddRow({
    id: uuidv4(),
    columns: [{id: uuidv4(), width: 12}],
  }, props.grid));
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

.grid-editor-container {
  background-color: color-mix(in srgb, rgb(var(--v-theme-background)) 98%, black);

  .v-theme--dark & {
    background-color: color-mix(in srgb, rgb(var(--v-theme-background)) 98%, white);
  }
}

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
