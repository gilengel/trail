<script setup lang="ts">
import { onMounted, type Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import TripDetails from '../components/TripDetails.vue'
import Toolbar from '../components/toolbar/Toolbar.vue'
import ToolbarButton from '../components/toolbar/ToolbarButton.vue'

const route = useRoute()

onMounted(() => {
  id.value = parseInt(route.params.id as string)
})

const id: Ref<number | undefined> = ref(undefined)
</script>

<template>
  <main>
    <Toolbar>
      <ToolbarButton icon="arrow_back" @click="$router.push({ path: '/' })"></ToolbarButton>
      <ToolbarButton icon="add"></ToolbarButton>
    </Toolbar>
    <TripDetails :routeId="id" v-if="id" />
  </main>
</template>

<style lang="scss" scoped></style>
