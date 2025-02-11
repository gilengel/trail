<template>
  <main>
    <NuxtLayout name="page">
      <template #primary-toolbar>
        <v-list>
          <v-list-item
            color="primary"
            rounded="xl"
            prepend-icon="las la-arrow-left"
            @click="$router.push({ path: '/' })"
          />
        </v-list>
      </template>

      <template #toolbar>
        <v-list>
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
        <v-divider class="mx-3 my-5" />
        <v-list>
          <v-list-item
            color="primary"
            rounded="xl"
            prepend-icon="las la-pencil-alt"
            @click="$router.push({ path: 'edit/meta' })"
          />
        </v-list>
        <v-divider class="mx-3 my-5" />
        <v-list>
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
        <v-card
          v-if="trip?.segments.length"
          class="mx-xxl-auto mx-xl-auto mx-9 w-xxl-50 w-xl-50 w-fill c-inline-size"
          variant="outlined"
        >
          <v-card-item>
            <v-card-title>Elevation Profile</v-card-title>
          </v-card-item>

          <v-card-text>
            <ElevationProfile :segment="trip?.segments[0] as MapLibreSegment" />
          </v-card-text>
        </v-card>


        <v-card
          v-if="trip?.segments.length"
          class="mx-xxl-auto mx-xl-auto mx-9 w-xxl-50 w-xl-50 w-fill c-inline-size"
          variant="outlined"
        >
          <v-card-item>
            <v-card-title>Route</v-card-title>
          </v-card-item>

          <v-card-text>
            {{ trip?.description }}

            <TMap
              v-if="trip"
              :trip="trip"
            />

            <TripAspects
              :trip-is-loop="tripIsALoop"
              :trip-length="trip?.segments[0].length"
              :ascending="trip?.segments[0].accumulatedAscent"
              :descending="trip?.segments[0].accumulatedDescent"
            />
          </v-card-text>
        </v-card>


        <v-card
          v-for="segment in trip?.segments"

          :key="segment.id"
          class="mx-xxl-auto mx-9 w-xxl-50 w-fill"
          variant="outlined"
        >
          <v-card-item>
            <v-card-title>Image Gallery</v-card-title>
          </v-card-item>

          <v-card-text>
            <!--            <TripImages :segment="segment" /> -->
          </v-card-text>

          <v-card-actions>
            <v-list-item class="w-100">
              <template #prepend>
                <v-avatar
                  color="grey-darken-3"
                  image="https://randomuser.me/api/portraits/women/51.jpg"
                />
              </template>

              <v-list-item-title>Anne Traveler</v-list-item-title>

              <v-list-item-subtitle>@traveler</v-list-item-subtitle>

              <template #append>
                <div class="justify-self-end">
                  <v-icon
                    class="me-1"
                    icon="mdi-heart"
                  />
                  <span class="subheading me-2">256</span>
                  <span class="me-1">·</span>
                  <v-icon
                    class="me-1"
                    icon="mdi-share-variant"
                  />
                  <span class="subheading">45</span>
                </div>
              </template>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </template>

      <template #overview>
        <v-navigation-drawer
          v-if="trip"
          location="right"
          data-cy="page-overview"
        >
          <v-list>
            <v-list-item
              v-for="segment in trip?.segments"
              :key="segment.id"
              :title="segment.name"
              link
            />
          </v-list>
        </v-navigation-drawer>
      </template>
    </NuxtLayout>

    <v-dialog
      v-model="dialog"
      width="auto"
      persistent
    >
      <v-card
        max-width="400"
        prepend-icon="mdi-delete-alert-outline"
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
            @click="deleteRoute()"
          />
        </template>
      </v-card>
    </v-dialog>
  </main>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {MapLibreSegment} from "~/types/types";
import TMap from "~/components/TMap.vue";
import {useRouter} from "vue-router";
import ElevationProfile from "~/components/builder/elements/ElevationProfile.vue";
import {useTripStore} from "~/stores/trip";

const router = useRouter();

const route = useRoute();
const tripStore = useTripStore();
const trip = await tripStore.get(Number(route.params.id));

/**
 * Makes the call to the backup to delete a route.
 */
function deleteRoute() {


  useApiFetch(
      `/routes/${route.params.id}`,
      {
        method: "DELETE"
      }
  ).then(() => {
    router.push('/')
  }).catch((e) => console.error(e));
}

const dialog = ref(false);


const tripIsALoop = computed(() => {
  if (!trip) {
    return false;
  }

  if (trip.value?.segments.length == 0) {
    return false;
  }

  return (
      trip.value?.segments[0] ==
      trip.value?.segments[trip.value?.segments.length - 1]
  );
});

</script>

