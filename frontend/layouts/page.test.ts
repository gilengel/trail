import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import Page from "./page.vue";

describe("Layout", () => {
  describe("Page", () => {
    it("should render the page layout", async () => {
      const component = await mountSuspended(Page);

      expect(component.get('[data-cy="page-toolbars"]')).toBeTruthy();
    });
  });
});
