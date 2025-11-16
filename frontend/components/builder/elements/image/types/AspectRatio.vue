<template>
  <div class="aspect-ratios pb-4">
    <div
        v-for="(ratio, i) in aspectRatios"
        :key="i"
        class="ratio-container"
    >
      <v-responsive
          :aspect-ratio="ratio.value"
          :class="['border', props.modelValue === ratio.value ? 'selected' : '']"
          :data-testid="`ratio-${i}`"
          @click="$emit('update:modelValue', ratio.value)"
      >
        <div class="ratio-content">
          <strong>{{ ratio.label }}</strong>
        </div>
      </v-responsive>
    </div>
  </div>
</template>

<script setup lang="ts">

import type {CustomPropertyConfig} from "@trail/grid-editor/configuration/elementProperty";

const props = defineProps<{
  config: CustomPropertyConfig
  propertyKey: string
  modelValue: number
}>();

defineEmits<{
  'update:modelValue': [value: number]
}>();

// ---------------------------------------------------------------------------------------------------------------------

const aspectRatios = [
  {label: '3:2', value: 3 / 2},
  {label: '4:3', value: 4 / 3},
  {label: '5:4', value: 5 / 4},
  {label: '16:10', value: 16 / 10},
  {label: '16:9', value: 16 / 9},
  {label: '1:0.85', value: 1 / 0.85},
  {label: '2.35:1', value: 2.35},
];
</script>

<style scoped lang="scss">
$aspectWidth: 140px;

.aspect-ratios {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax($aspectWidth, 1fr));
  gap: 16px;
  width: 100%;
}

.ratio-container {
  width: 100%;
}

.ratio-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
}

.ratio-content:hover {
  cursor: pointer;
}

$primary: rgb(var(--v-theme-primary));
.selected {
  border: 2px solid $primary !important;
  color: $primary; /* ensures text contrast */
}
</style>