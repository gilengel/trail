<template>

  <main>

    <NuxtLayout name="page">
      <template #primary-toolbar>
        <v-list
            density="compact"
            nav
        >
          <v-list-item
              color="primary"
              rounded="xl"
              prepend-icon="las la-arrow-left"
              @click="$router.push({ path: '/' })"
              style="max-width: 200px; width: 100%;"
          />
        </v-list>
      </template>

      <template #toolbar>
        <v-list
            density="compact"
            nav
        >
          <v-list-item

              color="primary"
              rounded="xl"
              prepend-icon="las la-desktop"
              @click="$router.push({ path: 'edit/desktop' })"
          />

          <v-list-item
              color="primary"
              rounded="xl"
              prepend-icon="las la-tablet"
              @click="$router.push({ path: 'edit/tablet' })"
          />

          <v-list-item
              color="primary"

              rounded="xl"
              prepend-icon="las la-mobile"
              @click="$router.push({ path: 'edit/mobile' })"
          />
        </v-list>
        <v-divider class="mx-3 my-5"/>
        <v-list
            density="compact"
            nav
        >
          <v-list-item
              color="primary"
              rounded="xl"
              prepend-icon="las la-pencil-alt"
              @click="$router.push({ path: 'edit/meta' })"
          />
        </v-list>
        <v-divider class="mx-3 my-5"/>
        <v-list
            density="compact"
            nav
        >
          <v-list-item
              color="primary"
              rounded="xl"
              prepend-icon="las la-trash-alt"
              @click="dialog = true"
          />
        </v-list>
      </template>

      <template
          #content
          v-if="trip"
      >
        {{ trip.grid }}
      </template>
    </NuxtLayout>

    <v-dialog
        v-model="dialog"
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
          <v-btn @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn
              class="ms-auto"
              text="Permanently Delete"
              @click="deleteTrip()"
          />
        </template>
      </v-card>
    </v-dialog>
  </main>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {useTripStore} from "~/stores/trip";

const router = useRouter();

const route = useRoute();

const tripStore = useTripStore();
const trip = await tripStore.get(Number(route.params.id));

function deleteTrip() {
  tripStore.remove(trip!).then(() => {
    router.push('/')
  }).catch((e) => console.error(e));
}

const dialog = ref(false);
</script>

