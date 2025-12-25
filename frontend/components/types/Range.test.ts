import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import RangeTypeComponent from "@/components/types/Range.vue";

describe("GridEditor", () => {
  describe("Types", () => {
    describe("Range", () => {
      it("renders", async () => {
        const component = await mountSuspended(RangeTypeComponent, {
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
    });
  });
});
