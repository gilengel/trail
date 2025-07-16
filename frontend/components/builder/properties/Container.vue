<template>
  <div class="pa-5">
    <v-card class="rounded-xl" variant="flat">
      <v-card-title>
        <slot name="title"></slot>
      </v-card-title>
      <v-card-text>
        <slot name="properties"></slot>
      </v-card-text>
    </v-card>
  </div>
</template>