<template>
  <dialog ref="dialog">
    <h1 v-if="title">{{ title }}</h1>
    <p>
      <slot />
    </p>

    <FormsTButton @click="dialog?.close()">Ok</FormsTButton>
  </dialog>
</template>

<script setup lang="ts">
type ErrorMessageProps = {
  title?: string;
};
defineProps<ErrorMessageProps>();

const dialog = ref<HTMLDialogElement | null>(null);

onMounted(() => {
  if (dialog.value) {
    dialog.value.showModal();
  }
});
</script>

<style scoped lang="scss">
dialog {
  position: absolute;
  z-index: 999;

  animation: fade-out 0.7s ease-out;

  background-color: $gray;
  border: none;
  padding: 1em;
  padding-left: 4em;
  padding-right: 4em;
  padding-bottom: 3em;

  max-width: 600px;

  h1 {
    font-family: "Amatic SC", cursive;
  }
}

dialog::backdrop {
  background-color: rgba($light, 0.8);
}

dialog::after {
  content: "😭";
  position: absolute;
  top: 0.5em;
  right: 1em;
  font-size: 3em;
}

dialog[open] {
  animation: polygon 0.1s ease-out;
  animation-fill-mode: forwards;
}

@keyframes polygon {
  0% {
    clip-path: polygon(11% 11%, 83% 20%, 99% 88%, 0% 100%);
  }

  100% {
    clip-path: polygon(2% 4%, 97% 2%, 98% 94%, 1% 88%);
  }
}
</style>
