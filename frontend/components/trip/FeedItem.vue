<template>
  <div data-cy="trip-feed-item">
    <div class="header">
      <div class="profile">
        <img
          src="https://randomuser.me/api/portraits/women/51.jpg"
          alt="avatar"
        >

        <div>
          <span>Anne Traveler</span>
          <span>/traveler</span>
        </div>
      </div>

      <div class="social">
        <div class="button">
          <i class="las la-thumbs-up" />
          <span>1k</span>
        </div>
        <div class="button">
          <i class="las la-comment-dots" />
          <span>200</span>
        </div>
      </div>
    </div>

    <TripImages :segment="segment" />
  </div>
</template>

<script setup lang="ts">
import type {MapLibreSegment} from "~/types/route";

export interface TripFeedItemProps {
  segment: MapLibreSegment;
}

defineProps<TripFeedItemProps>();
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;

  .button {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      line-height: 2em;
      height: 2em;
      padding: 0;
      margin: 0;
    }

    span:nth-of-type(2) {
      margin-left: 0.3em;
    }
  }

  .social {
    display: flex;
    align-items: center;
    gap: 20px;
  }
}

.profile {
  display: flex;
  align-items: center;
  margin-bottom: 1em;

  img {
    $size: 64px;

    width: $size;
    height: $size;
    border-radius: $size;
  }

  div {
    margin-left: 1em;
    display: flex;
    flex-direction: column;

    span {
      padding: 0;
      margin: 0;
    }

    span:nth-of-type(2) {
      margin-top: -0.25em;
    }
  }
}
</style>
