import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SingleLineText from "./SingleLineText.vue";

describe("Component", () => {
  describe("SingleLineText", () => {
    it("should show a supporting label if provided as property", async () => {
      const component = await mountSuspended(SingleLineText, {
        attachTo: document.documentElement,
        props: { supportText: "SupportText", value: "" },
      });

      expect(component.get('[data-cy="tlabel"]').text()).toBe("SupportText");
    });

    it("should emit a valueChanged signal after the value was changed", async () => {
      const component = await mountSuspended(SingleLineText, {
        attachTo: document.documentElement,
        props: { supportText: "SupportText", value: "" },
      });

      const input = component.get('[data-cy="singleline-text"]');
      const text = "UnimportantText";
      for (let char of text) {
        await input.trigger("keydown", { key: char });
        //input.element.value += char; // Manually set the value
        await input.trigger("input");
        await input.trigger("keyup", { key: char });
      }

      await nextTick();

      const emitted = component.emitted("valueChanged");
      expect(emitted?.length).to.be.equal(15);
    });
  });
});
