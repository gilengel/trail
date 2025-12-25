import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import HeadingAlignmentTypeComponent from "@/components/builder/elements/heading/types/Alignment.vue";
import { createVuetify } from "vuetify/framework";
import { mount } from "@vue/test-utils";

describe("GridEditor", () => {
  describe("Types", () => {
    describe("Alignment", () => {
      it("renders", async () => {
        const component = await mountSuspended(HeadingAlignmentTypeComponent, {
          props: {
            config: {
              type: "custom",
              label: "text",
            },
            propertyKey: "",
            modelValue: "",
          },
        });
        expect(component.exists()).toBeTruthy();
      });

      it('emits "update:modelValue" when color was changed over the color picker', () => {
        const wrapper = mount(HeadingAlignmentTypeComponent, {
          global: {
            plugins: [createVuetify()],
          },
          props: {
            config: {
              type: "custom",
              label: "color",
            },
            propertyKey: "",
            modelValue: "",
          },
        });

        const button = wrapper.find('[data-testid="editor-align-left-btn"]');
        expect(button.exists()).toBe(true);

        button.trigger("click");

        const emitted = wrapper.emitted("update:modelValue");
        expect(emitted).toBeTruthy();
        expect(emitted![0][0]).toEqual("start");
      });
    });
  });
});
