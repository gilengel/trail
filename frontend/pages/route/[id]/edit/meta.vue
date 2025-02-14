<template>
  <main>
    <NuxtLayout name="page">
      <template #primary-toolbar>
        <v-list>
          <v-list-item
            color="primary"
            rounded="xl"
            prepend-icon="las la-arrow-left"
            @click="$router.push({ path: 'feed' })"
          />
        </v-list>
      </template>

      <template #content>
        <v-form @submit.prevent="saveChangesToRoute">
          <v-card
            class="mx-xxl-auto mx-xl-auto mx-9 w-fill c-inline-size"
            variant="outlined"
          >
            <v-card-item>
              <v-card-title>Edit</v-card-title>
            </v-card-item>

            <v-card-text>
              <v-text-field
                v-model="changedRouteData.name"
                :rules="[rules.required, rules.counter]"
                :readonly="false"
                class="mb-2"
                label="Trip Name"
                prepend-icon="las la-tag"
                clearable
              />

              <div class="d-flex align-center">
                <v-icon
                  icon="las la-camera"
                  size="large"
                  class="mr-3"
                />
                <DropZone
                  :allowed-file-extensions="[&quot;jpg&quot;, &quot;jpeg&quot;, &quot;png&quot;]"
                  @on-files-changed="onFilesChanged"
                >
                  class="flex-grow-1 flex-shrink-0">
                  <template #container="{ files }">
                    <v-row>
                      <v-col
                        v-for="(file, index) in files"
                        :key="index"
                        class="d-flex child-flex"
                        cols="4"
                      >
                        <v-img
                          :width="200"
                          :src="createTempImage(file)"
                          :aspect-ratio="4 / 3"
                          cover
                        />
                      </v-col>
                    </v-row>
                  </template>
                </DropZone>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="success"
                size="large"
                type="submit"
                variant="elevated"
                block
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </template>
    </NuxtLayout>
  </main>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import {useObjectUrl} from '@vueuse/core'
import type {MapLibreTrip} from "~/types/route";

const trip: MapLibreTrip = inject("trip") as MapLibreTrip;

const router = useRouter();
const route = useRoute();

/**
 * @param image
 */
function createTempImage(image: File): string {
  if (import.meta.client) {
    const url = useObjectUrl(image)

    return url.value as string;
  }

  return "";
}

const changedRouteData: Ref<{
  name?: string;
  description?: string;
  images?: File[];
}> = ref({name: trip.name, description: trip.description, images: []});

/**
 *
 */
async function saveChangesToRoute() {
  saveRoute();
  await saveRouteImages();
}


/**
 *
 */
function saveRoute() {

  $fetch(`/api/routes/${trip.id}`, {
    method: "PATCH",
    body: changedRouteData.value,
  }).then(() => {
    router.push(`/route/${route.params.id}/feed`);
  }).catch(() => {

  })
}

const rules = {
  required: (value: string) => !!value || 'Required.',
  counter: (value: string) => value.length <= 20 || 'Max 20 characters',
}

/**
 * @param images
 */
async function onFilesChanged(images: File[]) {
  changedRouteData.value.images = images;
}

/**
 *
 */
async function saveRouteImages() {
  if (!changedRouteData.value.images) {
    return;
  }

  const formData = new FormData();

  for (let i = 0; i < changedRouteData.value.images.length; ++i) {
    formData.append(`files`, changedRouteData.value.images[i]);
  }

  await $fetch(`/api/images`, {
    method: "POST",
    body: formData,
  }).catch((error) => {
    if (error.statusCode == 400) {
      /*
      errorDialogData.value = {
        title: "Missing geoinformations in one or more images",
        message:
            "Please make sure that all your images have geoinformation - we need these\n" +
            "informations to correctly locate the image on your trip. Check your\n" +
            "smartphones manual for instructions how to enable them.",
      };
      */
    }
  });
}

/*

import {InputEvent} from "happy-dom";




const route = useRoute();

const status: Ref<String> = ref("");



const errorDialogData: Ref<{ title: string; message: string } | null> =
  ref(null);





async function routeDescriptionChanged(newDescription: string) {
  if (newDescription === "") {
    return;
  }

  changedRouteData.value.description = newDescription;
}


*/
</script>
