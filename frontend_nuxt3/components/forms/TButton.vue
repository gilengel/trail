<template>
  <button class="btn tborder-radius" data-cy="t-button">
    <slot />
    <span data-cy="button-label" v-if="label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps({
  label: String,
});
</script>
<style scoped lang="scss">
// Necessary to hide weird outline on button in chrome
*,
*:focus,
*:hover {
  outline: none;
}
</style>
