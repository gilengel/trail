<template>
  <div class="slot" data-cy="tile-slot">
    <h1 data-dy="tile-header">{{ title }}</h1>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
});
</script>

<style scoped lang="scss">
.slot {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  gap: 1em;

  h1 {
    font-family: "Amatic SC", cursive;

    color: $yellow;
  }
}

@container (max-width: 1200px) {
  h1 {
    font-weight: bold;
  }
}
@container (min-width: 1200px) {
  h1 {
    font-size: 3em;
    font-weight: normal;
  }
}
</style>
