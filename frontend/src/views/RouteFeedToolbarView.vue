<template>
  <TToolbar>
    <TToolbarButton
      data-cy="button-edit"
      icon="edit"
      @click="$router.push({ name: 'route-edit' })"
    />
  </TToolbar>
</template>

<script setup lang="ts">
import TToolbar from '@/components/toolbar/TToolbar.vue'
import TToolbarButton from '@/components/toolbar/TToolbarButton.vue'
</script>

<style scoped></style>
