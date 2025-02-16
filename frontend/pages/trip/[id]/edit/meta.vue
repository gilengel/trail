<template>
  <main>
    <NuxtLayout name="page">
      <template #primary-toolbar>
        <v-list>
          <v-list-item
              color="primary"
              rounded="xl"
              prepend-icon="las la-arrow-left"
              @click="$router.push({ path: '../feed' })"
          />
        </v-list>
      </template>

      <template #content>
        <v-form @submit.prevent="saveRoute">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-card
                    class="mx-xxl-auto mx-xl-auto mx-9 w-fill c-inline-size"
                    variant="outlined"
                >
                  <v-card-item>
                    <v-card-title>Edit</v-card-title>
                  </v-card-item>

                  <v-card-text>
                    <v-text-field
                        v-model="changedRouteData.name"
                        :rules="[rules.required, rules.counter]"
                        :readonly="false"
                        class="mb-2"
                        label="Trip Name"
                        prepend-icon="las la-tag"
                        clearable
                    />

                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <RouteAdd :trip-id="trip!.id"/>
              </v-col>
            </v-row>

            <RouteMeta v-for="route in routes" :key="route.name" :route @deleted="removeRoute"></RouteMeta>
          </v-container>
        </v-form>
      </template>
    </NuxtLayout>
  </main>
</template>

<script setup lang="ts">
import {useTripStore} from "~/stores/trip";
import type {TripDto} from "~/types/route";
import type {RouteDto} from "~/types/route.dto";

const route = useRoute();
const router = useRouter();

const tripStore = useTripStore();

const trip: TripDto | null = await tripStore.get(Number(route.params.id));

const routes: Ref<RouteDto[]> = ref(await getRoutes());

const changedRouteData: Ref<{
  name?: string;
}> = ref({name: trip!.name});


/**
 * Returns all with the current trip associated routes from the backend.
 */
async function getRoutes(): Promise<RouteDto[]> {
  return await $fetch(`/api/routes/trip/${trip?.id}`);
}

/**
 *
 */
function saveRoute() {
  $fetch(`/api/trips/${trip?.id}`, {
    method: "PATCH",
    body: changedRouteData.value,
  }).then(() => {
    router.push(`/trip/${route.params.id}/feed`);
  }).catch((e) => {
    console.log(e);
  })
}

function removeRoute(deletedRouteId: number) {
  routes.value = routes.value.filter(route => route.id !== deletedRouteId);
}

const rules = {
  required: (value: string) => !!value || 'Required.',
  counter: (value: string) => value.length <= 20 || 'Max 20 characters',
}

</script>
