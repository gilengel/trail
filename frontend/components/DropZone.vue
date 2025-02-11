<template>
  <div
    class="v-input-collapse pa-6 border-thin d-flex flex-column"
    :class="{ focused: isDragging === true }"
    data-cy="drop-zone"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
  >
    <label v-if="supportText">{{ supportText }}</label>
    <input
      id="fileInput"
      ref="file"
      data-cy="file-input"
      type="file"
      multiple
      name="file"
      @change="onChange"
    >

    <label
      v-if="isDragging"
      for="fileInput"
      data-cy="release-msg"
    >
      Release to drop files here.
    </label>
    <label
      v-else
      for="fileInput"
      data-cy="release-msg"
    >
      Drop files here or <u>click here</u> to upload.
    </label>

    <label
      v-if="isWrongFileType"
      data-cy="wrong-file-extension"
    >
      File has wrong type.
    </label>

    <slot
      name="container"
      :files="files"
    >
      <ul
        v-if="files.length"
        data-cy="preview-container"
        class="preview-container mt-4"
      >
        <li
          v-for="(file, index) in files"
          :key="file.name"
          class="preview-card"
          :class="{ deleting: isDragging === true }"
        >
          <slot
            name="item"
            :file="file"
            :index="index"
          >
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

interface Props {
  allowedFileExtensions?: string[];
  supportText?: string;
}

const {allowedFileExtensions = [], supportText = "Support Text"} = defineProps<Props>();

const emit = defineEmits<(e: "onFilesChanged", files: File[]) => void>();

const isDragging: Ref<boolean> = ref(false);
const isWrongFileType: Ref<boolean> = ref(false);
const files: Ref<File[]> = ref([]);

/**
 *
 */
function onChange() {
  emit("onFilesChanged", files.value);
}

/**
 * @param e
 */
function dragover(e: DragEvent) {
  e.preventDefault();

  isDragging.value = true;
}

/**
 *
 */
function dragleave() {
  isDragging.value = false;
}

/**
 * @param e
 */
function drop(e: DragEvent) {
  if (!e.dataTransfer?.files) {
    return;
  }

  e.preventDefault();
  for (let i = 0; i < e.dataTransfer?.files.length; ++i) {
    const file: File = e.dataTransfer.files[i];

    const found = allowedFileExtensions.find((extension) => {
      return file.name.endsWith(`.${extension}`);
    });

    isDragging.value = false;

    if (!found && allowedFileExtensions.length > 0) {
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
