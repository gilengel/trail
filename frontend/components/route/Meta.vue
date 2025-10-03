<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card
          class="mx-xxl-auto mx-xl-auto mx-9 w-fill c-inline-size"
          variant="outlined"
        >
          <v-card-item>
            <v-card-title>{{ route.name }}</v-card-title>
          </v-card-item>

          <v-card-text>
            <Map
              :segments="mapSegments"
              :interactive="false"
              v-if="mapSegments.length > 0"
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn
              color="medium-emphasis"
              icon="las la-trash-alt"
              @click="confirmDeletion = true"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="confirmDeletion"
      width="auto"
      persistent
    >
      <v-card
        max-width="400"
        prepend-icon="las la-trash-alt"
        text="Please confirm that you want to delete the trip. This action is permanent and cannot be undone."
        title="Confirm Delete Trip"
      >
        <template #actions>
          <v-btn @click="confirmDeletion = false">
            Cancel
          </v-btn>
          <v-btn
            class="ms-auto"
            text="Permanently Delete"
            @click="deleteRoute()"
          />
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {useDelete} from "~/composables/useDelete";
import {RouteSegmentDto2MapLibreRouteSegment} from "~/types/route";
import type {RouteDto} from "~/types/dto";

interface Props {
  route: RouteDto
}

const props = defineProps<Props>();

const mapSegments = computed(() => {
  if (!props.route.segments) {
    return [];
  }

  return props.route.segments.map((segment) => RouteSegmentDto2MapLibreRouteSegment(segment));
});

const emit = defineEmits(['deleted']);

const confirmDeletion = ref(false);

async function deleteRoute() {
  try {
    await useDelete(`/api/routes/${props.route.id}`);
    confirmDeletion.value = false;

    emit('deleted', props.route.id);
  } catch (e) {
    console.log(e);
  }
}
</script>

<style scoped lang="scss">

</style>