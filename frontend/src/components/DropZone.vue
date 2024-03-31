<template>
  <div class="main">
    {{ allowedFileExtensions }}
    <div
      class="dropzone-container"
      :class="{ dragging: isDragging === true }"
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="drop"
      data-cy="drop-zone"
    >
      <input type="file" multiple name="file" id="fileInput" @change="onChange" ref="file" />

      <label for="fileInput" class="file-label">
        <div data-cy="release-msg" v-if="isDragging">Release to drop files here.</div>
        <div data-cy="drop-msg" v-else>Drop files here or <u>click here</u> to upload.</div>
      </label>

      <p data-cy="wrong-file-extension" v-if="isWrongFileType">File has wrong type.</p>
      <div data-cy="preview-container" class="preview-container mt-4" v-if="files.length">
        <div
          v-for="(file, index) in files"
          :key="file.name"
          class="preview-card"
          :class="{ deleting: isDragging === true }"
        >
          <p>
            {{ file.name }} -
            {{ Math.round(file.size / 1000) + 'kb' }}
          </p>

          <div>
            <SVGTrash data-cy="delete-btn" @click="remove(index)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SVGTrash from './SVGTrash.vue'

import { type Ref, ref } from 'vue'

export interface DropZoneProps {
  allowedFileExtensions?: string[]
}
const props = withDefaults(defineProps<DropZoneProps>(), {
  allowedFileExtensions: () => []
})

const emit = defineEmits<{
  (e: 'onFilesChanged', files: File[]): void
}>()

const isDragging: Ref<boolean> = ref(false)
const isWrongFileType: Ref<boolean> = ref(false)
const files: Ref<File[]> = ref([])

function onChange() {
  emit('onFilesChanged', files.value)
  //files.value.push(...this.$refs.file.files)
}

function dragover(e) {
  e.preventDefault()

  isDragging.value = true
}

function dragleave() {
  isDragging.value = false
}

function drop(e) {
  e.preventDefault()
  for (let i = 0; i < e.dataTransfer.files.length; ++i) {
    const file: File = e.dataTransfer.files[i]

    const found = props.allowedFileExtensions.find((extension) => {
      return file.name.endsWith(`.${extension}`)
    })

    isDragging.value = false

    if (!found && props.allowedFileExtensions.length > 0) {
      console.log(`${file.name} is not from allowed type`)
      isWrongFileType.value = true
      setTimeout(() => {
        isWrongFileType.value = false
      }, 3000)

      return
    }

    files.value.push(e.dataTransfer.files[i])
  }

  onChange()
}

function remove(i: number) {
  console.log(files.value)
  files.value.splice(i, 1)
}
</script>
<style scoped lang="scss">
@import '../style/button.scss';

.dropzone-container {
  border: solid 2px $light;
  border-radius: 2em;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  input {
    visibility: collapse;
  }

  label {
    @include font;
  }
}
.dragging {
  border: solid 4px orange;
}

.preview-container {
  display: flex;
  gap: 1em;
}
.preview-card {
  @include trail-border;
  border-radius: 2em;
  border-color: $light;
  padding: 1em;

  p {
    @include font;
  }
}

.deleting {
  border-color: red;
}
</style>
