<template>
  <v-container>
    <v-row align="start">
      <v-toolbar
        flat
        color="transparent"
      >
        <v-toolbar-title>
          Trail
        </v-toolbar-title>

        <v-spacer />
        <theme-toggle-button />
      </v-toolbar>
      <v-col>
        <v-sheet
          class="pa-2 ma-2 pa-10 d-flex flex-column align-center"
          elevation="1"
        >
          <v-avatar
            image="https://randomuser.me/api/portraits/women/51.jpg"
            size="120"
          />
          <h1 class="pt-10">
            Mi Mao
          </h1>
          <h2>Muu?</h2>
        </v-sheet>
        <v-sheet class="pa-2 ma-2">
          <v-card
            title="Card title"
            text="..."
            variant="outlined"
          />
        </v-sheet>
      </v-col>
      <v-col cols="6">
        <v-sheet class="pa-2 ma-2">
          <TripUpload />
        </v-sheet>
      </v-col>
      <v-col>
        <v-sheet class="pa-2 ma-2">
          <v-card
            title="Next Trip Idea"
            text="..."
            variant="outlined"
          />
        </v-sheet>
        <v-sheet class="pa-2 ma-2">
          <v-card
            title="Random Photo"
            text="..."
            variant="outlined"
          />
        </v-sheet>
        <v-sheet class="pa-2 ma-2">
          <TripOverview
            @selected-trip-changed="(id: number) => $router.push(`route/${id}/feed`)"
          />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
</script>