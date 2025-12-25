<template>
  <div>
    <v-row>
      <v-col>
        <v-row
            no-gutters
            align="center"
        >
          <v-col cols="8">
            <v-slider
                data-testid="editor-scale-slider"
                v-model="scaleValue"
                min="0.125"
                max="2"
            />
          </v-col>
          <v-col cols="4">
            <v-number-input
                control-variant="stacked"
                v-model="scaleValue"
                :precision="2"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">

import type {CustomPropertyConfig} from "@trail/grid-editor/properties/elementProperty";
import {DefaultImageScale, type ImageScaleType} from "~/components/builder/elements/image/Properties";

const props = defineProps<{
  config: CustomPropertyConfig
  propertyKey: string
  modelValue: ImageScaleType | undefined
}>();

const emit = defineEmits<{
  'update:modelValue': [value: ImageScaleType]
}>();

// ---------------------------------------------------------------------------------------------------------------------

const scaleValue = computed({
  get() {
    if (!props.modelValue) {
      return DefaultImageScale.value;
    }

    return props.modelValue.value;
  },
  set(newScale: number) {
    let scale = props.modelValue;
    if (scale === undefined) {
      scale = DefaultImageScale;
    } else {
      scale.value = newScale;
    }

    emit("update:modelValue", scale);
  }
});
</script>