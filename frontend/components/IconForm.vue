<template>
  <div
      class="v-input v-input--horizontal v-input--center-affix v-input--density-default">
    <div class="v-input__prepend">
      <v-icon :icon="icon"></v-icon>
    </div>
    <div class="v-input__control">
      <div class="v-field v-field--variant-outlined">
        <div class="v-field__overlay"></div>
        <div class="v-field__field" data-no-activator="">

          <slot></slot>

          <!----></div>
        <div class="v-field__outline">
          <div class="v-field__outline__start"></div>

          <div class="v-field__outline__end"></div>
        </div>
      </div>
    </div><!---->
    <div class="v-input__details" role="alert" aria-live="polite"><div class="v-messages"></div></div>
  </div>
</template>

<script setup lang="ts">

interface Props {
  icon: string
}

const props = defineProps<Props>();
</script>

<style scoped lang="scss">

</style>