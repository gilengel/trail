<template>
  <div data-cy="trip-details" class="trip-details">
    <div class="overview">
      <MapTMap :trip />

      <ul></ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MapLibreTrip } from "~/data/routes/types";

defineProps<{
  trip: MapLibreTrip;
}>();
</script>

<style lang="scss" scoped>
.trip-details {
  color: black;

  display: flex;

  h1 {
    margin-top: 1em;
    margin-bottom: 0.5em;

    font-family: "Amatic SC", cursive;
    font-size: 3em;
  }

  // left side

  .main {
    border-right: rgb(230, 230, 230) 1px solid;
    flex-grow: 2;

    ul {
      position: relative;
      list-style: none;
      padding: 0;
      margin-left: 1em;

      li.segment {
        display: flex;
        align-items: center;

        height: 3em;

        div {
          width: 2em;
          height: 2em;

          margin-right: 0.5em;
        }

        span {
          font-family: "Amatic SC", cursive;
          font-size: 2em;
        }
      }
    }

    ul:before {
      z-index: -1;
      $border-width: 2px;
      position: absolute;
      left: calc(1em - $border-width / 2);
      top: 1em;
      bottom: 1em;
      display: block;
      content: " ";
      background: rgb(230, 230, 230);
      width: $border-width;
    }
  }

  .overview {
    min-width: 600px; // TODO: not use pixels

    ul {
      list-style: none;
      padding: 0;

      li.segment {
        display: flex;
        align-items: center;

        height: 3em;

        div {
          width: 8px;
          height: 2em;

          margin-right: 0.5em;
        }
      }
    }
  }

  .fi {
    position: relative;
    width: 6em;
    height: 4.5em;
    border: solid 1px rgb(230, 230, 230);
    margin: 20px 10px;
  }

  .fi::before {
    border: solid 1px rgb(230, 230, 230);
    content: " ";

    position: absolute;
    left: -10px;
    right: -10px;
    top: -10px;
    bottom: -10px;
  }
}
</style>
