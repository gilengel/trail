<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div id="editor-primary-toolbar"></div>
  <v-row no-gutters>
    <v-col
        sm="9"
        no-gutters
    >
      <Sortable
          :options="{ animated: 150}"
          :list="grid.rows"
          :item-key="(e: Row) => e.id"
          handle=".drag-handle"
          class="dragArea list-group"
          @update="onUpdate($event)"
      >
        <template #item="{ element, index }">
          <transition
              appear
              name="list"
          >
            <BuilderLayoutRow
                data-key="itemId"
                data-value="Row"
                :key="index"
                :model="element"
                :grid="grid"
                :row-index="index"
                :selectedElementId="selectedElementId"
                :data-testid="`layout-row-${index}`"
                @select-element="(e) => onSelectedElementChanged(e)"
                @on-element-changed="(e) => $emit('onElementChanged', e)"
            />
          </transition>
        </template>
      </Sortable>

      <v-row
          no-gutters
          style="margin-top: 24px; margin-right: 16px"
      >
        <v-spacer/>
        <v-btn
            @click="addRow()"

            color="primary"
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
          v-bind="selectedProps"
          v-if="selectedComponent"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts" generic="T extends string, S extends string">
import {computed, type Ref, ref} from 'vue';
import {v4 as uuidv4} from 'uuid';
import {Sortable} from 'sortablejs-vue3';
import type {SortableEvent} from 'sortablejs';

import {Element, type Grid, type Row} from '~/types/grid';
import {componentsPropertiesMap} from "~/components/builder/AllElements";
import type {ElementProps} from "~/components/builder/properties";

const props = defineProps<{
  grid: Grid,
  tripId: number,
}>();

defineEmits<{
  onElementChanged: [element: Element<unknown>];
}>();

const selectedElement: Ref<Element<unknown> | undefined> = ref(undefined);

const gridModuleStore = useGridStore();

function addRow() {
  gridModuleStore.addRow({
    id: uuidv4(),
    columns: [{id: uuidv4(), width: 12}],
  }, props.grid)
}

/**
 * @param element
 */
function onSelectedElementChanged(element: Element<unknown>) {
  selectedElement.value = element;
}

/**
 * @param event
 */
function onUpdate(event: SortableEvent): void {
  if (!event.oldIndex) {
    return;
  }

  if (!event.newIndex) {
    return;
  }

  gridModuleStore.moveRow(event.oldIndex, event.newIndex, props.grid);
}

watch(props.grid, async (newValue) => {
  newValue.tripId = props.tripId;
  await useGridSave(newValue)
})

const selectedComponent = computed(() => {
  if (!selectedElement.value) {
    return undefined;
  }

  return componentsPropertiesMap[selectedElement.value.type];
});

const selectedElementId = computed(() => {
  if (!selectedElement.value) {
    return undefined;
  }

  return selectedElement.value.id;
});

const selectedProps = computed((): ElementProps<unknown> | undefined => {
  if (!selectedElement.value) {
    return undefined;
  }

  return {
    element: selectedElement.value,
    selected: false
  };
});
</script>

<style scoped lang="scss">
$size: 24px;
.ghost {
  border-radius: 4px;

  //color: $primary;
}

line {
  //stroke: $accent;
  stroke-width: 4px;
}

.linkage-triangle-preview {
  position: absolute;
  //fill: $accent;
  //stroke: $accent;
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
