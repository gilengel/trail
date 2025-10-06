<template>
  TextAlign
</template>

<script setup lang="ts">

import type {CustomPropertyConfig} from "@trail/grid-editor/configuration/elementProperty";

defineProps<{
  config: CustomPropertyConfig
  propertyKey: string
  modelValue: string | number | null
}>();

defineEmits<{
  'update:modelValue': [value: string | null]
}>();
</script>

<style scoped lang="scss">

</style>