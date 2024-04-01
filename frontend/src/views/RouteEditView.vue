<template>
  <div class="tflex-row" style="align-content: space-between; justify-content: space-between">
    <SingleLineText :value="route?.name" @value-changed="routeNameChanged" />
    <div class="btn-container">
      <TButton label="Save" @click="$router.push({ name: 'route-edit' })"
        ><TIcon icon="save"
      /></TButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import SingleLineText from '@/components/SingleLineText.vue'
import TIcon from '@/components/TIcon.vue'
import TButton from '@/components/TButton.vue'
import { LeafletRoute } from '@/stores/route/types'
import { useRouteStore } from '@/stores/route'
import { onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'

const routeStore = useRouteStore()

const vueRoute = useRoute()

let route: Ref<LeafletRoute | null> = ref(null)

async function routeNameChanged(newValue: string) {
  if (!route.value) {
    return
  }

  route.value.name = newValue
  routeStore.updateRoute(route.value)
}

onMounted(async () => {
  const id = parseInt(vueRoute.params.id as string)

  route.value = await routeStore.getRoute(id)
})
</script>

<style scoped></style>
