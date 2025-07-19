<template>
  <v-btn
    data-testid="tooltip-button"
    :color="isActive ? 'primary' : 'transparent'"
    variant="flat"
    rounded="0"
    @click="onClick"
  >
    <v-icon>{{ icon }}</v-icon>
  </v-btn>
  <v-tooltip
    :text="tooltip"
    location="bottom"
  >
    <template />
  </v-tooltip>
</template>

<script setup lang="ts">
import {defineProps, defineEmits} from 'vue';

interface Props {
  icon: string;
  tooltip: string,
  isActive?: boolean;
}

const {icon, tooltip, isActive = false} = defineProps<Props>();

const emit = defineEmits(['click']);

const onClick = () => {
  emit('click');
};
</script>

<style scoped lang="scss">
button {
  height: 100% !important;
}
</style>