<template>
  <div>
    <TIcon :icon />

    <span class="tborder-radius">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import TIcon from './TIcon.vue'

export interface TripAspectProps {
  icon: string
}
withDefaults(defineProps<TripAspectProps>(), {
  icon: 'pet_supplies'
})
</script>

<style scoped lang="scss">
@import '@/style/border';

div {
  $size: 64px;

  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-of-type {
    color: $border-color;

    width: $size;
    height: $size;
    border: rgb(230, 230, 230) 2px solid;

    font-size: $size * 0.8;
    text-align: center;
  }
}
</style>
