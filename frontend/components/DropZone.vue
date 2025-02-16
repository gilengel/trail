<template>
  <IconForm icon="las la-map-signs">
    <div
        class="v-input-collapse pa-6 d-flex flex-column"
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

      <v-list v-if="files.length > 0" data-cy="preview-container">
        <v-list-item
            v-for="(file, index) in files"
            :key="file.name"
            :value="index"
            color="primary"
            rounded="xl"
        >
          <template v-slot:append>
            <v-icon icon="las la-trash-alt"></v-icon>
          </template>

          <v-list-item-title>
            <TMap :trip="file.route" :interactive="false"/>
          </v-list-item-title>
        </v-list-item>
      </v-list>


    </div>
  </IconForm>
</template>

<script setup lang="ts">
import {extractCoordinatesFromGPX, type GPXRoute} from "shared";
import {Buffer} from 'buffer';
import {gpxRoute2MapLibreTrip, MapLibreTrip, type TripDto, TripDto2MapLibreTrip} from "~/types/route";

interface Props {
  allowedFileExtensions?: string[];
  supportText?: string;
}

const {allowedFileExtensions = [], supportText = "Support Text"} = defineProps<Props>();

const emit = defineEmits<(e: "onFilesChanged", files: File[]) => void>();

const isDragging: Ref<boolean> = ref(false);
const isWrongFileType: Ref<boolean> = ref(false);

interface GPXFile extends File {
  route: MapLibreTrip;
}

const files: Ref<GPXFile[]> = ref([]);

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

async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * @param e
 */
async function drop(e: DragEvent) {
  if (!e.dataTransfer?.files) {
    return;
  }

  e.preventDefault();
  const gpxFiles = Array.from(e.dataTransfer.files) as GPXFile[];
  for (const file of gpxFiles) {

    const found = allowedFileExtensions.find((extension) => {
      return file.name.endsWith(`.${extension}`);
    });


    // extract and extend the file so that we can display the route
    const buffer = await fileToBuffer(file);
    const gpxRoute = extractCoordinatesFromGPX(buffer);
    file.route = gpxRoute2MapLibreTrip(gpxRoute);


    isDragging.value = false;

    if (!found && allowedFileExtensions.length > 0) {
      console.log(`${file.name} is not from allowed type`);
      isWrongFileType.value = true;
      setTimeout(() => {
        isWrongFileType.value = false;
      }, 3000);

      console.log(":(");
      return;
    }


    files.value.push(file as GPXFile);

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
