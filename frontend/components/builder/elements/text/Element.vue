<template>
  <Editor
    :content="text"
    @on-text-changed="onTextChanged"
    v-if="selected"
  />
  <div
    v-else
    v-html="text"
    class="tiptap"
  />
</template>

<script setup lang="ts">
import type {EditorElementProperties} from "~/components/GridEditor/grid";
import {TextElement} from "~/components/builder/elements/text/index";

const text = computed(() => {
  if (!props.element.properties.content) {
    return "Default Text";
  }

  return props.element.properties.content;
});

const props = defineProps<EditorElementProperties<typeof TextElement>>();

function onTextChanged(newContent: string) {
  //gridModuleStore.updateElementAttribute(props.element, "text", newContent);
}
</script>

<style scoped lang="scss">

</style>