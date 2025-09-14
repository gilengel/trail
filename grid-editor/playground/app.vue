<template>
  <div>
    <GridEditor :grid="createDefaultGrid(0)"/>
  </div>
</template>

<script setup>
import {createDefaultGrid} from "../src/runtime/stores/grid.js";
</script>
