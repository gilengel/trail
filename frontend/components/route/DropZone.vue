<template>
  <DropZone @onFilesChanged="(files) => $emit('onFilesChanged', files)" :processor="extractTrackFromFile">
    <template #item="{ item }">
      <v-list-item-title>
        <v-container>
          <v-row no-gutters>
            <v-col cols="4" style="container-type: inline-size">
              <TMap :trip="item.route" :interactive="false"/>
            </v-col>

            <v-col cols="8" class="pl-4">
              <v-row no-gutters justify="space-between">
                <v-col cols="12">
                  <v-text-field
                      label="Route Name"
                      prepend-icon="las la-tag"
                      variant="outlined"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                      class="mb-0"
                      label="Description"
                      prepend-icon="las la-comment"
                      rows="5"
                      variant="outlined"
                  ></v-textarea>
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
import {gpxRoute2MapLibreTrip, MapLibreTrip} from "~/types/route";
import {extractCoordinatesFromGPX, type GPXRoute} from "shared";
import {Buffer} from "buffer";
import type {GPXFile} from "~/types/gpx";

defineEmits<(e: "onFilesChanged", files: GPXFile[]) => void>();

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