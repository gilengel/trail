<template>
  <div class="pa-5">
    <v-card>
      <v-card-title class="text-h6 text-md-h5 text-lg-h4">
        <slot name="title"></slot>
      </v-card-title>
      <v-card-text>
        <slot name="properties"></slot>
      </v-card-text>
    </v-card>
  </div>
</template>