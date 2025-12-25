import { describe, it, expect } from "vitest";
import EditRoute from "./Edit.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";

describe("Route", () => {
  describe("Edit", () => {
    it("renders", async () => {
      const component = await mountSuspended(EditRoute, {
        props: {
          title: "Test",
          route: {
            id: 0,
            tripId: 0,
            name: "",
            description: "",
            segments: [],
          },
        },
      });
      expect(component.exists).toBeTruthy();
    });
  });
});
