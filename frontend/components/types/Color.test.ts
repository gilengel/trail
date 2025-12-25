import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ColorTypeComponent from "@/components/types/Color.vue";
import { nextTick } from "vue";

describe("GridEditor", () => {
  describe("Types", () => {
    describe("Color", () => {
      it('emits "update:modelValue" when color was changed over the color picker', async () => {
        const wrapper = await mountSuspended(ColorTypeComponent, {
          props: {
            config: {
              type: "custom",
              label: "color",
            },
            propertyKey: "",
            modelValue: "",
          },
          global: {
            stubs: {
              VColorPicker: {
                props: ["items", "modelValue"],
                emits: ["update:modelValue"],
                template: `
                                  <div data-testid="v-select">
                                    <button @click="$emit('update:modelValue', '#FFF')">Select Route C</button>
                                  </div>
                                `,
              },
            },
          },
        });

        const button = wrapper.find('[data-testid="v-select"] button');
        expect(button.exists()).toBe(true);

        await button.trigger("click");
        await nextTick();

        const emitted = wrapper.emitted("update:modelValue");
        expect(emitted).toBeTruthy();
        expect(emitted![0][0]).toEqual("#FFF");
      });

      it('does not emit "update:modelValue" if value is not valid', async () => {
        const wrapper = await mountSuspended(ColorTypeComponent, {
          props: {
            config: {
              type: "custom",
              label: "color",
            },
            propertyKey: "",
            modelValue: "",
          },
          global: {
            stubs: {
              VColorPicker: {
                props: ["items", "modelValue"],
                emits: ["update:modelValue"],
                template: `
                                  <div data-testid="v-select">
                                    <button @click="$emit('update:modelValue', undefined)">Select Route C</button>
                                  </div>
                                `,
              },
            },
          },
        });

        const button = wrapper.find('[data-testid="v-select"] button');
        expect(button.exists()).toBe(true);

        await button.trigger("click");
        await nextTick();

        const emitted = wrapper.emitted("update:modelValue");
        expect(emitted).toBeFalsy();
      });
    });
  });
});
