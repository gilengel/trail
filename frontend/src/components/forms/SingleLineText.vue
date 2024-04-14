<template>
  <div data-cy="singleline-text-container" class="tborder" :class="{ focused: focused === true }">
    <TLabel v-if="supportText">{{ supportText }}</TLabel>
    <input
      data-cy="singleline-text"
      type="text"
      :value="value"
      @input="(event) => emit('valueChanged', (event as InputFileEvent).target?.value)"
      @focusin="focused = true"
      @focusout="focused = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TLabel from '@/components/forms/TLabel.vue'

interface InputFileEvent extends Event {
  target: HTMLInputElement
}
defineProps({
  value: String,
  supportText: String
})

const focused = ref(false)

const emit = defineEmits<{
  (e: 'valueChanged', newValue: string): void
}>()
</script>

<style scoped lang="scss">
@import '@/style/border';

$height: 2em;

div {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  height: 56px;
  padding-left: 16px;
  padding-right: 16px;

  border: solid calc($border-size * 1px) $border-color;

  tlabel {
    height: 24px;
    padding-left: 12px;
    padding-right: 12px;
    margin-top: -12px;

    font-size: 1em;

    background-color: $background;
  }

  input {
    line-height: 24px;
    padding-left: 12px;
    width: 100%;

    outline: none;
    border: none;
    line-height: 32px;

    font-size: 1em;
  }
}
</style>
