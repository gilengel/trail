<template>
  <div>
    <TIcon :icon />

    <span>
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
@import '../style/colors.scss';

div {
  $size: 64px;

  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-of-type {
    color: $border-color;

    width: $size;
    height: $size;
    border-radius: $size / 2;
    border: rgb(230, 230, 230) 2px solid;

    font-size: $size * 0.8;
    text-align: center;
  }
}
</style>
