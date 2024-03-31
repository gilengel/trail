<template>
  <div data-cy="trip-images" class="trip-images">
    <div class="div1">
      <img src="https://picsum.photos/600/600" />
    </div>
    <div class="div2">
      <img src="https://picsum.photos/700/700" />
    </div>
    <div class="div3">
      <img src="https://picsum.photos/300/300" />
    </div>
    <div class="div4">
      <img src="https://picsum.photos/400/400" />
    </div>
    <div class="div5">
      <img src="https://picsum.photos/500/500" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.trip-images {
  border-radius: 32px;

  $gap: 8px;
  height: 400px + $gap;

  display: grid;
  grid-template-columns: 2fr repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 8px;
  grid-row-gap: 8px;
}

div {
  overflow: hidden;
}

.div1 {
  grid-area: 1 / 1 / 3 / 2;
}

.div2 {
  grid-area: 1 / 2 / 2 / 3;
}

.div3 {
  grid-area: 1 / 3 / 2 / 4;
}

.div4 {
  grid-area: 2 / 2 / 3 / 3;
}

.div5 {
  grid-area: 2 / 3 / 3 / 4;
}
</style>
