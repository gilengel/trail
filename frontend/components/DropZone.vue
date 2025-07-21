<template>
  <IconForm icon="las la-map-signs">
    <div
      class="v-input-collapse pa-6"
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

      <v-list
        v-if="processedFiles.length > 0"
        data-cy="preview-container"
      >
        <v-list-item
          v-for="(file, index) in processedFiles"
          :key="file.name"
          :value="index"
          color="primary"
          rounded="xl"
        >
          <slot
            name="item"
            :item="file"
            :index="index"
          >
            {{ file }}
          </slot>
        </v-list-item>
      </v-list>
    </div>
  </IconForm>
</template>

<script setup lang="ts" generic="CustomFile extends File">

interface Props {
  allowedFileExtensions?: string[];
  supportText?: string;

  processor?: (file: CustomFile) => Promise<void>;
}

const {allowedFileExtensions = [], supportText = "Support Text", processor = (file) => file} = defineProps<Props>();

const emit = defineEmits<(e: "onFilesChanged", files: CustomFile[]) => void>();

const isDragging: Ref<boolean> = ref(false);
const isWrongFileType: Ref<boolean> = ref(false);


const files: Ref<CustomFile[]> = ref([]);

const processedFiles = computed(() => {
  files.value.forEach((file: CustomFile) => {
    processor(file);
  });


  return files.value;
});

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
async function drop(e: DragEvent) {
  if (!e.dataTransfer?.files) {
    return;
  }

  e.preventDefault();
  const droppedFiles = Array.from(e.dataTransfer.files) as CustomFile[];
  for (const file of droppedFiles) {
    const found = allowedFileExtensions.find((extension) =>
        file.name.endsWith(`.${extension}`)
    );

    isDragging.value = false;

    if (!found && allowedFileExtensions.length > 0) {
      console.log(`${file.name} is not from allowed type`);
      isWrongFileType.value = true;
      setTimeout(() => {
        isWrongFileType.value = false;
      }, 3000);
      return;
    }

    // Await the processor before pushing the file
    await processor(file);
    files.value.push(file as CustomFile);
  }

  emit("onFilesChanged", files.value);
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
