<template>
  <v-select
    v-if="collapseNumber < items!.length"
    v-model="selectedItem"
    :items="items!"
    :item-title="(item) => text(item)"
    item-value="id"
    label="Select a Route"
    return-object
    variant="outlined"
  />
  <v-list v-else>
    <v-list-item
      v-for="(item, i) in items"
      :key="i"
      :value="item"
      color="primary"
      @click="selectItem(item)"
      :data-testid="`list-item-${i}`"
    >
      <v-list-item-title>{{ text(item) }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts" generic="ItemType">
interface Props {
  items: ItemType[],
  text: (item: ItemType) => string,
  collapseNumber?: number
}

const {collapseNumber = 5} = defineProps<Props>();

const emit = defineEmits<(e: "onSelectionChanged", item: ItemType) => void>();

const selectedItem: Ref<ItemType | null> = ref(null)

const selectItem = (item: ItemType) => {
  selectedItem.value = item;
  emit("onSelectionChanged", item);
};

watch(selectedItem, (newItem) => {
  if (newItem) emit("onSelectionChanged", newItem);
});
</script>

<style scoped lang="scss">

</style>