<template>
  <div class="editor-container">
    <Teleport to="#editor-primary-toolbar">
      <v-toolbar density="compact" v-if="editor">
        <ToolbarButton v-if="formatting"
                       icon="las la-bold"
                       tooltip="Bold"
                       :is-active="editor.isActive('bold')"
                       @click="editor.chain().focus().toggleBold().run()"
        />

        <ToolbarButton v-if="formatting"
                       icon="las la-italic"
                       tooltip="Italic"
                       :is-active="editor.isActive('italic')"
                       @click="editor.chain().focus().toggleItalic().run()"
        />

        <ToolbarButton v-if="formatting"
                       icon="las la-strikethrough"
                       tooltip="Strikethrough"
                       :is-active="editor.isActive('strike')"
                       @click="editor.chain().focus().toggleStrike().run()"
        />

        <ToolbarButton v-if="text"
                       icon="las la-list"
                       tooltip="Bullet List"
                       :is-active="editor.isActive('bulletList')"
                       @click="editor.chain().focus().toggleBulletList().run()"
        />

        <ToolbarButton v-if="text"
                       icon="las la-list-ol"
                       tooltip="Numbered List"
                       :is-active="editor.isActive('orderedList')"
                       @click="editor.chain().focus().toggleOrderedList().run()"
        />

        <ToolbarButton v-if="text"
                       icon="las la-quote-left"
                       tooltip="Blockquote"
                       :is-active="editor.isActive('blockquote')"
                       @click="editor.chain().focus().toggleBlockquote().run()"
        />

        <ToolbarButton v-if="undoredo"
                       icon="las la-undo-alt"
                       tooltip="Undo"
                       :is-active="editor.isActive('undo')"
                       @click="editor.chain().focus().undo().run()"
        />

        <ToolbarButton v-if="undoredo"
                       icon="las la-redo-alt"
                       tooltip="Redo"
                       :is-active="editor.isActive('redo')"
                       @click="editor.chain().focus().redo().run()"
        />

        <ToolbarButton v-if="alignment"
                       icon="las la-align-left"
                       tooltip="Redo"
                       :is-active="editor.isActive('left')"
                       @click="editor.chain().focus().setNodeSelection(1).setTextAlign('left').run()"
        />

        <ToolbarButton v-if="alignment"
                       icon="las la-align-center"
                       tooltip="Redo"
                       :is-active="editor.isActive('center')"
                       @click="editor.chain().focus().setNodeSelection(1).setTextAlign('center').run()"
        />

        <ToolbarButton v-if="alignment"
                       icon="las la-align-right"
                       tooltip="Redo"
                       :is-active="editor.isActive('right')"
                       @click="editor.chain().focus().setNodeSelection(1).setTextAlign('right').run()"
        />

        <ToolbarButton v-if="alignment"
                       icon="las la-align-justify"
                       tooltip="Redo"
                       :is-active="editor.isActive('justify')"
                       @click="editor.chain().focus().setNodeSelection(1).setTextAlign('justify').run()"
        />
      </v-toolbar>
    </Teleport>
    <TiptapEditorContent :editor="editor"/>
  </div>

</template>

<script setup lang="ts">
import TextAlign from '@tiptap/extension-text-align'
import {Color} from "@tiptap/extension-color";
import {TextStyle} from "@tiptap/extension-text-style";
import {type Extensions, Node} from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  content: string,

  formatting?: boolean,
  alignment?: boolean,
  undoredo?: boolean,
  text?: boolean,
  customNode?: Node<any, any>
}


const {
  content, alignment = true, undoredo = true, formatting = true, text = true,
  customNode
} = defineProps<Props>();

function setColor(color: string) {
  if (!editor.value) {
    return;
  }

  editor.value.commands.setNodeSelection(1)
  editor.value.commands.setColor(color)
}

function setAlignment(alignment: string) {
  if (!editor.value) {
    return;
  }

  editor.value.commands.setNodeSelection(1)
  editor.value.commands.setTextAlign(alignment);
}

function getChain() {
  return editor.value?.chain()
}


function getCommands() {
  if (!editor.value) {
    return;
  }

  return editor.value.commands;
}

function setContent(content: string) {
  if (!editor.value) {
    return;
  }

  //editor.value.commands.setContent(content)
}

defineExpose({
  setContent,
  setColor,
  setAlignment,
  getCommands,
  getChain
})

const emit = defineEmits<{
  onTextChanged: [newContent: string];
}>();

const starterKitNoParaOrHeading = StarterKit.configure({
  heading: false,
})

let defaultExtensions: Extensions = [
  starterKitNoParaOrHeading,
  Color,
  TextStyle.configure({mergeNestedSpanStyles: true}),
  TextAlign.configure({types: ['dynamicParagraph', 'paragraph']}),
]

if (customNode) {
  defaultExtensions.push(customNode)
}

const editor = useEditor({
  content,
  extensions: defaultExtensions,

  onUpdate: ({editor}) => {
    emit("onTextChanged", editor.getHTML());
  }
});

</script>


<style lang="scss">
.editor-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  > div {
    flex-grow: 1;
  }
}


.tiptap {
  height: 100%;
  padding: 12px;

  display: flex;
  flex-direction: column;
  justify-content: center;
}

.v-btn {
  min-width: 48px;
}
</style>