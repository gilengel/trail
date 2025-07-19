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
import type {ElementProps} from "~/components/builder/properties";

interface Props {
  text: string;
}

const text = computed(() => {
  if (!props.element.attributes.text) {
    return "Default Text";
  }

  return props.element.attributes.text;
})

const props = defineProps<ElementProps<Props>>();

const gridModuleStore = useGridStore();

//

function onTextChanged(newContent: string) {
  gridModuleStore.updateElementAttribute(props.element, "text", newContent);
}
</script>

<style scoped lang="scss">

</style>