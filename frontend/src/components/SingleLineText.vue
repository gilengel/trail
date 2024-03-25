<template>
  <div>
    <input type="text" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import '../style/colors.scss';

div {
  border: solid calc($border-size * 1px) $border-color;
  border-radius: 2em;

  input {
    position: relative;
    line-height: 2em;
    margin-left: 1em;

    outline: none;
    border: none;
  }
}
</style>
