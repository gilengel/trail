<template>
  <v-sheet class="pa-2 ma-2 rounded-sm">
    <v-card variant="flat">
      <template
          #title
          v-if="props.title"
      >
        {{ props.title }}
      </template>
      <slot/>
    </v-card>
  </v-sheet>
</template>
F
<script setup lang="ts">
interface Props {
  title?: string
}

const props = defineProps<Props>();
</script>