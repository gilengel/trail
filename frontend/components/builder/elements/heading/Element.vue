<template>
  {{ props.element }}
  <Editor
      ref="textEditor"
      :formatting="false"
      :text="false"
      :undoredo="false"
      :content="text"
      :custom-node="DynamicParagraph"
      @on-text-changed="onTextChanged"
      v-if="props.element.selected"
  />
  <div
      class="heading-container"
      v-else
      v-html="text"
      :style
  />
</template>

<script setup lang="ts">
import Editor from "~/components/Editor.vue";
import {DynamicParagraph} from "~/components/builder/elements/heading/DynamicParagraph";
import {inject} from "vue";
import {EditorInjectionKey} from "@trail/grid-editor/editor";
import type {EditorElementProperties} from "@trail/grid-editor/grid";
import type {HeadingElement} from "~/components/builder/elements/heading/index";
import {UpdateElementAttribute} from "@trail/grid-editor/undoredo/actions/updateElementAttribute";

// ---------------------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey);

if (!editor) {
  throw new Error("Editor instance was not injected in Heading");
}

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<EditorElementProperties<typeof HeadingElement>>();

// ---------------------------------------------------------------------------------------------------------------------

const textEditor = useTemplateRef<InstanceType<typeof Editor>>('editor');

// ---------------------------------------------------------------------------------------------------------------------

const tag = computed(() => {
  return `h${props.element.properties.level + 1}`;
});

const text = computed(() => {
  const t = tag.value;

  const content = props.element.properties.text;
  return `<${t}>${content}</${t}>`;
});

const style = computed(() => {
  const color = props.element.properties.color;
  const alignment = props.element.properties.alignment;

  return `color: ${color}; text-align: ${alignment}`;
});

// ---------------------------------------------------------------------------------------------------------------------

watch(() => props.element.selected, (selected) => {
  if (!selected || !textEditor.value) {
    return;
  }

  textEditor.value.setColor(props.element.properties.color);
});

watch(() => props.element.properties.color, () => {
  if (!textEditor.value) {
    return;
  }

  textEditor.value.setColor(props.element.properties.color);
});

watch(() => props.element.properties.level, () => {
  if (!textEditor.value) {
    return;
  }

  // 1) Put the cursor inside the node (or select it)
  //    so that updateAttributes knows which node to change.
  //    Here we assume the very first block in the doc is our dynamicParagraph.
  textEditor.value
      .getChain()!
      .focus()
      .setNodeSelection(1)                           // select the node that starts at pos=1
      .updateAttributes('dynamicParagraph', {
        level: props.element.properties.level + 1,
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

  editor?.executeAction(new UpdateElementAttribute<typeof HeadingElement>(props.element, "text", element.textContent!));
  editor?.executeAction(new UpdateElementAttribute<typeof HeadingElement>(props.element, "alignment", align));
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