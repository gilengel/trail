<template>

  <Editor ref="editor"
          :formatting="false"
          :text="false"
          :undoredo="false"
          :content="text"
          :customNode="DynamicParagraph"
          @onTextChanged="onTextChanged"
          v-if="selected"/>
  <div class="heading-container" v-else v-html="text" :style/>
</template>

<script setup lang="ts">
import type {ElementProps} from "~/components/builder/properties";
import Editor from "~/components/Editor.vue";
import {DynamicParagraph} from "~/components/DynamicParagraph";

const gridModuleStore = useGridStore();

interface Props {
  level: number,
  color: string,
  text: string,
  alignment: string
}

const editor = useTemplateRef<InstanceType<typeof Editor>>('editor')

const tag = computed(() => {
  return `h${props.element.attributes.level + 1}`;
})


const text = computed(() => {
  const t = tag.value;
  return `<${t}>${props.element.attributes.text}</${t}>`
  /*
  if (!props.element.attributes.text) {
    return "Default Heading";
  }

  return props.element.attributes.text
  */
})

const props = defineProps<ElementProps<Props>>();

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
})

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
      .run()
})

const style = computed(() => {
  if (!props.element.attributes.color) {
    return 'color: white';
  }

  return `color: ${props.element.attributes.color}; text-align: ${props.element.attributes.alignment}`;
})

function onTextChanged(newContent: string) {
  const parser = new DOMParser();

  let document: Document = parser.parseFromString(newContent, "text/html") as Document;
  let element = (document.body.firstChild as HTMLElement)
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