<template>
  <v-container fluid>
    <v-row
      no-gutters
      align="center"
      class="border layout-row"
      :class="isDraggingColumnSize ? 'dragging' : ''"
      @mouseenter="isHovering=true"
      @mouseleave="isHovering=false"
    >
      <v-col
        v-if="props.activeMode === BuilderMode.Create"
        cols="auto"
        class="actions rounded-sm"
      >
        <v-btn
          :ripple="false"
          rounded="0"
          class="drag-handle"
          icon="las la-arrows-alt"
        />
        <v-btn
          flat
          :ripple="false"
          rounded="0"
          data-testid="delete-row-button"
          icon="las la-trash-alt"
          @click="editor.executeAction(new DeleteRow(model, props.grid))"
        />
      </v-col>
      <v-col style="align-self: stretch">
        <v-row
          no-gutters
          ref="container"
          class="fill-height"
          data-testid="layout-row"
        >
          <GridEditorColumn
            data-key="itemId"
            :data-testid="`grid-column-${col_index}-${rowIndex}`"
            :column-index="col_index"
            :row="model"
            :model="column"
            :active-mode
            :grid
            :class="colClass(col_index)"
            :split-disabled="column.width <= 2"
            :editable="!isDraggingColumnSize"
            :selected-element-id="props.selectedElementId"
            v-for="(column, col_index) in model.columns"
            :key="col_index"
          />

          <div
            v-for="(e, i) in model.columns.length - 1"
            :key="e"
            data-testid="row-splitter"
            class="splitter"
            :class="isDraggingColumnSize ? 'dragging-slider' : 'non-dragging-slider'"
            :style="splitterStyleFn(i)"
            @mousedown="dragMouseDown($event, i)"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {inject, type PropType, type Ref, ref} from 'vue';
import {columnValueValidator} from "~/composables/useColumValidator";
import type {Grid, Row} from "@trail/grid-editor/grid";
import {BuilderMode, EditorInjectionKey} from "@trail/grid-editor/editor";
import {DeleteRow} from "@trail/grid-editor/undoredo/actions/deleteRow";
import {UpdateColumnWidth} from "@trail/grid-editor/undoredo/actions/updateColumnWidth";
import {GroupedUndoRedoAction} from "@trail/grid-editor/undoredo";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps({
  minColSize: {
    type: Number,
    default: 2,
    required: false,
    validator: columnValueValidator,
  },

  maxColSize: {
    type: Number,
    default: 11,
    required: false,
    validator: columnValueValidator,
  },

  rowIndex: {
    type: Number,
    required: true,
    validator: (x: number) => x >= 0,
  },

  grid: {
    type: Object as PropType<Grid>,
    required: true,
  },

  model: {
    type: Object as PropType<Row>,
    required: true,
  },

  selectedElementId: {
    type: String,
    default: undefined,
    required: false
  },

  activeMode: {
    type: Number as PropType<BuilderMode>,
    required: true,
  }
});

// ---------------------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey);
if (!editor) {
  throw new Error("Editor instance was not injected in Row");
}

// ---------------------------------------------------------------------------------------------------------------------

const container: Ref<{ $el: HTMLElement } | null> = ref(null);

const isHovering = ref(false);

const selectedSplitter: Ref<HTMLElement | undefined> = ref(undefined);
const selectedSplitterIndex: Ref<number> = ref(-1);

const isDraggingColumnSize: Ref<boolean> = ref(false);

// ---------------------------------------------------------------------------------------------------------------------

const flexColumns = 12;

const positions = {
  clientX: 0,
  clientY: 0,
  movementX: 0,
  movementY: 0,
};

// ---------------------------------------------------------------------------------------------------------------------

/**
 * @param index
 */
function previousColSize(index: number): number {
  let result = 0;
  for (let i = 0; i < index; i++) {
    result += props.model.columns[i].width;
  }

  return result;
}

/**
 * @param i
 */
function colClass(i: number): string {
  const width = props.model.columns[i].width;
  return `col col-${width}`;
}

/**
 * @param i
 */
function splitterStyleFn(i: number): string {
  const left = (previousColSize(i + 1) / flexColumns) * 100;

  return `left: ${left}%`;
}

/**
 * @param event
 * @param index
 */
function dragMouseDown(event: MouseEvent, index: number) {
  event.preventDefault();

  // get the mouse cursor position at startup
  positions.clientX = event.clientX;
  positions.clientY = event.clientY;

  // register handler on document level to capture mouse events that
  // do not occur on the vue element
  document.onmousemove = elementDrag;
  document.onmouseup = closeDragElement;

  selectedSplitter.value = event.target as HTMLElement;
  selectedSplitterIndex.value = index;

  isDraggingColumnSize.value = true;
}

/**
 *
 */
function containerWidth(): number {
  const size = container.value!.$el.getBoundingClientRect();
  return size.width;
}

/**
 * @param event
 */
function updatePositions(event: MouseEvent) {
  positions.movementX = positions.clientX - event.clientX;
  positions.movementY = positions.clientY - event.clientY;
  positions.clientX = event.clientX;
  positions.clientY = event.clientY;
}

/**
 *
 */
function affectedColumnSizes(): { [key: string]: number } {
  const left = props.model.columns[selectedSplitterIndex.value].width;
  const right = props.model.columns[selectedSplitterIndex.value + 1].width;
  return {
    left: left,
    right: right,
    complete: left + right,
  };
}

/**
 * @param newColumnSize
 */
function restrictNewColumnSizes(newColumnSize: number): {
  [key: string]: number;
} {
  const completeColumnSize = affectedColumnSizes().complete;


  if (newColumnSize < props.minColSize) {
    newColumnSize = props.minColSize;
  }

  if (newColumnSize > completeColumnSize - 1) {
    newColumnSize = completeColumnSize - 1;
  }

  if (newColumnSize > props.maxColSize) {
    newColumnSize = props.maxColSize;
  }

  let rightColumnSize = completeColumnSize - newColumnSize;
  if (rightColumnSize < props.minColSize) {
    const difference = props.minColSize - rightColumnSize;
    rightColumnSize = props.minColSize;
    newColumnSize -= difference;
  }

  if (rightColumnSize > props.maxColSize) {
    const difference = props.maxColSize - rightColumnSize;
    rightColumnSize = props.maxColSize;
    newColumnSize -= difference;
  }

  return {
    left: newColumnSize,
    right: rightColumnSize,
  };
}

/**
 * @param event
 */
function elementDrag(event: MouseEvent) {
  event.preventDefault();


  updatePositions(event);

  const leftAbsolute = container.value!.$el.getBoundingClientRect().left + window.scrollX;
  const positionLeft = positions.clientX - leftAbsolute;


  const previousColSizes = previousColSize(selectedSplitterIndex.value);
  const flexSize =
      Math.ceil((positionLeft / containerWidth()) * flexColumns) -
      previousColSizes;

  const newColumnSizes = restrictNewColumnSizes(flexSize);

  const leftColumn = props.model.columns[selectedSplitterIndex.value];
  if (leftColumn.width === newColumnSizes.left) {
    return;
  }

  const rightColumn = props.model.columns[selectedSplitterIndex.value + 1];

  editor?.executeAction(new GroupedUndoRedoAction([
    new UpdateColumnWidth(leftColumn, newColumnSizes.left),
    new UpdateColumnWidth(rightColumn, newColumnSizes.right),
  ]));
}

/**
 *
 */
function closeDragElement() {

  document.onmouseup = null;
  document.onmousemove = null;

  const previousColSizes =
      previousColSize(selectedSplitterIndex.value + 1) / flexColumns;

  selectedSplitter.value!.style.left = `${previousColSizes * containerWidth()}px`;

  isDraggingColumnSize.value = false;

}
</script>

<style lang="scss" scoped>

$primary-color: rgb(var(--v-theme-primary));

$border-width: 1px;
$focus-border: solid $border-width $primary-color;

$actions-width: 52px;
.actions {
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  width: auto;
  visibility: hidden;
  overflow: hidden;

  z-index: 999;

  margin-left: -$actions-width + $border-width * 2;

  border: solid $border-width $primary-color;
  margin-top: -$border-width;
  margin-bottom: -$border-width;

  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;

  transition: all ease-in-out 0.3s;
}

.dragging {
  border: $focus-border !important;
}

.non-dragging-slider {
  background: rgba(var(--v-border-color), var(--v-border-opacity));
}

.dragging-slider {
  background: $primary-color;
}

.layout-row {
  border-width: $border-width !important;
  margin-left: $actions-width;

  transition: all 0.5s ease;
}

.layout-row:hover {
  .actions {
    visibility: visible;
  }

  border: $focus-border !important;
}

.v-row {
  position: relative;
  box-sizing: border-box;

  overflow: hidden;
  transition: all ease-in-out 0.3s;
}

.v-row:hover {
  overflow: visible;
}

$row-margin: 10px;
$row-offset: $row-margin;
$splitter-handle-width: 2px;
$splitter-width: 1px;
.splitter {
  position: absolute;
  width: $splitter-handle-width;

  cursor: ew-resize;
  transform: translateX(-50%);
  height: 100%;

  &::before, &::after {
    position: absolute;
    content: ' ';
    display: block;

    height: 100%;
    margin-left: calc($splitter-handle-width / 2 - $splitter-width / 2);
  }


  &::before {
    width: 8px;
    left: -8px;
  }

  &::after {
    width: 8px;
    left: $splitter-width;
  }
}

.splitter:hover {
  background: rgb(var(--v-theme-primary));
}

.fill-height {
  position: relative;
}

</style>
