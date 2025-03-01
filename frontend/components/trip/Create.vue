<template>
  <v-card
    title="Create new trip"
    variant="outlined"
  >
    <v-card-text>
      <TextField
        v-model="routeName"
        label="Trip Name"
      />
      <span
        v-if="status"
        data-cy="status-msg"
      >{{ status }}</span>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
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
import {createDefaultGrid} from "~/stores/grid";

const tripStore = useTripStore();

const status: Ref<string> = ref("");

const routeName: Ref<string> = ref("");


/**
 *
 */
async function upload() {
  await tripStore.create({name: routeName.value, layout: createDefaultGrid(0)})
}

</script>

<style scoped lang="scss">

</style>