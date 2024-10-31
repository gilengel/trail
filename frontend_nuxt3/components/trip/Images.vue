<template>
  <div v-if="images.length === 0">
    <h1>😞 No Pictures</h1>
    <p>Such a great trip deserves some awesome pictures. Don't you think? </p>
    <p>Help others by uploading your pictures here</p>
  </div>
  <div v-else data-cy="trip-images" class="trip-images">

    <div v-for="image in images" :key="image.id">
      <img
        data-cy="single-image"
        :src="`${config.public.baseURL}/${image.url}`"
        :alt="`trip ${image.name}`"
      />
    </div>

    <span v-if="imagesHiddenCount > 0">{{ imagesHiddenCount }}+</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import type { ImageDto } from "~/data/images/types";
import type { MapLibreSegment } from "~/data/routes/types";

interface TripImagesProps {
  segment: MapLibreSegment;
}

const numberOfVisibleImages = 5;
const images: Ref<ImageDto[]> = ref([]);
const imagesHiddenCount: Ref<number> = ref(0);
const props = defineProps<TripImagesProps>();

const config = useRuntimeConfig();

onMounted(async () => {
  console.log(props.segment.id);
  const totalImages: number = await $fetch(`images/route_segment/number`, {
    baseURL: config.public.baseURL,
    method: "GET",
    params: {
      routeSegmentId: props.segment.id,
      maxOffset: 1,
    },
  });

  imagesHiddenCount.value = totalImages - numberOfVisibleImages;
  images.value = await $fetch(`images/route_segment`, {
    baseURL: config.public.baseURL,
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

.div1 {
  grid-area: 1 / 1 / 3 / 2;
}

.div2 {
  grid-area: 1 / 2 / 2 / 3;
}

.div3 {
  grid-area: 1 / 3 / 2 / 4;
}

.div4 {
  grid-area: 2 / 2 / 3 / 3;
}

.div5 {
  grid-area: 2 / 3 / 3 / 4;
}
</style>
