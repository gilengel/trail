<template>
  <TToolbar>
    <TToolbarButton
      data-cy="button-edit"
      icon="edit"
      @click="$router.push({ name: 'route-edit' })"
    />
  </TToolbar>
</template>
