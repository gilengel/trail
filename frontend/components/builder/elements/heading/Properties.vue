<template>
  <BuilderPropertiesContainer>

    <template v-slot:title>
      Heading Properties
    </template>

    <template v-slot:properties>
      <v-btn-toggle
          v-model="size"
          @update:model-value="onSizeChange"
      >
        <v-btn>
          H1
        </v-btn>

        <v-btn datatest-id="button-h2">
          H2
        </v-btn>

        <v-btn>
          H3
        </v-btn>

        <v-btn>
          H4
        </v-btn>
      </v-btn-toggle>

      <v-color-picker
          v-model="color"
          hide-inputs
          show-swatches
          @update:model-value="onColorChange"
      />
    </template>
  </BuilderPropertiesContainer>
</template>

<script setup lang="ts">
import type {ElementProps} from "~/components/builder/properties";

// ---------------------------------------------------------------------------------------------------------------------

interface Props {
  level: number,
  color: string,
  text?: string
}

const props = defineProps<ElementProps<Props>>();

// ---------------------------------------------------------------------------------------------------------------------

const gridModuleStore = useGridStore();

// ---------------------------------------------------------------------------------------------------------------------

const size = computed(() => props.element.attributes.level);

/**
 * @param newValue
 */
function onSizeChange(newValue: number) {
  gridModuleStore.updateElementAttribute(props.element, "level", newValue)
}

// ---------------------------------------------------------------------------------------------------------------------

const color = computed(() => props.element.attributes.color);

/**
 * @param newValue
 */
function onColorChange(newValue: string) {
  gridModuleStore.updateElementAttribute(props.element, "color", newValue)
}
</script>