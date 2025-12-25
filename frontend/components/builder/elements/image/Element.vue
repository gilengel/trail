<template>
  <v-responsive :aspect-ratio :class="['image-container']">
    <BuilderElementsImageDraggableContainer
      data-testid="element-img"
      :source="`https://fastly.picsum.photos/id/29/4000/2670.jpg?hmac=rCbRAl24FzrSzwlR5tL-Aqzyu5tX_PA95VJtnUXegGU`"
      :aspect-ratio="aspectRatio"
      :position="props.element.properties.position!"
      :position-type="props.element.properties.positionType"
      :scale="props.element.properties.scale"
      :size-type="props.element.properties.sizeType"
      :enabled="props.element.selected"
      @on-image-scale-change="onImageScaleChange"
      @on-image-position-change="onImagePositionChange"
      @on-image-size-type-change="onImageSizeTypeChange"
    />
  </v-responsive>
</template>

<script setup lang="ts">
import type { Point2D } from "~/types/point";
import {
  ImagePosition,
  ImageSize,
} from "~/components/builder/elements/image/Properties";
import { inject } from "vue";
import { EditorInjectionKey } from "@trail/grid-editor/editor";
import type { ImageElement } from "~/components/builder/elements/image/index";
import { UpdateElementAttribute } from "@trail/grid-editor/undoredo/actions/updateElementAttribute";
import type { EditorElementProperties } from "@trail/grid-editor/grid";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<EditorElementProperties<typeof ImageElement>>();

// ---------------------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey);

if (!editor && props.changeable) {
  throw new Error('Editor instance was not injected in element "Image"');
}

// ---------------------------------------------------------------------------------------------------------------------

const aspectRatio = computed(() => {
  if (props.element.properties.aspectRatio === undefined) {
    return 1.5;
  }

  return props.element.properties.aspectRatio;
});

// ---------------------------------------------------------------------------------------------------------------------

function onImageScaleChange(newScale: number, origin: Point2D) {
  editor?.executeAction(
    new UpdateElementAttribute<typeof ImageElement>(props.element, "scale", {
      origin,
      value: newScale,
    }),
  );
}

function onImagePositionChange(position: Point2D) {
  editor?.executeAction(
    new UpdateElementAttribute<typeof ImageElement>(
      props.element,
      "positionType",
      ImagePosition.Free,
    ),
  );
  editor?.executeAction(
    new UpdateElementAttribute<typeof ImageElement>(
      props.element,
      "position",
      position,
    ),
  );
}

function onImageSizeTypeChange(imageSizeType: ImageSize) {
  editor?.executeAction(
    new UpdateElementAttribute<typeof ImageElement>(
      props.element,
      "positionType",
      ImagePosition.Centered,
    ),
  );
  editor?.executeAction(
    new UpdateElementAttribute<typeof ImageElement>(
      props.element,
      "sizeType",
      imageSizeType,
    ),
  );
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
