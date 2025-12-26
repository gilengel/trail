<template>
  <v-btn-toggle
    v-model="alignment"
    mandatory
  >
    <v-btn
      data-testid="editor-align-left-btn"
      icon="las la-align-left"
      value="start"
    />
    <v-btn
      data-testid="editor-align-center-btn"
      icon="las la-align-center"
      value="center"
    />
    <v-btn
      data-testid="editor-align-right-btn"
      icon="las la-align-right"
      value="end"
    />
    <v-btn
      data-testid="editor-align-justify-btn"
      icon="las la-align-justify"
      value="justify"
    />
  </v-btn-toggle>
</template>

<script setup lang="ts">
import type { CustomPropertyConfig } from "@trail/grid-editor/properties/elementProperty";

const props = defineProps<{
  config: CustomPropertyConfig;
  propertyKey: string;
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const alignment = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
