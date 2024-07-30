import { describe, it, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ErrorMessage from "./ErrorMessage.vue";

describe("Component", () => {
  describe("ErrorMessage", () => {
    it("should render the error message", async () => {
      const component = await mountSuspended(ErrorMessage);
      expect(component).toBeTruthy();
    });

    it("should close the error message on the close button click", async () => {
      const component = await mountSuspended(ErrorMessage);

      const dialog: HTMLDialogElement = component.get("dialog").element;

      const closeSpy = vi.fn();
      dialog.addEventListener("close", closeSpy);

      await component.get("[data-cy=t-button]").trigger("click");
      await nextTick();

      expect(closeSpy).toHaveBeenCalled();
    });

    it("should show a title if provided as property", async () => {
      const component = await mountSuspended(ErrorMessage, {
        props: { title: "Test Title" },
      });

      expect(component.get("[data-cy=t-error-message-title]").text()).toBe(
        "Test Title"
      );
    });
  });
});
