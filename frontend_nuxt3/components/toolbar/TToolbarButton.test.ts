import { describe, it, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TToolbarButton from "./TToolbarButton.vue";

describe("Component", () => {
  describe("TToolbarButton", () => {
    it("should render a toolbar", async () => {
      const component = await mountSuspended(TToolbarButton, {
        props: { icon: "" },
      });
      expect(component.get('[data-cy="ttoolbar-btn"]')).toBeTruthy();
    });
  });
});
