<template>
  <span class="tinvalid" v-if="invalid"
    >INVALID {{ props.validation?.invalidText }}</span
  >
  <div
    data-cy="singleline-text-container"
    class="tborder"
    v-bind:class="{ invalid }"
    :class="{ focused: focused === true }"
  >
    <FormsTLabel v-if="supportText">{{ supportText }}</FormsTLabel>
    <input
      data-cy="singleline-text"
      type="text"
      :value="value"
      @input="(event) => valueChanged(event as InputFileEvent)"
      @focusin="focused = true"
      @focusout="focused = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface InputFileEvent extends Event {
  target: HTMLInputElement;
}

interface SingleTextProps {
  value: String | undefined;
  supportText: String;
  validation?: {
    func: (value: String) => boolean;
    invalidText: String;
  };
}

const props = defineProps<SingleTextProps>();

const focused = ref(false);
const invalid: Ref<Boolean | undefined> = ref(false);

function valueChanged(event: InputFileEvent) {
  const value = event.target?.value;
  invalid.value = props.validation && !props.validation.func(value);

  emit("valueChanged", (event as InputFileEvent).target?.value);
}

const emit = defineEmits<{
  (e: "valueChanged", newValue: string): void;
}>();
</script>

<style scoped lang="scss">
$height: 2em;

.tinvalid {
  position: absolute;
  height: 32px;
  line-height: 32px;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;

  background-color: $red;
  border-radius: 32px;
}
.tinvalid::after {
  content: " ";
  display: block;
  height: 0px;
  width: 0px;
  top: 10px;
  left: 10%;
  position: relative;
  border-right: solid 12px transparent;
  border-left: solid 12px transparent;
  border-top: solid 16px $red;
}

.invalid {
  border: $red solid 1px;
  margin-top: calc(32px + 48px);
}

div {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  height: 56px;
  padding-left: 16px;
  padding-right: 16px;

  border: solid calc($border-size * 1px) $border-color;
  border-radius: 28px;

  .tlabel {
    height: 24px;
    padding-left: 12px;
    padding-right: 12px;
    margin-top: -12px;

    font-size: 1em;

    background-color: $background;
    border: none;
  }

  input {
    line-height: 24px;
    padding-left: 12px;
    width: 100%;

    outline: none;
    border: none;

    font-size: 1em;
  }
}
</style>
