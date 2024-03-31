<template>
  <button class="btn">
    <span data-cy="button-label">{{ title }}</span>
  </button>
</template>

<script setup lang="ts">
export interface AnimatedButtonProps {
  title: string
}
withDefaults(defineProps<AnimatedButtonProps>(), {
  title: 'Animated Button'
})
</script>
<style scoped lang="scss">
@import '../style/button';

// Necessary to hide weird outline on button in chrome
*,
*:focus,
*:hover {
  outline: none;
}
</style>
