import { afterEach, beforeEach, describe, expect, it } from "vitest";
import TextComponent from "~/components/builder/elements/text/Element.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { createMockElement } from "~/components/builder/elements/text/__mocks__";
import type { EditorElementProperties, Grid } from "@trail/grid-editor/grid";
import { TextElement } from "~/components/builder/elements/text/index";

describe("Component", () => {
  describe("Text", () => {
    beforeEach(() => {
      const target = document.createElement("div");
      target.setAttribute("id", "editor-primary-toolbar");
      document.body.appendChild(target);
    });

    afterEach(() => {
      const target = document.getElementById("teleport-target");
      if (target) target.remove();
    });

    const props: EditorElementProperties<typeof TextElement> = {
      element: createMockElement(),
      definition: {} as unknown as any,
      grid: { tripId: 0, rows: [] } as Grid,
      changeable: true,
    };

    it("renders", async () => {
      const component = await mountSuspended(TextComponent, { props });
      expect(component.text()).toContain("Default text");
    });
  });
});
