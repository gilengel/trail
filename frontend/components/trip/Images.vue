<template>
  <BuilderElementsImageGallery
    :images="[
      {
        url: 'https://picsum.photos/id/70/400/300',
        name: '',
        id: '0',
        timestamp: new Date(),
        coordinates: [],
      },
      {
        url: 'https://picsum.photos/id/71/400/600',
        name: '',
        id: '0',
        timestamp: new Date(),
        coordinates: [],
      },
      {
        url: 'https://picsum.photos/id/72/400/300',
        name: '',
        id: '0',
        timestamp: new Date(),
        coordinates: [],
      },
      {
        url: 'https://picsum.photos/id/73/400/300',
        name: '',
        id: '0',
        timestamp: new Date(),
        coordinates: [],
      },
      {
        url: 'https://picsum.photos/id/74/400/300',
        name: '',
        id: '0',
        timestamp: new Date(),
        coordinates: [],
      },
      {
        url: 'https://picsum.photos/id/75/400/300',
        name: '',
        id: '0',
        timestamp: new Date(),
        coordinates: [],
      },
      {
        url: 'https://picsum.photos/id/76/400/300',
        name: '',
        id: '0',
        timestamp: new Date(),
        coordinates: [],
      },
      {
        url: 'https://picsum.photos/id/77/400/300',
        name: '',
        id: '0',
        timestamp: new Date(),
        coordinates: [],
      },
      {
        url: 'https://picsum.photos/id/78/400/300',
        name: '',
        id: '0',
        timestamp: new Date(),
        coordinates: [],
      },
      {
        url: 'https://picsum.photos/id/79/400/300',
        name: '',
        id: '0',
        timestamp: new Date(),
        coordinates: [],
      },
      {
        url: 'https://picsum.photos/id/80/400/300',
        name: '',
        id: '0',
        timestamp: new Date(),
        coordinates: [],
      },
      {
        url: 'https://picsum.photos/id/81/400/300',
        name: '',
        id: '0',
        timestamp: new Date(),
        coordinates: [],
      },
      {
        url: 'https://picsum.photos/id/82/400/300',
        name: '',
        id: '0',
        timestamp: new Date(),
        coordinates: [],
      },
      {
        url: 'https://picsum.photos/id/83/400/300',
        name: '',
        id: '0',
        timestamp: new Date(),
        coordinates: [],
      },
    ]"
    :cols="3"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import type { ImageDto } from "~/types/dto";
import type { MapLibreSegment } from "~/types/route";

interface TripImagesProps {
  segment: MapLibreSegment;
}

const props = defineProps<TripImagesProps>();
const numberOfVisibleImages = 5;
const images: Ref<ImageDto[]> = ref([]);
const imagesHiddenCount: Ref<number> = ref(0);
const config = useRuntimeConfig();

onMounted(async () => {
  const totalImages: number = await $fetch(`/api/images/route_segment/number`, {
    baseURL: config.public.baseURL as string,
    method: "GET",
    params: {
      routeSegmentId: props.segment.id,
      maxOffset: 1,
    },
  });

  imagesHiddenCount.value = totalImages - numberOfVisibleImages;
  images.value = await $fetch(`/api/images/route_segment`, {
    baseURL: config.public.baseURL as string,
    method: "GET",
    params: {
      routeSegmentId: props.segment.id,
      maxOffset: 1,
      maxNumberOfImages:
        imagesHiddenCount.value > 0 ? numberOfVisibleImages : undefined,
    },
  });

  // TODO: Show sad smiley or similar with error message
});
</script>

<style scoped lang="scss">
h1 {
  text-align: center;
  vertical-align: center;
}

.trip-images {
  $gap: 8px;
  height: 400px + $gap;

  border: solid 2px black;

  display: grid;
  grid-template-columns: 2fr repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 8px;
  grid-row-gap: 8px;
}

div {
  overflow: hidden;
}

span {
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 4em;
  font-family: "Amatic SC", cursive;
}
</style>
