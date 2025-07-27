<template>
  <Editor
      ref="editor"
      :formatting="false"
      :text="false"
      :undoredo="false"
      :content="text"
      :custom-node="DynamicParagraph"
      @on-text-changed="onTextChanged"
      v-if="selected"
  />
  <div
      class="heading-container"
      v-else
      v-html="text"
      :style
  />
</template>

<script setup lang="ts">
import type {ElementProps} from "~/components/builder/properties";
import Editor from "~/components/Editor.vue";
import {DynamicParagraph} from "~/components/builder/elements/heading/DynamicParagraph";
import type {HeadingProperties} from "~/components/builder/elements/heading/Properties";

// ---------------------------------------------------------------------------------------------------------------------

const gridModuleStore = useGridStore();

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<ElementProps<HeadingProperties, [], []>>();

// ---------------------------------------------------------------------------------------------------------------------

const editor = useTemplateRef<InstanceType<typeof Editor>>('editor');

// ---------------------------------------------------------------------------------------------------------------------

const tag = computed(() => {
  return `h${props.element.attributes.level + 1}`;
});

const text = computed(() => {
  const t = tag.value;

  const content = props.element.attributes.text;
  return `<${t}>${content}</${t}>`;
});

const style = computed(() => {
  const color = props.element.attributes.color;
  const alignment = props.element.attributes.alignment;

  return `color: ${color}; text-align: ${alignment}`;
});

// ---------------------------------------------------------------------------------------------------------------------

watch(() => props.selected, (selected) => {
  if (!selected || !editor.value) {
    return;
  }

  editor.value.setColor(props.element.attributes.color);
});

watch(() => props.element.attributes.color, () => {
  if (!editor.value) {
    return;
  }

  editor.value.setColor(props.element.attributes.color);
});

watch(() => props.element.attributes.level, () => {
  if (!editor.value) {
    return;
  }

  // 1) Put the cursor inside the node (or select it)
  //    so that updateAttributes knows which node to change.
  //    Here we assume the very first block in the doc is our dynamicParagraph.
  editor.value
      .getChain()!
      .focus()
      .setNodeSelection(1)                           // select the node that starts at pos=1
      .updateAttributes('dynamicParagraph', {
        level: props.element.attributes.level + 1,
      })
      .run();
});

// ---------------------------------------------------------------------------------------------------------------------

function onTextChanged(newContent: string) {
  const parser = new DOMParser();

  const document: Document = parser.parseFromString(newContent, "text/html") as Document;
  const element = (document.body.firstChild as HTMLElement);
  let align = element.style.textAlign;

  if (align === undefined) {
    align = "center";
  }

  gridModuleStore.updateElementAttribute(props.element, "text", element.textContent as string);
  gridModuleStore.updateElementAttribute(props.element, "alignment", align);
}

</script>

<style scoped lang="scss">
input {
  outline: none;
}

.heading-container {
  width: 100%;
}
</style>