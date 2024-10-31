<template>
  <span data-cy="t-icon" :class="icon" class="icon" />
</template>

<script setup lang="ts">
export interface TIconProps {
  icon: string;
}
withDefaults(defineProps<TIconProps>(), {
  icon: "pet_supplies",
});
</script>
<style lang="scss" scoped>
.icon {
  font-size: 2em;
}
</style>/