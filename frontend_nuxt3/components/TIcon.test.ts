import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TIcon from "./TIcon.vue";

describe("Component", () => {
  describe("TIcon", () => {
    it("should render the icon", async () => {
      const component = await mountSuspended(TIcon, {
        props: { icon: "las la-hiking" },
      });
      expect(component.get('[data-cy="t-icon"]')).toBeTruthy();
    });
  });
});
