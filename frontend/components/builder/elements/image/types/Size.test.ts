import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SizeTypeComponent from "@/components/builder/elements/image/types/Size.vue";
import { ImageSize } from "~/components/builder/elements/image/Properties";

describe("GridEditor", () => {
  describe("Types", () => {
    describe("Size", () => {
      it('emits "update:modelValue" when a size was selected', async () => {
        const wrapper = await mountSuspended(SizeTypeComponent, {
          props: {
            config: {
              type: "custom",
              label: "size",
            },
            propertyKey: "",
            modelValue: ImageSize.Free,
          },
        });
        expect(wrapper.exists()).toBeTruthy();

        const button = wrapper!.find('[data-testid="editor-image-size-h-btn"]');
        expect(button.exists()).toBe(true);

        await button.trigger("click");
        await nextTick();

        const emitted = wrapper!.emitted("update:modelValue");
        expect(emitted).toBeTruthy();
        expect(emitted![0]![0]).toEqual(ImageSize.FitHorizontally);
      });

      it('defaults to "Free" if not provided with a valid modelValue', async () => {
        const wrapper = await mountSuspended(SizeTypeComponent, {
          // @ts-expect-error necessary to simulate wrong configuration by the developer
          props: {
            config: {
              type: "custom",
              label: "size",
            },
            propertyKey: "",
          },
        });

        const button = wrapper.find(
          '[data-testid="editor-image-size-free-btn"]',
        );
        console.log(wrapper.html());
        expect(button.exists()).toBe(true);
        expect(button.classes().includes("v-btn--active"));
      });
    });
  });
});
