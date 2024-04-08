<template>
  <div data-cy="trip-images" class="trip-images tborder-radius">
    <div v-for="image in images" :key="image.id">
      <img :src="image.url" :alt="image.name" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useImageStore } from '@/stores/image'
import type { ImageDto } from '@/stores/image/types'
import { LeafletSegment } from '@/stores/route/types'
import { onMounted, ref, type Ref } from 'vue'

const imageStore = useImageStore()

let images: Ref<ImageDto[]> = ref([])

const props = defineProps({
  segment: {
    type: LeafletSegment,
    required: true
  }
})

/*
onMounted(async () => {
  imageStore
    .getImagesNearRouteSegment(props.segment, 1)
    .then((e) => {
      images.value = e
    })
    .catch((e) => console.log('hm'))
})
*/
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
