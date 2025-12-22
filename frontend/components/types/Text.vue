<template>
  Text
</template>

<script setup lang="ts">

import type {CustomPropertyConfig} from "@trail/grid-editor/properties/elementProperty";

defineProps<{
  config: CustomPropertyConfig
  propertyKey: string
  modelValue: string | null
}>();

defineEmits<{
  'update:modelValue': [value: string | null]
}>();
</script>

<style scoped lang="scss">

</style>