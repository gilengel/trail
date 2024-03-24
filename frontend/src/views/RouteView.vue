<script setup lang="ts">
import axios from 'axios'
import { onMounted, Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import TripDetails from '../components/TripDetails.vue'

const route = useRoute()

onMounted(() => {
  id.value = route.params.id as string
})

const id: Ref<string | null> = ref(null)
</script>

<template>
  <main>
    {{ id }}
    <TripDetails :routeId="id" />
  </main>
</template>
