import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import CollapsableList from "~/components/CollapsableList.vue";

interface Item {
  id: number;
  name: string;
}

const sampleItems: Item[] = [
  { id: 1, name: "Route A" },
  { id: 2, name: "Route B" },
  { id: 3, name: "Route C" },
  { id: 4, name: "Route D" },
  { id: 5, name: "Route E" },
  { id: 6, name: "Route F" },
];

const text = (item: Item) => item.name;

describe("RouteSelector.vue", () => {
  it("renders v-select when items exceed collapseNumber", () => {
    const wrapper = mount(CollapsableList<Item>, {
      props: {
        items: sampleItems,
        text,
        collapseNumber: 5,
      },
      global: {
        stubs: ["VSelect", "VList", "VListItem", "VListItemTitle"],
      },
    });
    expect(wrapper.findComponent({ name: "v-select" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "v-list" }).exists()).toBe(false);
  });

  it("renders v-list when items are fewer than collapseNumber", () => {
    const wrapper = mount(CollapsableList<Item>, {
      props: {
        items: sampleItems.slice(0, 3),
        text,
        collapseNumber: 5,
      },
      global: {
        stubs: ["VSelect", "VList", "VListItem", "VListItemTitle"],
      },
    });
    expect(wrapper.findComponent({ name: "v-select" }).exists()).toBe(false);
    expect(wrapper.findComponent({ name: "v-list" }).exists()).toBe(true);
  });

  it("emits onSelectionChanged when item is selected from v-select", async () => {
    const wrapper = mount(CollapsableList<Item>, {
      props: {
        items: sampleItems,
        text,
        collapseNumber: 3,
      },
      global: {
        stubs: {
          VSelect: {
            props: ["items", "modelValue"],
            emits: ["update:modelValue"],
            template: `
                          <div data-testid="v-select">
                            <button @click="$emit('update:modelValue', items[2])">Select Route C</button>
                          </div>
                        `,
          },
          VList: true,
          VListItem: {
            template: `<div @click="$emit('click')"><slot /></div>`,
          },
          VListItemTitle: true,
        },
      },
    });

    const button = wrapper.find('[data-testid="v-select"] button');
    expect(button.exists()).toBe(true);

    await button.trigger("click");
    await nextTick();

    const emitted = wrapper.emitted("onSelectionChanged");
    expect(emitted).toBeTruthy();
    expect(emitted![0][0]).toEqual(sampleItems[2]);
  });

  it("selectItem() sets selectedItem and emits onSelectionChanged", async () => {
    const wrapper = mount(CollapsableList<Item>, {
      props: {
        items: sampleItems,
        text,
        collapseNumber: 10, // ensures v-list mode, but doesn’t matter here
      },
      global: {
        stubs: {
          VList: true,
          VListItem: true,
          VListItemTitle: true,
          VSelect: true,
        },
      },
    });

    // @ts-expect-error: method exposed by <script setup>
    wrapper.vm.selectItem(sampleItems[1]);
    await nextTick();

    // @ts-expect-error: internal state
    expect(wrapper.vm.selectedItem).toEqual(sampleItems[1]);

    expect(wrapper.emitted("onSelectionChanged")).toBeTruthy();
    expect(wrapper.emitted("onSelectionChanged")![0][0]).toEqual(
      sampleItems[1],
    );
  });
});
