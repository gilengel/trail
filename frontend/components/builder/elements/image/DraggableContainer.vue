<template>
  <div
      ref="container"
      class="draggable-container"
      @mousedown="startDrag"
      @wheel.prevent="onWheel"
      :style="{ position: 'absolute' }"
  >
    <img
        ref="image"
        class="zoom-image"
        :style="imageStyle"
        :src="source"
        draggable="false"
        alt="image"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch, type CSSProperties} from 'vue'
import type {Point2D} from '~/types/point'
import {ImagePosition, type ImageProps, ImageSize} from '~/components/builder/elements/image/Props'

// - PROPS --------------------------------------------------------------------------------------------------------------

interface DraggableContainerProps extends ImageProps {
  enabled?: boolean
  source: string
  sizeType: ImageSize
}

const {
  enabled = true,
  scale = {origin: {x: 0, y: 0}, value: 1},
  sizeType = ImageSize.Free,
  position = {x: 0, y: 0},
  positionType = ImagePosition.Centered,
  source,
} = defineProps<DraggableContainerProps>()

// - EMITS -------------------------------------------------------------------------------------------------------------

const emit = defineEmits<{
  onImageScaleChange: [newScale: number, origin: Point2D]
  onImageSizeTypeChange: [newSizeType: ImageSize]
  onImagePositionChange: [newPosition: Point2D]
}>()

// - REFS- -------------------------------------------------------------------------------------------------------------

const container = ref<HTMLElement | null>(null)
const image = ref<HTMLImageElement | null>(null) // now a real <img> node

let isDragging = false
let offset: Point2D = {x: 0, y: 0}

// Compute CSS‐style for the <img>
const imageStyle = computed<CSSProperties>(() => {
  if (positionType === ImagePosition.Centered) {
    return {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: `translate(-50%, -50%) scale(${scale.value})`,
      // no transformOrigin needed for “centered” because translate(−50%,−50%) is used
    }
  } else {
    // “Free” panning mode
    return {
      position: 'relative',
      left: 'auto',
      top: 'auto',
      transform: `translate(${position.x}px, ${position.y}px) scale(${scale.value})`,
      transformOrigin: `${scale.origin.x}px ${scale.origin.y}px`,
    }
  }
})

/**
 * clampPosition():
 *   - Uses container’s size (width / height) and the image’s natural size × current scale
 *   - Computes acceptable [minX…maxX] and [minY…maxY]
 *   - Mutates state.position.x / y so that there is no “blank gap” shown.
 */
function clampPosition() {
  if (!container.value || !image.value) return

  const containerRect = container.value.getBoundingClientRect()
  const containerWidth = containerRect.width
  const containerHeight = containerRect.height

  const imageWidth = image.value.naturalWidth || image.value.width || 1
  const imageHeight = image.value.naturalHeight || image.value.height || 1

  const scaledWidth = imageWidth * scale.value
  const scaledHeight = imageHeight * scale.value

  let minX = 0, maxX = 0
  if (scaledWidth > containerWidth) {
    minX = containerWidth - scaledWidth
    maxX = 0
  }

  let minY = 0, maxY = 0
  if (scaledHeight > containerHeight) {
    minY = containerHeight - scaledHeight
    maxY = 0
  }

  position.x = Math.min(Math.max(position.x, minX), maxX)
  position.y = Math.min(Math.max(position.y, minY), maxY)
}

// - WATCHES -----------------------------------------------------------------------------------------------------------

watch(
    () => positionType,
    () => {
      if (positionType !== ImagePosition.Centered && container.value && image.value) {
        // “Grab” the on-screen rect of the <img> (already translated+scaled)
        const cRect = container.value.getBoundingClientRect()
        const iRect = image.value.getBoundingClientRect()

        // Convert that into a new position so that it does not jump
        position.x = iRect.left - cRect.left
        position.y = iRect.top - cRect.top
        // Immediately clamp—just in case the conversion pushed it outside
        clampPosition()
      }
    }
)

watch(
    () => sizeType,
    () => {
      if (!container.value || !image.value) return

      const containerRect = container.value.getBoundingClientRect()
      const containerWidth = containerRect.width
      const containerHeight = containerRect.height
      const imageWidth = image.value.naturalWidth || image.value.width || 1
      const imageHeight = image.value.naturalHeight || image.value.height || 1

      function updateScale(newScale: number) {

        scale.value = newScale
        scale.origin.x = 0
        scale.origin.y = 0
        position.x = 0
        position.y = 0
      }

      if (sizeType === ImageSize.FitHorizontally) {
        updateScale(containerWidth / imageWidth)

        clampPosition()
        emit('onImageSizeTypeChange', ImageSize.FitHorizontally)
      } else if (sizeType === ImageSize.FitVertically) {
        updateScale(containerHeight / imageHeight)

        clampPosition()
        emit('onImageSizeTypeChange', ImageSize.FitVertically)
      }
    }
)

// - DRAGGING ----------------------------------------------------------------------------------------------------------

const startDrag = (event: MouseEvent) => {
  if (!enabled) return

  event.preventDefault()
  isDragging = true

  if (container.value && image.value) {
    const cRect = container.value.getBoundingClientRect()
    const iRect = image.value.getBoundingClientRect()
    position.x = iRect.left - cRect.left
    position.y = iRect.top - cRect.top
    clampPosition()
  }

  offset.x = event.clientX - position.x
  offset.y = event.clientY - position.y

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event: MouseEvent) => {
  if (!enabled || !isDragging) return

  position.x = event.clientX - offset.x
  position.y = event.clientY - offset.y

  clampPosition()

  emit('onImagePositionChange', {...position})
}

const stopDrag = () => {
  if (!enabled) return

  isDragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// - ZOOMING -----------------------------------------------------------------------------------------------------------

function onWheel(event: WheelEvent) {
  if (!enabled || !container.value || !image.value) return
  event.preventDefault()

  const zoomFactor = 0.1
  const delta = -Math.sign(event.deltaY)
  scale.value = Math.min(4, Math.max(0.125, scale.value + delta * zoomFactor))

  scale.origin.x = position.x
  scale.origin.y = position.y

  clampPosition()

  emit('onImageScaleChange', scale.value, {...scale.origin})
}

</script>

<style lang="scss">
.draggable-container {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: grab;
  z-index: 1;
}

.zoom-image {
  user-select: none;
  transition: width 0.2s ease, height 0.2s ease;
  /* add border or any styling you like */
}
</style>
