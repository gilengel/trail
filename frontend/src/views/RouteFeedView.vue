<template>
  <div class="tflex-row" style="align-content: space-between; justify-content: space-between">
    <h1>Muu?</h1>
    <div class="btn-container">
      <TButton><TIcon icon="add" /></TButton>
      <TButton data-cy="button-edit" label="Edit" @click="$router.push({ name: 'route-edit' })"
        ><TIcon icon="edit"
      /></TButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import TIcon from '@/components/TIcon.vue'
import TButton from '@/components/forms/TButton.vue'
</script>

<style scoped></style>
