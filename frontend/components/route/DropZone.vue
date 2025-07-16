<template>
  <DropZone
      @on-files-changed="(files) => $emit('onFilesChanged', files)"
      :processor="extractTrackFromFile"
  >
    <template #item="{ item, index }">
      <v-list-item-title>
        <v-container>
          <v-row no-gutters>
            <v-col
                cols="4"
                style="container-type: inline-size"
            >
              <TMap
                  :trip="item.route"
                  :interactive="false"
              />
            </v-col>

            <v-col
                cols="8"
                class="pl-4"
            >
              <v-row
                  no-gutters
                  justify="space-between"
              >
                <v-col cols="12">
                  <v-text-field
                      v-model="segmentName[index]"
                      label="Segment Name"
                      prepend-icon="las la-tag"
                      variant="outlined"
                      @keyup="() => segmentNameChanged(index)"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                      v-model="segmentDescription[index]"
                      class="mb-0"
                      label="Description"
                      prepend-icon="las la-comment"
                      rows="5"
                      variant="outlined"
                      @keyup="() => segmentDescriptionChanged(index)"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-list-item-title>
    </template>
  </DropZone>
</template>

<script setup lang="ts">
import {gpxRoute2MapLibreTrip} from "~/types/route";
import {Buffer} from "buffer";
import type {GPXFile} from "~/types/gpx";
import {extractCoordinatesFromGPX} from "~/types/dto/convert";

const emit = defineEmits<{
  onFilesChanged: [files: GPXFile[]],
  onSegmentNameChanged: [index: number, name: string],
  onSegmentDescriptionChanged: [index: number, name: string]
}>();

const segmentName = ref([]);
const segmentDescription = ref([]);

function segmentNameChanged(index: number): void {
  emit("onSegmentNameChanged", index, segmentName.value[index]);
}

function segmentDescriptionChanged(index: number): void {
  emit("onSegmentDescriptionChanged", index, segmentDescription.value[index]);
}

async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function extractTrackFromFile(file: GPXFile) {
  const buffer = await fileToBuffer(file);
  const gpxRoute = extractCoordinatesFromGPX(buffer);

  file.routeDto = gpxRoute;
  file.route = gpxRoute2MapLibreTrip(gpxRoute)
}
</script>

<style scoped lang="scss">

</style>