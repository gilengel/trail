<template>
  <div class="header-image"></div>
  <v-container>
    <v-row align="start">
      <v-toolbar
          flat
          color="transparent"
      >
        <!--
        <v-toolbar-title>
          Trail
        </v-toolbar-title>

        <v-spacer/>

        <theme-toggle-button/>
        -->
      </v-toolbar>
      <v-col>
        <Tile class="pa-10 d-flex flex-column align-center">
          <v-avatar
              image="https://randomuser.me/api/portraits/women/51.jpg"
              size="120"
          />
          <h1 class="pt-10">
            Mi Mao
          </h1>
          <h2>Muu?</h2>
        </Tile>
      </v-col>
      <v-col cols="6">
        <Tile>
          <TripCreate/>
        </Tile>
      </v-col>
      <v-col>
        <Tile title="Next Trip Idea" class="mb-12">...</Tile>

        <Tile>
          <TripOverview
              @selected-trip-changed="(id: number) => $router.push(`trip/${id}/feed`)"
          />
        </Tile>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
</script>

<style scoped>
.header-image {
  position: relative;
  height: 22vh;
  background-color: #ddf7fa;
  background-image: url("assets/mountains.svg");
  background-repeat: repeat-x;
}


</style>