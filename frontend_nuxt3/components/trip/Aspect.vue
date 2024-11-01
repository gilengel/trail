
<template>
  <div class="aspect">
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

<style lang="scss" scoped>
@container (max-width: 699px) {
  .aspect {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
@container (min-width: 700px) {
  .aspect {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>