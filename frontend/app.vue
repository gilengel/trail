<template>
  <NuxtLayout :theme="isDark ? 'dark' : 'light'">
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { useCustomTheme } from "~/composables/useCustomTheme";

const { isDark } = useCustomTheme();
</script>

<style lang="scss">
body {
  background: rgb(var(--v-theme-on-surface-variant));
}
</style>
