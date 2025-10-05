<template>
  <h2 class="text-h6 mt-2 mb-2">
    Scaling {{ props.propertyKey }}
  </h2>
  <div>
    <v-row>
      <v-col>
        <v-row
            no-gutters
            align="center"
        >
          <v-col cols="8">
            <v-slider
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

import type {CustomPropertyConfig} from "@trail/grid-editor/configuration/elementProperty";
import {DefaultImageScale, type ImageScaleType} from "~/components/builder/elements/image/Properties";

const props = defineProps<{
  config: CustomPropertyConfig
  propertyKey: string
  modelValue: ImageScaleType | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ImageScaleType]
}>()

// ---------------------------------------------------------------------------------------------------------------------

const scaleValue: RefComputed<number[]> = computed({
  get() {
    if (!props.modelValue) {
      return DefaultImageScale;
    }

    return props.modelValue.value;
  },
  set(newScale) {
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