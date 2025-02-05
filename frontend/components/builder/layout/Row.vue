<template>
  <v-container>
    <v-row class="layout-row" no-gutters>
      <v-col cols="auto" class="actions">

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
            @click="gridModuleStore.deleteRow(rowIndex)"
        />
      </v-col>
      <v-col>
        <v-row class="fill-height" data-testid="layout-row" ref="container">

          <BuilderLayoutColumn
              dataKey="itemId"
              @selectElement="(element) => $emit('selectElement', element)"
              @onElementChanged="(element) => $emit('onElementChanged', element)"
              :data-testid="`grid-column-${col_index}-${rowIndex}`"
              :columnIndex="col_index"
              :rowIndex="rowIndex"
              :model="column"
              :class="colClass(col_index)"
              :splitDisabled="column.width <= 2"
              :editable="!isDraggingColumnSize"
              v-for="(column, col_index) in model.columns"
              :key="col_index"
          />

          <div
              data-testid="row-splitter"
              class="splitter"

              :style="splitterStyleFn(i)"
              v-for="(e, i) in model.columns.length - 1"
              :key="e"
              @mousedown="dragMouseDown($event, i)"
          ></div>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts" generic="T extends string, S extends string">
import {type Ref, ref} from 'vue';

import {type Row, Element} from '~/models/Grid';
import {columnValueValidator} from '~/composables/useColumValidator';

const gridModuleStore = useGridModuleStore();

const container: Ref<{ $el: HTMLElement } | null> = ref(null);

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

  model: {
    type: Object as () => Row,
    required: true,
  },
});

defineEmits<{
  selectElement: [element: Element];

  onElementChanged: [element: Element];
}>();

const flexColumns = 12;

const selectedSplitter: Ref<HTMLElement | undefined> = ref(undefined);
const selectedSplitterIndex: Ref<number> = ref(-1);

const isDraggingColumnSize: Ref<boolean> = ref(false);

const positions = {
  clientX: 0,
  clientY: 0,
  movementX: 0,
  movementY: 0,
};


function previousColSize(index: number): number {
  let result = 0;
  for (let i = 0; i < index; i++) {
    result += props.model.columns[i].width;
  }

  return result;
}

function colClass(i: number): string {
  const width = props.model.columns[i].width;
  return `col col-${width}`;
}

function splitterStyleFn(i: number): string {
  const left = (previousColSize(i + 1) / flexColumns) * 100;

  return `left: ${left}%; backgroundColor: var(--v-theme-primary)`;
}

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

function containerWidth(): number {
  const size = container.value!.$el.getBoundingClientRect();
  return size.width;
}

function updatePositions(event: MouseEvent) {
  positions.movementX = positions.clientX - event.clientX;
  positions.movementY = positions.clientY - event.clientY;
  positions.clientX = event.clientX;
  positions.clientY = event.clientY;
}

function affectedColumnSizes(): { [key: string]: number } {
  const left = props.model.columns[selectedSplitterIndex.value].width;
  const right = props.model.columns[selectedSplitterIndex.value + 1].width;
  return {
    left: left,
    right: right,
    complete: left + right,
  };
}

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

function elementDrag(event: MouseEvent) {
  event.preventDefault();


  updatePositions(event);

  const leftAbsolute = container.value!.$el.getBoundingClientRect().left + window.scrollX;
  const positionLeft = positions.clientX - leftAbsolute;


  if (!selectedSplitter.value) {
    return;
  }

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

  gridModuleStore.updateColumnsWidth(
      {column: leftColumn, width: newColumnSizes.left},
      {column: rightColumn, width: newColumnSizes.right},
  );


}

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


$border-width: 2px;
.actions {
  display: flex;
  flex-direction: column;
  width: auto;
  visibility: hidden;

  margin-left: -52px;

  border: solid $border-width rgb(var(--v-theme-primary));
  margin-top: -$border-width;
  margin-bottom: -$border-width;
}


.layout-row {
  border: solid $border-width rgb(var(--v-theme-primary));
}

.layout-row:hover {
  .actions {
    visibility: visible;
  }
}

.v-row {
  position: relative;
  box-sizing: border-box;
}

$row-margin: 10px;
$row-offset: $row-margin;
$splitter-handle-width: 16px;
.splitter {
  position: absolute;
  top: $row-offset + $border-width;
  width: $splitter-handle-width;
  height: 100%;

  cursor: ew-resize;
  transform: translateX(-50%);

}

$splitter-width: 2px;
.splitter::after {
  content: ' ';
  display: block;

  width: $splitter-width;
  height: 100%;

  margin-left: calc($splitter-handle-width / 2 - $splitter-width / 2);
  background: rgb(var(--v-theme-primary));
}
</style>
