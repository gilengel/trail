<template>
  <component :is="element" :style>Heading</component>
</template>

<script setup lang="ts">

const props = defineProps({
  level: Number,
  color: String
});

const element = computed(() => {
  if (!props.level) {
    return 'H1';
  }

  return `H${props.level + 1}`;
})

const style = computed(() => {
  if (!props.color) {
    return 'color: white';
  }

  return `color: ${props.color}`
})
</script>

<style scoped lang="scss">
h1, h2, h3, h4, h5, h6 {
  padding: 0;
  margin: 0;
}
</style>