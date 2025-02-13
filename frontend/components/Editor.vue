<template>
  <div>
    <div v-if="editor">
      <v-toolbar>
        <ToolbarButton
          icon="las la-bold"
          tooltip="Bold"
          :is-active="editor.isActive('bold')"
          @click="editor.chain().focus().toggleBold().run()"
        />

        <ToolbarButton
          icon="las la-italic"
          tooltip="Italic"
          :is-active="editor.isActive('italic')"
          @click="editor.chain().focus().toggleItalic().run()"
        />

        <ToolbarButton
          icon="las la-strikethrough"
          tooltip="Strikethrough"
          :is-active="editor.isActive('strike')"
          @click="editor.chain().focus().toggleStrike().run()"
        />

        <ToolbarButton
          icon="las la-list"
          tooltip="Bullet List"
          :is-active="editor.isActive('bulletList')"
          @click="editor.chain().focus().toggleBulletList().run()"
        />

        <ToolbarButton
          icon="las la-list-ol"
          tooltip="Numbered List"
          :is-active="editor.isActive('orderedList')"
          @click="editor.chain().focus().toggleOrderedList().run()"
        />

        <ToolbarButton
          icon="las la-quote-left"
          tooltip="Blockquote"
          :is-active="editor.isActive('blockquote')"
          @click="editor.chain().focus().toggleBlockquote().run()"
        />

        <ToolbarButton
          icon="las la-undo-alt"
          tooltip="Undo"
          :is-active="editor.isActive('undo')"
          @click="editor.chain().focus().undo().run()"
        />


        <ToolbarButton
          icon="las la-redo-alt"
          tooltip="Redo"
          :is-active="editor.isActive('redo')"
          @click="editor.chain().focus().redo().run()"
        />
      </v-toolbar>
    </div>
    <TiptapEditorContent :editor="editor" />
  </div>
</template>

<script setup lang="ts">
const editor = useEditor({
  content: "<p>I'm running Tiptap with Vue.js. 🎉</p>",
  extensions: [TiptapStarterKit],
});

onBeforeUnmount(() => {
  const instance = unref(editor); // Ensure `editor` is resolved from the ref
  if (instance) {
    instance.destroy(); // Call destroy only if the instance is defined
  }
});
</script>


<style scoped lang="scss">

</style>