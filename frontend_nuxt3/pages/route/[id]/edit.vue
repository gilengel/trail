<template>

  <v-card class="mx-xxl-auto mx-xl-auto mx-9 w-fill c-inline-size" variant="outlined">
    <v-card-item>
      <v-card-title>Edit</v-card-title>
    </v-card-item>

    <v-card-text>


    <v-form
        @submit.prevent="saveRoute"
    >

      <v-text-field
          v-model="changedRouteData.name"
          :rules="[rules.required, rules.counter]"
          :readonly="false"
          class="mb-2"
          label="Trip Name"
          prepend-icon="mdi-tag-text"
          clearable
      ></v-text-field>

      <v-file-input
          label="Trip Images"
          prepend-icon="mdi-camera"
          variant="filled"
      ></v-file-input>

      <v-btn
          color="success"
          size="large"
          type="submit"
          variant="elevated"
          block
      >
        Save
      </v-btn>
    </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { MapLibreTrip } from "~/data/routes/types";

const trip: MapLibreTrip = inject("trip") as MapLibreTrip;

const config = useRuntimeConfig();

const router = useRouter();
const route    = useRoute();


const changedRouteData: Ref<{
  name?: string;
  description?: string;
  images?: File[];
}> = ref({ name: trip.name, description: trip.description, images: []});

function saveRoute() {

  $fetch(`/routes/${trip.id}`, {
    baseURL: config.public.baseURL,
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




/*

import {InputEvent} from "happy-dom";




const route = useRoute();

const status: Ref<String> = ref("");



const errorDialogData: Ref<{ title: string; message: string } | null> =
  ref(null);


async function saveRouteImages() {
  if (!changedRouteData.value.images) {
    return;
  }

  const formData = new FormData();

  for (let i = 0; i < changedRouteData.value.images.length; ++i) {
    formData.append(`files`, changedRouteData.value.images[i]);
  }

  await $fetch(`/images`, {
    baseURL: config.public.baseURL,
    method: "POST",
    body: formData,
  }).catch((error) => {
    if (error.statusCode == 400) {
      errorDialogData.value = {
        title: "Missing geoinformations in one or more images",
        message:
          "Please make sure that all your images have geoinformation - we need these\n" +
          "informations to correctly locate the image on your trip. Check your\n" +
          "smartphones manual for instructions how to enable them.",
      };
    }
  });
}
async function save() {
  saveRoute();
  saveRouteImages();
}


async function routeDescriptionChanged(newDescription: string) {
  if (newDescription === "") {
    return;
  }

  changedRouteData.value.description = newDescription;
}

async function onFilesChanged(images: File[]) {
  changedRouteData.value.images = images;
}
*/
</script>
