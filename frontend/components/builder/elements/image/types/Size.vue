<template>
  <v-col
    class="py-2"
    cols="12"
    sm="6"
  >
    <v-btn-toggle v-model="imageSizeType">
      <v-btn
        :value="ImageSize.FitHorizontally"
        data-testid="btn-image-size-h"
      >
        <v-icon>las la-arrows-alt-h</v-icon>
      </v-btn>

      <v-btn
        :value="ImageSize.FitVertically"
        data-testid="btn-image-size-v"
      >
        <v-icon>las la-arrows-alt-v</v-icon>
      </v-btn>

      <v-btn
        :value="ImageSize.Free"
        data-testid="btn-image-size-f"
      >
        <v-icon>las la-vector-square</v-icon>
      </v-btn>
    </v-btn-toggle>
  </v-col>
</template>

<script setup lang="ts">

import type {CustomPropertyConfig} from "@trail/grid-editor/configuration/elementProperty";
import {ImageSize} from "~/components/builder/elements/image/Properties";

const props = defineProps<{
  config: CustomPropertyConfig
  propertyKey: string
  modelValue: ImageSize
}>();

const emit = defineEmits<{
  'update:modelValue': [value: ImageSize]
}>();

// - IMAGE SIZE MODE ---------------------------------------------------------------------------------------------------


const imageSizeType = computed({
  get() {
    if (!props.modelValue) {
      return ImageSize.Free;
    }

    return props.modelValue;
  },

  set(value) {
    emit("update:modelValue", value);
  }
});

</script>