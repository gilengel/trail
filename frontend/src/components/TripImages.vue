<template>
  <div data-cy="trip-images" class="trip-images tborder-radius">
    <div v-for="image in images" :key="image.id">
      <img data-cy="single-image" :src="image.url" :alt="`trip image ${image.name}`" />
    </div>

    <span v-if="imagesHiddenCount > 0">{{ imagesHiddenCount }}+</span>
  </div>
</template>

<script setup lang="ts">
import { useImageStore } from '@/stores/image'
import type { ImageDto } from '@/stores/image/types'
import { LeafletSegment } from '@/stores/route/types'
import { onMounted, ref, type Ref } from 'vue'

const imageStore = useImageStore()

interface TripImagesProps {
  segment: LeafletSegment
}

const numberOfVisibleImages = 5
const images: Ref<ImageDto[]> = ref([])
const imagesHiddenCount: Ref<number> = ref(0)
const props = defineProps<TripImagesProps>()

onMounted(async () => {
  const totalImages = await imageStore.getNumberOfImagesNearRouteSegment(props.segment, 1)
  imagesHiddenCount.value = totalImages - numberOfVisibleImages
  images.value = await imageStore.getImagesNearRouteSegment(
    props.segment,
    1,
    imagesHiddenCount.value > 0 ? numberOfVisibleImages : undefined
  )
  // TODO: Show sad smiley or similar with error message
})
</script>

<style scoped lang="scss">
.trip-images {
  $gap: 8px;
  height: 400px + $gap;

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
  font-family: 'Amatic SC', cursive;
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
