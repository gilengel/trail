<template>
  <div class="slot" data-cy="tile-slot">
    <h1 data-dy="tile-header">{{ title }}</h1>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String
})
</script>

<style scoped lang="scss">
@import '@/style/colors';
@import '@/style/font';

.slot {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  gap: 1em;
  h1 {
    font-family: 'Amatic SC', cursive;
    font-size: 3em;
    color: $yellow;
  }
}
</style>
