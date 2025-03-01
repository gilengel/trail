<template>
  <component :is="element" :style>
    <input
        type="text"
        :value="props.element.attributes.text"
        @input="onTextChanged"
        v-bind="props.element.attributes"
    />

  </component>

</template>

<script setup lang="ts">

import {InputEvent} from "happy-dom";
import type {ElementProps} from "~/components/builder/properties";

const gridModuleStore = useGridStore();

interface Props {
  level: number,
  color: string,
  text: string,

}

const props = defineProps<ElementProps<Props>>();

const onTextChanged = (event: Event) => {

  gridModuleStore.updateElementAttribute(props.element, "text", event.target.value)
};

const element = computed(() => {
  if (!props.element.attributes.level) {
    return 'H1';
  }

  return `H${props.element.attributes.level + 1}`;
})

const style = computed(() => {
  if (!props.element.attributes.color) {
    return 'color: white';
  }

  return `color: ${props.element.attributes.color}`
})

</script>

<style scoped lang="scss">
input {
  outline: none;
}

</style>