<template>
  <v-app id="inspire">
    <div class="header-image"></div>

    <v-navigation-drawer
        rail
        permanent
        data-cy="page-toolbars"
    >
      <slot name="primary-toolbar"/>

      <v-divider class="mx-3 my-5"/>

      <slot name="toolbar"/>
    </v-navigation-drawer>

    <v-app-bar
        class="px-3"
        height="72"
        style="z-index: 1;"
        flat
    >
      <v-spacer/>

      <v-responsive max-width="156">
        <v-text-field
            density="compact"
            rounded="pill"
            variant="solo-filled"
            flat
            hide-details
        />
      </v-responsive>

      <theme-toggle-button/>
    </v-app-bar>

    <v-main
        data-cy="page-content"
        class="d-flex justify-center ga-7"
    >
      <slot name="content"/>
    </v-main>


    <slot name="overview"/>
  </v-app>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
main {
  box-sizing: border-box;

  width: 100%;
  display: grid;
  grid-template-columns: 64px auto min-content;
  flex-direction: column;

  align-items: stretch;
  align-content: stretch;
}

.map {
  box-sizing: border-box;
  order: 2;
  height: 100%;
}

.content {
  padding: 1em;
  gap: 2em;

  display: flex;
  flex-direction: column;
}

.details {
  order: 1;
  flex-grow: 2;

  padding: 1em;

  display: flex;
  flex-direction: column;

  justify-content: stretch;
  align-items: stretch;

  gap: 24px;
}

</style>
