<template>
  <div>
    <div v-if="editor">
      <v-toolbar>
        <ToolbarButton
            icon="las la-bold"
            tooltip="Bold"
            :isActive="editor.isActive('bold')"
            @click="editor.chain().focus().toggleBold().run()"
        />

        <ToolbarButton
            icon="las la-italic"
            tooltip="Italic"
            :isActive="editor.isActive('italic')"
            @click="editor.chain().focus().toggleItalic().run()"
        />

        <ToolbarButton
            icon="las la-strikethrough"
            tooltip="Strikethrough"
            :isActive="editor.isActive('strike')"
            @click="editor.chain().focus().toggleStrike().run()"
        />

        <ToolbarButton
            icon="las la-list"
            tooltip="Bullet List"
            :isActive="editor.isActive('bulletList')"
            @click="editor.chain().focus().toggleBulletList().run()"
        />

        <ToolbarButton
            icon="las la-list-ol"
            tooltip="Numbered List"
            :isActive="editor.isActive('orderedList')"
            @click="editor.chain().focus().toggleOrderedList().run()"
        />

        <ToolbarButton
            icon="las la-quote-left"
            tooltip="Blockquote"
            :isActive="editor.isActive('blockquote')"
            @click="editor.chain().focus().toggleBlockquote().run()"
        />

        <ToolbarButton
            icon="las la-undo-alt"
            tooltip="Undo"
            :isActive="editor.isActive('undo')"
            @click="editor.chain().focus().undo().run()"
        />


        <ToolbarButton
            icon="las la-redo-alt"
            tooltip="Redo"
            :isActive="editor.isActive('redo')"
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

const options = [
  { value: "option1", label: "Option 1", icon: "las la-bold" },
  { value: "option2", label: "Option 2", icon: "las la-bold" },
  { value: "option3", label: "Option 3", icon: "las la-bold" },
];

// State for the selected toggle button
const selectedOption = ref("option1");

// Function to toggle options
const toggleOption = (value: string) => {
  selectedOption.value = value;
};
</script>



<style scoped lang="scss">

</style>