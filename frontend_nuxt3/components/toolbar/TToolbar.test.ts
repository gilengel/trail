import { describe, it, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TToolbar from "./TToolbar.vue";

describe("Component", () => {
  describe("Toolbar", () => {
    it("should render a toolbar", async () => {
      const component = await mountSuspended(TToolbar);
      expect(component.get('[data-cy="ttoolbar"]')).toBeTruthy();
    });
  });
});
