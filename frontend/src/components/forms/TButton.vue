<template>
  <button class="btn tborder-radius">
    <slot />
    <span data-cy="button-label" v-if="label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps({
  label: String
})
</script>
<style scoped lang="scss">
@import '@/style/button';

// Necessary to hide weird outline on button in chrome
*,
*:focus,
*:hover {
  outline: none;
}
</style>
