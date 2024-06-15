<template>
  <button
    class="btn animated_btn tborder-radius"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
    @focusin="isHovered = true"
    @focusout="isHovered = false"
    data-cy="animated-btn"
  >
    <SVGTree data-cy="svg-tree" :animation-in="!isHovered" />
    <SVGTree :animation-in="!isHovered" />
    <SVGTree :animation-in="!isHovered" />
    <span>{{ title }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SVGTree from "@/components/SVGTree.vue";

export interface AnimatedButtonProps {
  title: string;
}
withDefaults(defineProps<AnimatedButtonProps>(), {
  title: "Animated Button",
});

const isHovered = ref(false);
</script>
<style scoped lang="scss">
//@import '@/style/button';

.animated_btn {
  position: relative;
  background-color: $light;
  margin-top: 2em;

  > svg {
    position: absolute;
    width: 2.5em;
    height: 2.5em;
    top: -2.5em;
  }

  > svg:nth-of-type(1) {
    left: 10%;
    height: 2.3em;
    top: -2.2em;
  }

  > svg:nth-of-type(2) {
    left: 65%;

    height: 2em;
    top: -2em;
  }

  > svg:nth-of-type(3) {
    left: 70%;
  }
}
.animated_btn:hover {
  cursor: pointer;
  border-image-width: 0;
}

// Necessary to hide weird outline on button in chrome
*,
*:focus,
*:hover {
  outline: none;
}
</style>
