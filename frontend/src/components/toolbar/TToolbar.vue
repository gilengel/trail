<template>
  <div data-cy="ttoolbar" class="ttoolbar">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.ttoolbar {
  width: 64px;
  border-right: rgb(230, 230, 230) 1px solid;

  display: flex;
  flex-direction: column;
}
</style>
