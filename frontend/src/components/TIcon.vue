<template>
  <span data-cy="t-icon" class="material-symbols-outlined"> {{ icon }} </span>
</template>

<script setup lang="ts">
export interface TIconProps {
  icon: string
}
withDefaults(defineProps<TIconProps>(), {
  icon: 'pet_supplies'
})
</script>

<style scoped></style>
