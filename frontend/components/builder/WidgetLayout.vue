<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <v-row no-gutters>
    <v-col sm="9">
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
              :data-testid="`layout-row-${index}`"
              @select-element="(e) => onSelectedElementChanged(e)"
              @on-element-changed="(e) => $emit('onElementChanged', e)"
            />
          </transition>
        </template>
      </Sortable>

      <v-btn
        @click="
          gridModuleStore.addRow({
            id: uuid.v4(),
            columns: [{ width: 12, id: uuid.v4() }],
          }, props.grid)
        "
      >
        Add Row
      </v-btn>
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
import {type Ref, computed, ref} from 'vue';
import * as uuid from 'uuid';
import {Sortable} from 'sortablejs-vue3';
import type {SortableEvent} from 'sortablejs';

import {type Grid, Element, type Row} from '~/types/grid';
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
  if (!event.oldIndex || !event.newIndex) return;

  gridModuleStore.moveRow(event.oldIndex, event.newIndex, props.grid);
}

watch(props.grid, async (newValue) => {
  await useGridSave(newValue, props.tripId)
})

const selectedComponent = computed(() => {
  if (!selectedElement.value) {
    return undefined;
  }

  return componentsPropertiesMap[selectedElement.value.type];
});


const selectedProps = computed((): ElementProps<unknown> | undefined => {
  if (!selectedElement.value) {
    return undefined;
  }

  return {
    element: selectedElement.value
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
