<template>
  <div class="slot" data-cy="tile-slot">
    <h1>{{ title }}</h1>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String
})
</script>

<style scoped lang="scss">
@import '../style/colors';
@import '../style/font';

.slot {
  position: relative;

  h1 {
    font-family: 'Amatic SC', cursive;
    font-size: 3em;
    color: $yellow;
  }

  margin-bottom: 6em;
}
</style>
