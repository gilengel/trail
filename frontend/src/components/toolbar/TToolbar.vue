<template>
  <div class="toolbar">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.toolbar {
  width: 64px;
  border-right: rgb(230, 230, 230) 1px solid;

  display: flex;
  flex-direction: column;
}
</style>
