<template>
  <v-col
      class="layout-col"
      :cols="model.width"
  >
    <div
        v-if="props.activeMode === BuilderMode.Create && editable"
        class="actions rounded-sm"
    >
      <v-btn
          rounded="0"
          flat
          icon
          data-testid="action-menu-btn"
      >
        <v-icon>las la-plus</v-icon>
        <v-menu
            activator="parent"
            data-testid="action-menu"
        >
          <v-list>
            <v-list-item
                v-for="(element, index) in editor.elements.all()"
                :key="element"
                data-testid="column-element"
                :value="index"
                @click="() => createElement(element, props.model)"
            >
              <v-list-item-title>{{ element }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <v-btn
          :disable="splitDisabled"
          flat
          rounded="0"
          icon="las la-columns"
          @click="editor.executeAction(new SplitColumn(row, columnIndex, props.grid))"
      />
      <v-btn
          flat
          rounded="0"
          icon="las la-trash-alt"
          :readonly="model.width === 12"
          @click="editor.executeAction(new DeleteColumn(row, columnIndex, props.grid))"
      />
    </div>

    <div
        ref="dropContainer"
        class="element-container"
        :data-testid="`layout-column-element-container-${columnIndex}-${0}`"
    >
      <component
          :is="selectedComponent"
          v-bind="selectedComponentProps!"
          v-if="selectedComponent"
          @click="() => selectElement(model.element!)"
      />
    </div>
  </v-col>
</template>

<script setup lang="ts">

import {computed, inject, type PropType, ref} from 'vue';
import type {Column, EditorElementProperties, Grid, Row} from "../../types/grid";
import {BuilderMode, CreateElementKey, SelectElementKey} from "../BuilderMode";
import {EditorInjectionKey} from "../../types/editor/editor";
import {SplitColumn} from "../../stores/actions";
import {DeleteColumn} from "../../stores/actions";
import {columnValueValidator} from '../../composables/useColumValidator';

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps({
  /**
   * The index of the row which is the parent of the column.
   */
  row: {
    type: Object as PropType<Row>,
    required: true,
  },

  /**
   * The index of the column within its parent row.
   */
  columnIndex: {
    type: Number,
    default: 2,
    required: true,
    validator: columnValueValidator,
  },

  /**
   * The model that contains the associated data with the column.
   */
  model: {
    type: Object as PropType<Column>,
    required: true,
  },

  grid: {
    type: Object as PropType<Grid>,
    required: true,
  },

  /**
   * Enables/Disables editability of the column. If disabled, the toolbar on top is not shown
   * to the user.
   */
  editable: {
    type: Boolean,
    required: false,
    default: true,
  },

  /**
   * Controls if the column can be split into two or not. This is necessary to
   * enable/disable the corresponding button in the toolbar.
   */
  splitDisabled: Boolean,

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

const selectElement = inject(SelectElementKey);
if (!selectElement) {
  throw new Error("Column component is missing the 'selectElement' injected function.");
}

const createElement = inject(CreateElementKey);
if (!createElement) {
  throw new Error("Column component is missing the 'createElement' injected function.");
}
// ---------------------------------------------------------------------------------------------------------------------

const dropContainer = ref(null);

/*
useDrop(dropContainer, (e: DragAndDropDto) => {
  gridModuleStore.setColumnElement(props.model, e.elementType);
  emit('selectElement', props.model.element as Element);
});
*/

// Workaround as Sortable.SortableEvent type does not correctly contain the original event
// which is necessary to get the transferred data (as defined by setData)
/*
type AddEvent = Sortable.SortableEvent & {
  originalEvent: DragEvent;
  add: Sortable.SortableEvent;
};
*/

// ---------------------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey);
if (!editor) {
  throw new Error("Editor instance was not injected in Row");
}

// ---------------------------------------------------------------------------------------------------------------------

const isHighlighted = computed(() => {
  if (!props.model.element) {
    return false;
  }

  return editor.highlightHandler.isHighlighted(props.model.element);
});

const selectedComponent = computed(() => {
  if (!props.model.element) {
    return undefined;
  }

  return editor.elements.get(props.model.element.type);
});

const selectedComponentProps = computed<EditorElementProperties<object> | undefined>(() => {
  if (!props.model.element) {
    return undefined;
  }

  return {
    grid: props.grid,
    element: props.model.element,
    selected: props.model.element.id === props.selectedElementId,
    highlighted: isHighlighted.value,
  };
});

// ---------------------------------------------------------------------------------------------------------------------

</script>

<style lang="scss" scoped>
$actions-size: 52px;
$border-width: 1px;

$primary-color: rgb(var(--v-theme-primary));
$focus-border: solid $border-width $primary-color;

.layout-col {
  position: relative;

  .actions {
    visibility: collapse;
    overflow: hidden;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;

    display: flex;
    flex-direction: row;
    width: auto;

    border: solid $border-width $primary-color;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    margin-top: -$actions-size + $border-width * 2;
    margin-bottom: -$border-width;
  }
}

.layout-col:hover {
  .actions {
    visibility: visible;
  }
}

.v-toolbar--collapse {
  max-width: 52px * 3;
}

.element-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
