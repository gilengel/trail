<template>
  <div
    class="v-input-collapse pa-6 border-thin d-flex flex-column"
    :class="{ focused: isDragging === true }"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
    data-cy="drop-zone"
  >
    <label v-if="supportText">{{ supportText }}</label>
    <input
      data-cy="file-input"
      type="file"
      multiple
      name="file"
      id="fileInput"
      @change="onChange"
      ref="file"
    />

    <label for="fileInput" data-cy="release-msg" v-if="isDragging">
      Release to drop files here.
    </label>
    <label for="fileInput" data-cy="release-msg" v-else>
      Drop files here or <u>click here</u> to upload.
    </label>

    <label data-cy="wrong-file-extension" v-if="isWrongFileType">
      File has wrong type.
    </label>

    <slot name="container" :files="files">
      <ul
          data-cy="preview-container"
          class="preview-container mt-4"
          v-if="files.length"
      >
        <li
            v-for="(file, index) in files"
            :key="file.name"
            class="preview-card"
            :class="{ deleting: isDragging === true }"
        >
          <slot name="item" :file="file" :index="index">
            <div>
          <span>
            {{ file.name }}
          </span>
              <span>
            {{ Math.round(file.size / 1000) + "kb" }}
          </span>
            </div>
          </slot>
        </li>
      </ul>
    </slot>
  </div>
</template>

<script setup lang="ts">
export interface DropZoneProps {
  allowedFileExtensions?: string[];
  supportText?: string;
}
const props = withDefaults(defineProps<DropZoneProps>(), {
  allowedFileExtensions: () => [],
});

const emit = defineEmits<(e: "onFilesChanged", files: File[]) => void>();

const isDragging: Ref<boolean> = ref(false);
const isWrongFileType: Ref<boolean> = ref(false);
const files: Ref<File[]> = ref([]);

function onChange() {
  emit("onFilesChanged", files.value);
}

function dragover(e: DragEvent) {
  e.preventDefault();

  isDragging.value = true;
}

function dragleave() {
  isDragging.value = false;
}

function drop(e: DragEvent) {
  if (!e.dataTransfer?.files) {
    return;
  }

  e.preventDefault();
  for (let i = 0; i < e.dataTransfer?.files.length; ++i) {
    const file: File = e.dataTransfer.files[i];

    const found = props.allowedFileExtensions.find((extension) => {
      return file.name.endsWith(`.${extension}`);
    });

    isDragging.value = false;

    if (!found && props.allowedFileExtensions.length > 0) {
      console.log(`${file.name} is not from allowed type`);
      isWrongFileType.value = true;
      setTimeout(() => {
        isWrongFileType.value = false;
      }, 3000);

      return;
    }

    files.value.push(e.dataTransfer.files[i]);
  }

  onChange();
}

function remove(i: number) {
  files.value.splice(i, 1);
}
</script>
<style scoped lang="scss">
.v-input-collapse {
  input {
    visibility: collapse;
  }
}

.deleting {
  border-color: red;
}

label {

  line-height: 2em;
}
</style>
