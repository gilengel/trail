<template>
  <v-btn icon @click="toggle()">
    <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { useCustomTheme } from '~/composables/useCustomTheme'

const { toggle, isDark } = useCustomTheme()
</script>
