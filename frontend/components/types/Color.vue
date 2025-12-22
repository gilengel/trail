<template>
  <v-color-picker
      v-model="value"
      hide-inputs
      show-swatches
      hide-canvas
      hide-sliders
      elevation="0"
  />
</template>

<script setup lang="ts">

import type {CustomPropertyConfig} from "@trail/grid-editor/properties/elementProperty";

const props = defineProps<{
  config: CustomPropertyConfig
  propertyKey: string
  modelValue: string | undefined
}>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    if (!value) {
      return;
    }

    emit("update:modelValue", value);
  }
});

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>();
</script>