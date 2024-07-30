import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TTile from "./TTile.vue";

describe("Component", () => {
  describe("Tile", () => {
    it('should trigger the animate "in" the tree svg elements on mouse over', async () => {
      const component = await mountSuspended(TTile, {
        slots: {
          default: () => "Hello Tile",
        },
      });

      expect(component.get('[data-cy="tile-slot"]').text()).toBe("Hello Tile");
    });
  });
});
