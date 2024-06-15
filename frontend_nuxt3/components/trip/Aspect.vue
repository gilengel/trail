<template>
  <div>
    <TIcon :icon />

    <slot />
  </div>
</template>

<script setup lang="ts">
export interface TripAspectProps {
  icon: string;
}
withDefaults(defineProps<TripAspectProps>(), {
  icon: "pet_supplies",
});
</script>

<style scoped lang="scss">
div {
  $size: 32px;

  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-of-type {
    color: $border-color;

    width: $size;
    height: $size;

    font-size: $size;
    text-align: center;

    margin-bottom: 8px;
  }
}

@container (max-width: 1200px) {
  div {
    font-size: 1em;
  }
}
</style>
