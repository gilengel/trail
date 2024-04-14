<template>
  <div
    class="dropzone-container tborder"
    :class="{ focused: isDragging === true }"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
    data-cy="drop-zone"
  >
    <TLabel v-if="supportText">{{ supportText }}</TLabel>
    <input
      data-cy="file-input"
      type="file"
      multiple
      name="file"
      id="fileInput"
      @change="onChange"
      ref="file"
    />

    <label for="fileInput" class="file-label">
      <div data-cy="release-msg" v-if="isDragging">Release to drop files here.</div>
      <div data-cy="drop-msg" v-else>Drop files here or <u>click here</u> to upload.</div>
    </label>

    <p data-cy="wrong-file-extension" v-if="isWrongFileType">File has wrong type.</p>
    <ul data-cy="preview-container" class="preview-container mt-4" v-if="files.length">
      <li
        v-for="(file, index) in files"
        :key="file.name"
        class="preview-card"
        :class="{ deleting: isDragging === true }"
      >
        <div>
          <span>
            {{ file.name }}
          </span>
          <span>
            {{ Math.round(file.size / 1000) + 'kb' }}
          </span>
        </div>

        <SVGTrash data-cy="delete-btn" @click="remove(index)" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import SVGTrash from '@/components/SVGTrash.vue'
import TLabel from '@/components/forms/TLabel.vue'

import { type Ref, ref } from 'vue'

export interface DropZoneProps {
  allowedFileExtensions?: string[]
  supportText?: String
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

function dragover(e: DragEvent) {
  e.preventDefault()

  isDragging.value = true
}

function dragleave() {
  isDragging.value = false
}

function drop(e: DragEvent) {
  if (!e.dataTransfer?.files) {
    return
  }

  e.preventDefault()
  for (let i = 0; i < e.dataTransfer?.files.length; ++i) {
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
  padding-left: 16px;
  padding-right: 16px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: relative;

  margin-top: 12px;

  tlabel {
    position: absolute;
    top: 0;
    left: 16px;
    height: 24px;
    padding-left: 12px;
    padding-right: 12px;
    margin-top: -12px;

    font-size: 1em;
    background-color: $background;
  }

  input {
    visibility: collapse;
  }

  label {
    @include font;
  }
}

.preview-container {
  list-style: none;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  //display: flex;
  gap: 1em;

  max-height: 400px;
  overflow: scroll;
  width: 100%;
}
.preview-card {
  display: flex;
  justify-content: space-between;
  align-items: stretch;

  //@include trail-border;
  //border-color: $light;
  //padding: 1em;
  //
  //p {
  //  @include font;
  //}

  justify-content: space-between;
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  svg {
    width: 70px;
  }
}

.deleting {
  border-color: red;
}
</style>
