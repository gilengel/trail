<template>
  <NuxtLayout :theme="isDark ? 'dark' : 'light'">
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
import { useCustomTheme } from '~/composables/useCustomTheme'

const { isDark } = useCustomTheme()
</script>
