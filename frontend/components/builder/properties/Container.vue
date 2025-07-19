<template>
  <div class="pa-5">
    <v-card
      class="rounded-xl"
      variant="flat"
    >
      <v-card-title>
        <slot name="title" />
      </v-card-title>
      <v-card-text>
        <slot name="properties" />
      </v-card-text>
    </v-card>
  </div>
</template>