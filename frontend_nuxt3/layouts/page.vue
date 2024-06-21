<template>
  <main>
    <div class="toolbars">
      <ToolbarTToolbar>
        <ToolbarTToolbarButton
          icon="las la-hand-point-left"
          @click="$router.push({ path: '/' })"
        ></ToolbarTToolbarButton>
      </ToolbarTToolbar>
      <slot name="toolbar" />
    </div>

    <div class="content">
      <slot name="content" />
    </div>

    <div class="overview">
      <slot name="overview" />
    </div>
  </main>
</template>

<script setup lang="ts"></script>

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
