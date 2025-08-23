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
import type {TextProperties} from "~/components/builder/elements/text/Properties";

const text = computed(() => {
  if (!props.element.attributes.text) {
    return "Default Text";
  }

  return props.element.attributes.text;
});

const props = defineProps<ElementProps<TextProperties>>();

const gridModuleStore = useGridStore();

//

function onTextChanged(newContent: string) {
  gridModuleStore.updateElementAttribute(props.element, "text", newContent);
}
</script>

<style scoped lang="scss">

</style>