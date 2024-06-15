<template>
  <a class="toolbar_btn">
    <span :class="cssClass" />
    <slot />
  </a>
</template>

<script setup lang="ts">
export interface ToolbarButtonProps {
  icon: string;
}
const props = withDefaults(defineProps<ToolbarButtonProps>(), {
  icon: "star",
});

const cssClass = computed(() => `toolbar_btn ${props.icon}`);
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
