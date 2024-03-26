<template>
    <button
      class="btn"
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
      @focusin="isHovered = true"
      @focusout="isHovered = false"
    >
      <span>{{ title }}</span>
    </button>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  export interface AnimatedButtonProps {
    title: string
  }
  withDefaults(defineProps<AnimatedButtonProps>(), {
    title: 'Animated Button'
  })
  
  const isHovered = ref(false)
  </script>
  <style scoped lang="scss">
  @import '../style/button';
  
  // Necessary to hide weird outline on button in chrome
  *,
  *:focus,
  *:hover {
    outline: none;
  }
  </style>
  