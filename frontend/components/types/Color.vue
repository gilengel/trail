<template>
  <v-color-picker
      v-model="value"
      hide-inputs
      show-swatches
  />
</template>

<script setup lang="ts">

import type {CustomPropertyConfig} from "@trail/grid-editor/configuration/elementProperty";

const props = defineProps<{
  config: CustomPropertyConfig
  propertyKey: string
  modelValue: string | undefined
}>()

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    if (!value) {
      return;
    }
    
    emit("update:modelValue", value)
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()
</script>