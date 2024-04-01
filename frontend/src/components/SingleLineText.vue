<template>
  <div>
    <input
      type="text"
      :value="value"
      @input="(event) => emit('valueChanged', (event as InputFileEvent).target?.value)"
    />
  </div>
</template>

<script setup lang="ts">
interface InputFileEvent extends Event {
  target: HTMLInputElement
}
defineProps({
  value: String
})

const emit = defineEmits<{
  (e: 'valueChanged', newValue: string): void
}>()
</script>

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
