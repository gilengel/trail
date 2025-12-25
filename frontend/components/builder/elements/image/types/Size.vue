<template>
  <v-col class="py-2" cols="12" sm="6">
    <v-btn-toggle v-model="imageSizeType">
      <v-btn
        data-testid="editor-image-size-h-btn"
        :value="ImageSize.FitHorizontally"
      >
        <v-icon>las la-arrows-alt-h</v-icon>
      </v-btn>

      <v-btn
        data-testid="editor-image-size-v-btn"
        :value="ImageSize.FitVertically"
      >
        <v-icon>las la-arrows-alt-v</v-icon>
      </v-btn>

      <v-btn data-testid="editor-image-size-free-btn" :value="ImageSize.Free">
        <v-icon>las la-vector-square</v-icon>
      </v-btn>
    </v-btn-toggle>
  </v-col>
</template>

<script setup lang="ts">
import type { CustomPropertyConfig } from "@trail/grid-editor/properties/elementProperty";
import { ImageSize } from "~/components/builder/elements/image/Properties";

//-- PROPS -------------------------------------------------------------------------------------------------------------

const props = defineProps<{
  config: CustomPropertyConfig;
  propertyKey: string;
  modelValue: ImageSize;
}>();

//-- EMITS -------------------------------------------------------------------------------------------------------------

const emit = defineEmits<{
  "update:modelValue": [value: ImageSize];
}>();

//-- COMPUTED ---------------------------------------------------------------------------------------------------

const imageSizeType = computed({
  get() {
    if (!props.modelValue) {
      return ImageSize.Free;
    }

    return props.modelValue;
  },

  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
