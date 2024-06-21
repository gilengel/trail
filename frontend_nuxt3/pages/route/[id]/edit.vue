<template>
  <FormsSingleLineText
    :value="trip?.name"
    @value-changed="routeNameChanged"
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
    <FormsTButton
      data-cy="button-save"
      label="Save"
      @click="$router.push({ path: `../${route.params.id}/feed` })"
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
import type { MapLibreTrip } from "~/stores/route/types";

const trip: Ref<MapLibreTrip | null> = inject(
  "trip"
) as Ref<MapLibreTrip | null>;

const config = useRuntimeConfig();
const route = useRoute();

const status: Ref<String> = ref("");

const errorDialogData: Ref<{ title: string; message: string } | null> =
  ref(null);

async function routeNameChanged(newValue: string) {
  if (newValue === "") {
    console.log("Invalid value: name cannot be null");
    return;
  }

  const patchDTO = {
    name: newValue,
  };

  await $fetch(`/routes/${trip.value!.id}`, {
    baseURL: config.public.baseURL,
    method: "PATCH",
    body: patchDTO,
  });
}

async function routeDescriptionChanged(newDescription: string) {
  const patchDTO = {
    description: newDescription,
  };

  await useApiFetch(`/routes/${trip.value!.id}`, {
    method: "PATCH",
    body: patchDTO,
  });
}

async function onFilesChanged(images: File[]) {
  const formData = new FormData();

  for (let i = 0; i < images.length; ++i) {
    formData.append(`files`, images[i]);
  }

  try {
    await $fetch(`/images`, {
      baseURL: config.public.baseURL,
      method: "POST",
      body: formData,
    });
  } catch (e) {
    if (e.statusCode == 400) {
      errorDialogData.value = {
        title: "Missing geoinformations in one or more images",
        message:
          "Please make sure that all your images have geoinformation - we need these\n" +
          "informations to correctly locate the image on your trip. Check your\n" +
          "smartphones manual for instructions how to enable them.",
      };
    }
  }
}
</script>
