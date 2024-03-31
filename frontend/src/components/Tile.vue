<template>
  <div class="slot" data-cy="tile-slot">
    <slot />
  </div>
</template>

<style scoped lang="scss">
@import '../style/colors.scss';

.slot {
  @include trail-border;
  border-radius: 2em;
  position: relative;

  h1 {
    color: $yellow;
  }

  margin-bottom: 6em;
}
</style>
