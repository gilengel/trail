<template>
  <div :class="classes">
    <slot/>
  </div>
</template>

<script setup lang="ts">

const {isHighlighted} = defineProps<{
  isHighlighted: boolean;
}>();

// ---------------------------------------------------------------------------------------------------------------------

const classes = computed(() => {
  if (isHighlighted) {
    return ["highlight", "border-md"]
  }

  return ["border-thin"];
})
</script>

<style scoped lang="scss">
.highlight {
  border-color: rgb(var(--v-theme-primary)) !important;
}
</style>