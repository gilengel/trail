<template>
  <v-text-field
    :model-value="modelValue"
    @update:model-value="(value) => emit('update:modelValue', value)"
    :rules="[rules.required, rules.counter]"
    :readonly
    class="mb-2"
    :label
    variant="outlined"
    :prepend-icon="icon"
  />
</template>

<script setup lang="ts">
const rules = {
  required: (value: string) => !!value || "Required.",
  counter: (value: string) => value.length <= 20 || "Max 20 characters",
};

interface Props {
  modelValue: string; // This will act as v-model
  label?: string;
  icon?: string;
  readonly?: boolean;
}

const {
  icon = "",
  label = "Text Field",
  readonly = false,
} = defineProps<Props>();

// Define emits
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<style scoped lang="scss"></style>
