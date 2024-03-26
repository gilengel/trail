<template>
  <div>
    <input type="text" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import '../style/colors.scss';

$height: 2em;
div {
  border: solid calc($border-size * 1px) $border-color;
  border-radius: $height;
  min-width: 40em;

  display: flex;

  $margin: $height / 0.75;
  input {
    position: relative;
    line-height: $height;
    margin-left: $margin;

    outline: none;
    border: none;

    width: calc(100% - $margin * 2);
  }
}
</style>
