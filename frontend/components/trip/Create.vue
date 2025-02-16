<template>
  <v-card
    title="Create new trip"
    variant="outlined"
  >
    <v-card-text>
      <v-text-field
        label="Trip Name"
        variant="outlined"
        @value-changed="routeNameChanged"
      />
      <span
        v-if="status"
        data-cy="status-msg"
      >{{ status }}</span>
    </v-card-text>
    <v-card-actions>
      <v-btn
        variant="outlined"
        data-cy="upload-btn"
        @click="upload"
      >
        Create
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import {useUpload} from "~/composables/useUpload";

const status: Ref<string> = ref("");

const routeName: Ref<string> = ref("");


/**
 *
 */
async function upload() {
  await useUpload('/api/trips', {
    name: routeName.value,
    layout: {}
  });
}

/**
 * @param newValue
 */
function routeNameChanged(newValue: string) {
  routeName.value = newValue;
}
</script>

<style scoped lang="scss">

</style>