<template>
  <v-btn-toggle v-model="size" @update:modelValue="onSizeChange">

    <v-btn>
      H1
    </v-btn>

    <v-btn>
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
      @update:modelValue="onColorChange"
  ></v-color-picker>
</template>

<script setup lang="ts">

const gridModuleStore = useGridModuleStore();


import type {HeadingProps} from "~/components/builder/properties/index";

const props = defineProps<HeadingProps>();

const size = ref(0);

const color = ref('white');

const correctSize = computed(() => {
  return size.value + 1
})

function onSizeChange(newValue: number) {
  gridModuleStore.updateElementAttribute(props.element, "level", newValue)
}

function onColorChange(newValue: string) {
  gridModuleStore.updateElementAttribute(props.element, "color", newValue)
}
</script>

<style scoped lang="scss">

</style>