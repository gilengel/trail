<template>
  <v-btn-toggle v-model="level" mandatory>
    <v-btn data-testid="editor-level-h1-btn"> H1 </v-btn>

    <v-btn data-testid="editor-level-h2-btn"> H2 </v-btn>

    <v-btn data-testid="editor-level-h3-btn"> H3 </v-btn>

    <v-btn data-testid="editor-level-h4-btn"> H4 </v-btn>
  </v-btn-toggle>
</template>

<script setup lang="ts">
import type { CustomPropertyConfig } from "@trail/grid-editor/properties/elementProperty";

const props = defineProps<{
  config: CustomPropertyConfig;
  propertyKey: string;
  modelValue: number | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: number | null];
}>();

const level = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
