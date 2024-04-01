<template>
  <main class="tflex-row">
    <TToolbar>
      <TToolbarButton icon="arrow_back" @click="$router.push({ path: '/' })"></TToolbarButton>
      <TToolbarButton icon="add"></TToolbarButton>
    </TToolbar>

    <div class="tflex-row main">
      <div>
        <router-view></router-view>

        <TTile :title="trip?.name as string">
          <TripAspects :trip-is-loop="tripIsALoop" />
        </TTile>
        <TTile title="Description">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>
        </TTile>
        <TTile title="Feed">
          <TripFeedItem />
        </TTile>
      </div>
    </div>
    <TripMap :trip="trip" v-if="trip" />
  </main>
</template>

<script setup lang="ts">
import { onMounted, type Ref, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import TTile from '@/components/TTile.vue'
import TripAspects from '@/components/TripAspects.vue'
import TToolbar from '@/components/toolbar/TToolbar.vue'
import TToolbarButton from '@/components/toolbar/TToolbarButton.vue'
import TripFeedItem from '@/components/TripFeedItem.vue'
import TripMap from '@/components/TripMap.vue'
import { useRouteStore } from '@/stores/route'
import type { LeafletRoute } from '@/stores/route/types'

const route = useRoute()

const routeStore = useRouteStore()

let trip: Ref<LeafletRoute | null> = ref(null)

onMounted(async () => {
  id.value = parseInt(route.params.id as string)

  trip.value = await routeStore.getRoute(id.value)
})

const tripIsALoop = computed(() => {
  if (trip.value?.segments.length == 0) {
    return false
  }

  return trip.value?.segments[0] == trip.value?.segments[trip.value?.segments.length - 1]
})

const id: Ref<number | undefined> = ref(undefined)
</script>

<style lang="scss" scoped>
main {
  flex-grow: 1;
  display: flex;
}

.main {
  padding: 4em;
}

.btn-container {
  display: flex;
  gap: 1em;
}
</style>
