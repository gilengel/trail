import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import type { ImageDto } from "./types";
import type { MapLibreSegment } from "../route/types";

const baseURL = (import.meta as any).env.VITE_API_ENDPOINT;

export const useImageStore = defineStore("image", () => {
  const networkError: Ref<Boolean> = ref(false);

  async function getImagesNearLocation(
    coordinate: L.LatLng,
    offset: number
  ): Promise<Ref<ImageDto[]>> {
    try {
      const { data } = await useFetch("/api/images/point", {
        query: {
          lon: coordinate.lng,
          lat: coordinate.lat,
          maxOffset: offset,
        },
      });

      return Promise.resolve(data as Ref<ImageDto[]>);
    } catch (error) {
      networkError.value = true;

      return Promise.reject(error);
    }
  }

  async function getNumberOfImagesNearRouteSegment(
    segment: MapLibreSegment,
    offset: number,
    maximumNumberOfImages?: number
  ): Promise<number> {
    if (!maximumNumberOfImages) {
      maximumNumberOfImages = 100;
    }

    const { data, error } = await useFetch<{ count: string }>(
      "/api/images/route_segment/number",
      {
        query: {
          routeSegmentId: segment.id,
          maxOffset: offset,
        },

        onResponseError({ request, response, options }) {
          if (response.status == 404) {
            return Promise.resolve(0);
          }

          networkError.value = true;

          //return Promise.reject(error);
        },
      }
    );

    return Promise.resolve(parseInt(data.value!.count));
  }
  async function getImagesNearRouteSegment(
    segment: MapLibreSegment,
    offset: number,
    maximumNumberOfImages?: number
  ): Promise<Ref<ImageDto[] | null>> {
    if (!maximumNumberOfImages) {
      maximumNumberOfImages = 100;
    }

    const { data } = await useFetch<ImageDto[]>("/api/images/route_segment", {
      query: {
        routeSegmentId: segment.id,
        maxOffset: offset,
        maxNumberOfImages: maximumNumberOfImages,
      },

      onResponseError({ request, response, options }) {
        // The backend is build to return a 404 if no images exist so we need to return an empty array
        // to not arise an error on browser side
        if (response.status == 404) {
          response._data.value = [];
          return;
        }

        networkError.value = true;
      },
      onResponse({ request, response, options }) {
        (response._data.value as ImageDto[]).forEach(
          (image) => (image.url = `${baseURL}/${image.url}`)
        );
      },
    });

    return Promise.resolve(data);
  }

  async function addImages(images: File[]) {
    const formData = new FormData();

    for (let i = 0; i < images.length; ++i) {
      formData.append(`files`, images[i]);
    }

    await $fetch("/api/images", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });
  }

  return {
    getImagesNearLocation,
    getNumberOfImagesNearRouteSegment,
    getImagesNearRouteSegment,
    addImages,
  };
});

export type ImageStore = ReturnType<typeof useImageStore>;
