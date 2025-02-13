<template>
  <h1>Heading Properties</h1>
  <v-btn-toggle
    v-model="size"
    @update:model-value="onSizeChange"
  >
    <v-btn>
      H1
    </v-btn>

    <v-btn datatest-id="button-h2">
      H2
    </v-btn>

    <v-btn>
      H3
    </v-btn>

    <v-btn>
      H4
    </v-btn>
  </v-btn-toggle>

  <v-color-picker
    v-model="color"
    hide-inputs
    show-swatches
    @update:model-value="onColorChange"
  />
</template>

<script setup lang="ts">

const props = defineProps<ElementProps>();


const gridModuleStore = useGridStore();


import type {ElementProps} from "~/components/builder/properties/index";

const size = ref(0);

const color = ref('ffffff');

/**
 * @param newValue
 */
function onSizeChange(newValue: number) {
  gridModuleStore.updateElementAttribute(props.element, "level", newValue)
}

/**
 * @param newValue
 */
function onColorChange(newValue: string) {
  gridModuleStore.updateElementAttribute(props.element, "color", newValue)
}
</script>

<style scoped lang="scss">

</style>