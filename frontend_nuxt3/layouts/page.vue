<template>
  <v-app id="inspire">
    <v-navigation-drawer rail data-cy="page-toolbars">
      <v-list>
        <slot name="primary-toolbar" />
      </v-list>


      <v-divider class="mx-3 my-5"></v-divider>


      <slot name="toolbar" />
    </v-navigation-drawer>

    <v-app-bar class="px-3" height="72" flat>
      <v-spacer></v-spacer>

      <v-responsive max-width="156">
        <v-text-field
          density="compact"
          rounded="pill"
          variant="solo-filled"
          flat
          hide-details
        ></v-text-field>
      </v-responsive>

      <theme-toggle-button />
    </v-app-bar>

    <v-main data-cy="page-content" class="d-flex justify-center ga-7">
      <slot name="content" />
    </v-main>


    <slot name="overview" />
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

.toolbars {
  order: 0;
  display: flex;
  flex-direction: column;

  border-right: rgb(230, 230, 230) 1px solid;
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
