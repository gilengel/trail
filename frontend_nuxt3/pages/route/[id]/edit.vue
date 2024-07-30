<template>
  <FormsSingleLineText
    :value="trip?.name"
    @value-changed="routeNameChanged"
    :validation="{
      func: (value: String) => {
        console.log(value.length > 0);
        return value.length > 0;
      },
      invalidText: 'Name cannot be empty.',
    }"
    support-text="Trip Name"
  />

  <FormsSingleLineText
    :value="trip?.description"
    @value-changed="routeDescriptionChanged"
    support-text="Trip Description"
  />

  <DropZone
    :allowed-file-extensions="['jpg', 'jpeg', 'tif', 'tiff']"
    @onFilesChanged="onFilesChanged"
  ></DropZone>

  <div class="btn-container">
    <FormsTButton data-cy="button-save" label="Save" @click="save"
      ><TIcon icon="save"
    /></FormsTButton>
  </div>

  <template v-if="errorDialogData">
    <ErrorMessage :title="errorDialogData.title">
      {{ errorDialogData.message }}
    </ErrorMessage>
  </template>
</template>

<script setup lang="ts">
import type { MapLibreTrip } from "~/data/routes/types";

const trip: MapLibreTrip = inject("trip") as MapLibreTrip;

const config = useRuntimeConfig();
const route = useRoute();

const status: Ref<String> = ref("");

const changedRouteData: Ref<{
  name?: string;
  description?: string;
  images?: File[];
}> = ref({});
const errorDialogData: Ref<{ title: string; message: string } | null> =
  ref(null);

async function saveRoute() {
  await $fetch(`/routes/${trip.id}`, {
    baseURL: config.public.baseURL,
    method: "PATCH",
    body: changedRouteData.value,
  });
}

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
function routeNameChanged(newValue: string) {
  if (newValue === "") {
    console.log("Invalid value: name cannot be null");
    return;
  }

  changedRouteData.value.name = newValue;
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
</script>
