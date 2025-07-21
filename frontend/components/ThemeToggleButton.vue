<template>
  <label class="switch">
    <input
      type="checkbox"
      :checked="isDark"
      @change="toggle()"
    >
    <span class="slider round" />
  </label>
</template>

<script setup lang="ts">
import { useCustomTheme } from '~/composables/useCustomTheme';

const { toggle, isDark } = useCustomTheme();
</script>
<style lang="scss" scoped>
button {

  height: 32px;
  width: 52px;


  background-color: rgba(var(--v-theme-surface-variant), 0.1);


}

$toggle-width: 52px;
$toggle-height: 30px;
$toggle-padding: 4px;
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: $toggle-width;
  height: $toggle-height;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: none;

  background-color: rgba(var(--v-theme-surface-variant), 0.1);
  color: rgb(var(--v-theme-on-surface-variant));

  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: $toggle-height - 2 * $toggle-padding;
  width: calc($toggle-width / 2) - $toggle-padding;
  left: $toggle-padding;
  bottom: $toggle-padding;
  background-color: #F3C623;
  -webkit-transition: .4s;
  transition: .4s;
}

input + .slider {
  background-image: url("~/assets/clouds.svg");
}

input:checked + .slider {
  background-image: url("~/assets/stars.svg");
}

input:focus + .slider {
  background-image: url("~/assets/stars.svg");

}

input:checked + .slider:before {
  transform: translateX(calc($toggle-width / 2) - $toggle-padding);
}

.slider.round {
  border-radius: $toggle-height;
}

.slider.round:before {
  border-radius: 50%;
}
</style>