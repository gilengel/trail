import { describe, it, expect, beforeEach } from "vitest";
import { createMockElement } from "~/components/builder/elements/elevation_profile/__mocks__";
import { mount } from "@vue/test-utils";
import { createGlobal } from "~/components/builder/elements/__mocks__";
import { createVuetify } from "vuetify";
import { GridEditorRow } from "#components";
import {
  createDefaultGrid,
  type EditorElementProperties,
} from "@trail/grid-editor/grid";
import { BuilderMode, EditorInjectionKey } from "@trail/grid-editor/editor";
import type { EditorElementDefinition } from "@trail/grid-editor/definition/elementDefinition";

describe("Component", () => {
  describe("Row", () => {
    let global: ReturnType<typeof createGlobal>;
    let props: EditorElementProperties<any>;

    beforeEach(() => {
      global = createGlobal(createDefaultGrid(0));

      props = {
        element: createMockElement(),
        definition: {} as unknown as EditorElementDefinition<any>, // not relevant for the test
        grid: global.provide[EditorInjectionKey].grid,
        changeable: true,
      };
    });

    it("renders", () => {
      const component = mount(GridEditorRow, {
        global: {
          ...global,
          plugins: [createVuetify()],
        },
        props: {
          rowIndex: 0,
          model: props.grid.rows[0],
          grid: props.grid,

          activeMode: BuilderMode.Create,
        },
      });
      expect(component.exists).toBeTruthy();
    });
  });
});
