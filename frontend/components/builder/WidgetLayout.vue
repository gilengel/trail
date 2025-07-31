<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div id="editor-primary-toolbar"/>

  <v-row no-gutters>
    <v-col sm="9" no-gutters>
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
            :active-mode
        />
      </div>
      <v-row no-gutters style="margin-top: 24px; margin-right: 16px">
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
    <v-col ref="options_container" sm="3" class="options-container">
      <component
          :is="selectedComponent"
          v-bind="selectedProps as ElementProps<object>"
          v-if="selectedComponent"
      />
    </v-col>
  </v-row>
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

const selectedElement: Ref<Element<object> | undefined> = ref(undefined);

// ---------------------------------------------------------------------------------------------------------------------

const activeMode: Ref<BuilderMode> = ref(BuilderMode.Create);

provide(SwitchModeKey, (newMode: BuilderMode) => {
  activeMode.value = newMode;
})

function handleSelectElement<
    Props extends object,
    Provided extends readonly (keyof Props)[],
    Consumed extends readonly (keyof Props)[]
>(
    element: Element<Props, Provided, Consumed>
): void {
  if (activeMode.value === BuilderMode.Connect && selectedElement.value) {
    const sel = selectedElement.value as unknown as Element<Props, Provided, Consumed>;

    const key1 = sel.providedProperties[0];
    if (key1) {
      sel.connectedProvidedProperties[key1] = element.id;
      element.connectedConsumedProperties[key1] = element.id;
    }

    const key2 = sel.providedProperties[1];
    if (key2) {
      sel.connectedProvidedProperties[key2] = element.id;
      element.connectedConsumedProperties[key2] = element.id;
    }

    activeMode.value = BuilderMode.Create;
  }

  selectedElement.value = element as unknown as Element<object>;
}

provide(SelectElementKey, (element: Element<any, readonly string[]>) => {
  handleSelectElement(element);
})

provide(CreateElementKey, (elementType: ElementType, column: Column) => {
  const element: Element<any> = createElement(elementType) as Element<any>;
  gridModuleStore.setColumnElement(column, element);
  emit('onElementChanged', element)
})

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

const selectedProps = computed<EditorElementProperties<object> | undefined>(() => {
  if (!selectedElement.value) {
    return undefined;
  }

  return {
    grid: props.grid,
    element: selectedElement.value,
    selected: true,
    highlighted: gridModuleStore.isHighlighted(selectedElement.value)
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
