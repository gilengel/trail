<template>
  <BuilderPropertiesContainer
    :grid="props.grid"
    :id="props.element.instanceId"
    :properties="props.element.properties"
    :provided-properties="[]"
    :consumed-properties="[]"
  >
    <template #title>
      Heading Properties
    </template>

    <template #properties>
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
import type {HeadingProperties} from "~/components/builder/elements/heading/Properties";
import {inject} from "vue";
import {EditorInjectionKey} from "~/components/GridEditor/editor";
import type {EditorElementProperties} from "~/components/GridEditor/grid";
import {ElevationProfileElement} from "~/components/builder/elements/elevation_profile";
import type {HeadingElement} from "~/components/builder/elements/heading/index";
import {UpdateElementAttribute} from "~/stores/editor/actions/updateElementAttribute";

// ---------------------------------------------------------------------------------------------------------------------

const props = defineProps<EditorElementProperties<typeof HeadingElement>>();


// ---------------------------------------------------------------------------------------------------------------------

const editor = inject(EditorInjectionKey);

// ---------------------------------------------------------------------------------------------------------------------

const size = computed(() => props.element.properties.level);

/**
 * @param newValue
 */
function onSizeChange(newValue: number) {
  editor?.executeAction(new UpdateElementAttribute<typeof HeadingElement>(props.element, "level", newValue));
}

// ---------------------------------------------------------------------------------------------------------------------

const color = computed(() => props.element.properties.color);

/**
 * @param newValue
 */
function onColorChange(newValue: string) {
  editor?.executeAction(new UpdateElementAttribute<typeof HeadingElement>(props.element, "color", newValue));
}
</script>