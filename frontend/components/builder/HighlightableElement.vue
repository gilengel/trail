<template>
  <div :class="isHighlighted ? 'border-xl' : 'border-thin'">
    <slot />
  </div>
</template>

<script setup lang="ts">

const {isHighlighted} = defineProps<{
  isHighlighted: boolean;
}>();
</script>

<style scoped lang="scss">

</style>