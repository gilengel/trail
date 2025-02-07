<template>
  <v-tooltip :text=props.tooltip location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn
          data-testid="tooltip-button"
          icon
          v-bind="props"
          :color="isActive ? 'primary' : 'transparent'"
          variant="flat"
          rounded="0"
          @click="onClick"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import {defineProps, defineEmits} from 'vue';

const props = defineProps({
  icon: {
    type: String,
    required: true, // Optional icon name
  },
  isActive: {
    type: Boolean,
    default: false, // Button state: active or not
  },

  tooltip: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['click']);

const onClick = () => {
  emit('click');
};
</script>

<style scoped lang="scss">

</style>