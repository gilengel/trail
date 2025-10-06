<template>
  <v-btn-toggle
    v-model="level"
    mandatory
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
</template>

<script setup lang="ts">

import type {CustomPropertyConfig} from "@trail/grid-editor/configuration/elementProperty";

const props = defineProps<{
  config: CustomPropertyConfig
  propertyKey: string
  modelValue: number | null
}>();

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>();

const level = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  }
});
</script>