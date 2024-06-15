<template>
  <div data-cy="ttoolbar" class="ttoolbar">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.ttoolbar {
  display: flex;
}

@container (max-width: 1200px) {
  .ttoolbar {
    height: 64px;
    flex-direction: row;
    justify-content: flex-start;
  }
}
@container (min-width: 1200px) {
  .ttoolbar {
    min-width: 64px;
    flex-direction: column;
  }
}
</style>
