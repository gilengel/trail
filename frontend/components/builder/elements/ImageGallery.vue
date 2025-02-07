<template>
  <masonry-wall :items="images" :ssr-columns="1" :column-width="300" :gap="16">
    <template #default="{ item, index }">
      <div class="bg-surface-variant rounded-sm mx-auto" border="solid 2px white">
        <v-img class="bg-surface-variant rounded-sm mx-auto" border="solid 2px white"
               cover
               :src="item.url"
        ></v-img>
      </div>
    </template>
  </masonry-wall>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import type {ImageDto} from "~/data/images/types";
import {columnValueValidator} from "~/composables/useColumValidator";


defineProps({
  images: {
    type: Array<ImageDto>,
    required: true
  },

  cols: {
    type: Number,
    required: true,
    validator: columnValueValidator
  },

  sm: {
    type: Number,
    required: false,
    default: 0,
    validator: columnValueValidator,
  },

  md: {
    type: Number,
    required: false,
    default: 0,
    validator: columnValueValidator,
  },

  lg: {
    type: Number,
    required: false,
    default: 0,
    validator: columnValueValidator
  },

  xl: {
    type: Number,
    required: false,
    default: 0,
    validator: columnValueValidator
  },

  xxl: {
    type: Number,
    required: false,
    default: 0,
    validator: columnValueValidator
  }
});

// Define an array of card data with type to differentiate videos and images
const cards = ref([
  {type: 'video', src: '//www.youtube.com/embed/lCYvN7Z2l3E', title: 'A lion with Dan', likes: 10},
  {
    type: 'image',
    src: 'https://cdn.pixabay.com/photo/2015/11/16/16/28/bird-1045954_960_720.jpg',
    title: 'The bird',
    likes: 10
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1463288889890-a56b2853c40f?ixlib=rb-1.2.1&auto=format&fit=crop&w=3132&q=80',
    title: 'Mountain and lake',
    likes: 10
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1617369120004-4fc70312c5e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1587&q=80',
    title: 'Mountain and fog',
    likes: 10
  },
  {type: 'video', src: '//www.youtube.com/embed/1QZIRe-Yvkc', title: 'Just a bug cat', likes: 10},
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1526400473556-aac12354f3db?ixlib=rb-1.2.1&auto=format&fit=crop&w=2940&q=80',
    title: 'The river',
    likes: 10
  },
  {
    type: 'image',
    src: 'https://cdn.pixabay.com/photo/2021/11/30/17/06/tree-6835828_960_720.jpg',
    title: 'The snow and tree',
    likes: 10
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-1.2.1&auto=format&fit=crop&w=2952&q=80',
    title: 'Mountain summit',
    likes: 7
  },
]);
</script>

<style scoped>
.grid-span-8 {
  grid-row-end: span 8;
}

.grid-span-9 {
  grid-row-end: span 9;
}
</style>