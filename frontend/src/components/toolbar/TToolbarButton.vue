<template>
  <a class="toolbar_btn">
    <span class="material-symbols-outlined"> {{ icon }} </span>
    <slot />
  </a>
</template>

<script setup lang="ts">
export interface ToolbarButtonProps {
  icon: string
}
withDefaults(defineProps<ToolbarButtonProps>(), {
  icon: 'star'
})
</script>

<style scoped lang="scss">
.toolbar_btn {
  display: flex;
  align-items: center;
  justify-content: center;

  color: rgb(200, 200, 200);

  width: 64px;
  height: 64px;

  aspect-ratio: 1;

  span {
    font-size: 2em;
  }
}
.toolbar_btn:hover {
  cursor: pointer;
}
</style>
