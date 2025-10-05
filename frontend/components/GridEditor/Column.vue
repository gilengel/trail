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
                v-for="(definition, index) in definitions.getAll()"
                :key="definition.id"
                data-testid="column-element"
                :value="index"
                @click="() => createElement(definition, props.model)"
            >
              <v-list-item-title>{{ definition.name }}</v-list-item-title>
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
          @click="editor.executeAction(new DeleteColumn(row, columnIndex))"
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
          @click="() => editor.selectElement(model.element!)"
      />
    </div>
  </v-col>
</template>

<script setup lang="ts">

import {computed, inject, type PropType, ref} from 'vue';
import {columnValueValidator} from "~/composables/useColumValidator";
import {BuilderMode, EditorInjectionKey} from "@trail/grid-editor/editor";
import type {EditorElementDefinition} from "@trail/grid-editor/configuration/elementDefinition";
import type {Column, EditorElementProperties, Grid, Row} from "@trail/grid-editor/grid";
import {SetElement} from "@trail/grid-editor/undoredo/actions/setElement";
import {DeleteColumn} from "@trail/grid-editor/undoredo/actions/deleteColumn";
import {SplitColumn} from "@trail/grid-editor/undoredo/actions/splitColumn";

const {definitions, instances, registry} = useElementRegistry();

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

const selectedComponent = computed(() => {
  if (!props.model.element) {
    return undefined;
  }

  return registry.getComponent(props.model.element.elementId);
});

const selectedComponentProps = computed<EditorElementProperties<any> | undefined>(() => {
  if (!props.model.element) {
    return undefined;
  }

  return {
    grid: props.grid,
    element: props.model.element,
    definition: registry.definitions.get(props.model.element.elementId),
    selected: props.model.element.instanceId === props.selectedElementId,
  } as EditorElementProperties<any>;
});

// ---------------------------------------------------------------------------------------------------------------------

function createElement(definition: EditorElementDefinition<any>, column: Column) {
  editor!.executeAction<any>(new SetElement(column, instances.create(definition)!));
}
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
