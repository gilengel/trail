<template>Heading
  <BuilderPropertiesContainer>
    <template v-slot:title>
      Image Properties
    </template>

    <template v-slot:properties>
      <h2>Aspect Ratio</h2>
      <div class="aspect-ratios border pa-4">
        <div
            v-for="(ratio, i) in aspectRatios"
            :key="i"
            class="ratio-container"
        >
          <v-responsive :aspect-ratio="ratio.value"
                        :class="['border', props.element.attributes.aspectRatio === ratio.value ? 'selected' : '']"
                        @click="onAspectRatioChanged(ratio.value)">
            <div class="ratio-content">
              <strong>{{ ratio.label }}</strong>
            </div>
          </v-responsive>
        </div>
      </div>

      <h2>Scaling</h2>
      <div>
        <v-row>
          <v-col>
            <v-slider v-model="scaleValue" min="0.125" max="2"></v-slider>
            <v-number-input v-model="scaleValue" :precision="2"></v-number-input>
          </v-col>
        </v-row>

      </div>

      <h2>Size</h2>
      <v-col
          class="py-2"
          cols="12"
          sm="6"
      >
        <v-btn-toggle v-model="imageSizeType">
          <v-btn :value="ImageSize.FitHorizontally">
            <v-icon>las la-arrows-alt-h</v-icon>
          </v-btn>

          <v-btn :value="ImageSize.FitVertically">
            <v-icon>las la-arrows-alt-v</v-icon>
          </v-btn>

          <v-btn :value="ImageSize.Free">
            <v-icon>las la-vector-square</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>

      <h2>Position</h2>
      <v-col
          class="py-2"
          cols="12"
          sm="6"
      >
        <v-btn-toggle v-model="imagePositionMode">
          <v-btn :value="ImagePosition.Free">
            <v-icon>las la-arrows-alt</v-icon>
          </v-btn>

          <v-btn :value="ImagePosition.Centered">
            <v-icon>las la-compress-arrows-alt</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </template>
  </BuilderPropertiesContainer>
</template>

<script setup lang="ts">
import type {ElementProps} from "~/components/builder/properties";
import {ImagePosition, type ImageProps, ImageSize} from "~/components/builder/elements/image/Props";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<ElementProps<ImageProps>>();

// ---------------------------------------------------------------------------------------------------------------------

const gridModuleStore = useGridStore();

// - IMAGE POSITION MODE -----------------------------------------------------------------------------------------------

const imagePositionMode = ref<ImagePosition>(
    props.element.attributes.positionType ?? ImagePosition.Free
)

watch(
    () => props.element.attributes.positionType,
    (newVal) => {
      if (newVal !== imagePositionMode.value) {
        imagePositionMode.value = newVal
      }
    }
)

watch(
    imagePositionMode,
    (newMode) => {
      if (newMode !== props.element.attributes.positionType) {
        gridModuleStore.updateElementAttribute(
            props.element,
            'positionType',
            newMode
        )
      }
    }
)

// - IMAGE SIZE MODE ---------------------------------------------------------------------------------------------------

const imageSizeType = ref<ImageSize>(
    props.element.attributes.sizeType ?? ImageSize.Free
)

watch(
    () => props.element.attributes.sizeType,
    (newSizeType) => {
      if (newSizeType !== imageSizeType.value) {
        imageSizeType.value = newSizeType
      }
    }
)

watch(
    imageSizeType,
    (newMode) => {
      if (newMode !== props.element.attributes.sizeType) {
        gridModuleStore.updateElementAttribute(
            props.element,
            'sizeType',
            newMode
        )
      }
    }
)

// ---------------------------------------------------------------------------------------------------------------------

const scaleValue = computed({
  get() {
    return props.element.attributes.scale.value;
  },
  set(newScale) {
    let scale = props.element.attributes.scale;
    if (scale === undefined) {
      scale = {origin: {x: 0, y: 0}, value: 0}
    } else {
      scale.value = newScale;
    }

    gridModuleStore.updateElementAttribute(props.element, "scale", scale)
  }
});

// ---------------------------------------------------------------------------------------------------------------------

const aspectRatios = [
  {label: '3:2', value: 3 / 2},
  {label: '4:3', value: 4 / 3},
  {label: '5:4', value: 5 / 4},
  {label: '16:10', value: 16 / 10},
  {label: '16:9', value: 16 / 9},
  {label: '1:0.85', value: 1 / 0.85},
  {label: '2.35:1', value: 2.35},
]

function onAspectRatioChanged(newAspectRatio: number) {
  gridModuleStore.updateElementAttribute(props.element, "aspectRatio", newAspectRatio)
}

</script>

<style scoped lang="scss">
$aspectWidth: 140px;

.aspect-ratios {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax($aspectWidth, 1fr));
  gap: 16px;
  width: 100%;
}

.ratio-container {
  width: 100%;
}

.ratio-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
}

.ratio-content:hover {
  cursor: pointer;
}

$primary: rgb(var(--v-theme-primary));
.selected {
  border: 2px solid $primary !important;
  color: $primary; /* ensures text contrast */
}
</style>