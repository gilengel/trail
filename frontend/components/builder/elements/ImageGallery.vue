<template>
  <masonry-wall
    :items="images"
    :ssr-columns="1"
    :column-width="300"
    :gap="16"
  >
    <template #default="{ item }">
      <div
        class="bg-surface-variant rounded-sm mx-auto"
        border="solid 2px white"
      >
        <v-img
          class="bg-surface-variant rounded-sm mx-auto"
          border="solid 2px white"
          cover
          :src="item.url"
        />
      </div>
    </template>
  </masonry-wall>
</template>

<script setup lang="ts">
import type {ImageDto} from "~/types/types";
import {columnValueValidator} from "~/composables/useColumValidator";


defineProps({
  images: {
    type: Array<ImageDto>,
    required: true
  },

  cols: {
    type: Number,
    required: true,
    validator: columnValueValidator
  },

  sm: {
    type: Number,
    required: false,
    default: 0,
    validator: columnValueValidator,
  },

  md: {
    type: Number,
    required: false,
    default: 0,
    validator: columnValueValidator,
  },

  lg: {
    type: Number,
    required: false,
    default: 0,
    validator: columnValueValidator
  },

  xl: {
    type: Number,
    required: false,
    default: 0,
    validator: columnValueValidator
  },

  xxl: {
    type: Number,
    required: false,
    default: 0,
    validator: columnValueValidator
  }
});

</script>

<style scoped></style>