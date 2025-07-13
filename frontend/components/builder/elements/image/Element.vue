<template>
  <v-responsive :aspect-ratio :class="['image-container']">
    <BuilderElementsImageDraggableContainer
        :source="`https://fastly.picsum.photos/id/29/4000/2670.jpg?hmac=rCbRAl24FzrSzwlR5tL-Aqzyu5tX_PA95VJtnUXegGU`"
        :aspect-ratio="aspectRatio"
        :position="props.element.attributes.position!"
        :position-type="props.element.attributes.positionType"
        :scale="props.element.attributes.scale"
        :size-type="props.element.attributes.sizeType"
        :enabled="props.selected"
        @onImageScaleChange="onImageScaleChange"
        @onImagePositionChange="onImagePositionChange"
        @onImageSizeTypeChange="onImageSizeTypeChange"
    ></BuilderElementsImageDraggableContainer>
  </v-responsive>
</template>

<script setup lang="ts">
import type {ElementProps} from "~/components/builder/properties";
import type {Point2D} from "~/types/point";
import {ImagePosition, type ImageProps, ImageSize} from "~/components/builder/elements/image/Props";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<ElementProps<ImageProps>>();

// ---------------------------------------------------------------------------------------------------------------------

const gridModuleStore = useGridStore();

// ---------------------------------------------------------------------------------------------------------------------

const aspectRatio = computed(() => {
  if (props.element.attributes.aspectRatio === undefined) {
    return 1.5;
  }

  return props.element.attributes.aspectRatio;
})

// ---------------------------------------------------------------------------------------------------------------------

function onImageScaleChange(newScale: number, origin: Point2D) {
  gridModuleStore.updateElementAttribute(props.element, "scale", {origin, value: newScale});
}

function onImagePositionChange(position: Point2D) {
  gridModuleStore.updateElementAttribute(props.element, "positionType", ImagePosition.Free)
  gridModuleStore.updateElementAttribute(props.element, "position", position as any as Record<string, unknown>)
}

function onImageSizeTypeChange(imageSizeType: ImageSize) {
  gridModuleStore.updateElementAttribute(props.element, "positionType", ImagePosition.Centered)
  gridModuleStore.updateElementAttribute(props.element, "sizeType", imageSizeType)
}
</script>

<style scoped lang="scss">
.image-container {
  position: relative;
  overflow: hidden;

  img {
    position: absolute;
    width: 100%;
  }
}
</style>