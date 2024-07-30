import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TButton from "./TButton.vue";

describe("Component", () => {
  describe("Button", () => {
    it('should render a button with the text "Hello Button"', async () => {
      const component = await mountSuspended(TButton, {
        props: { label: "Hello Button" },
      });
      expect(component.get('[data-cy="button-label"]').text()).toBe(
        "Hello Button"
      );
    });

    it("should render the child element into the slot", async () => {
      const component = await mountSuspended(TButton, {
        props: { label: "Hello Button" },
        slots: {
          default: "<h1>Test</h1>",
        },
      });
      expect(component.get("h1").text()).toBe("Test");
    });
  });
});
