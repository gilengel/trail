import { createEditorElementDefinition } from "@trail/grid-editor/editorConfiguration";
import type { HeadingProperties } from "~/components/builder/elements/heading/Properties";
import type { EditorElementDefinition } from "@trail/grid-editor/definition/elementDefinition";

export const HeadingElement: EditorElementDefinition<
  HeadingProperties,
  [],
  []
> = createEditorElementDefinition({
  id: "heading-element",
  name: "Heading",
  category: "content",

  component: defineAsyncComponent(
    // @ts-ignore
    () => import("~/components/builder/elements/heading/Element.vue"),
  ),

  defaults: {
    properties: {
      level: 0,
      color: "#000",
      text: "Heading",
      alignment: "left",
    } as HeadingProperties,

    connections: {
      provided: {
        properties: [],
        events: {},
      },
      consumed: {
        properties: [],
        callbacks: {},
      },
    },
  },

  propertySchema: {
    level: {
      type: "range",
      component: defineAsyncComponent(
        // @ts-ignore
        () => import("~/components/builder/elements/heading/types/Level.vue"),
      ),
      label: "Heading Level",
      description: "Select heading level (H1-H6)",
      min: 0,
      max: 5,
      step: 1,
      defaultValue: 0,
    },
    color: {
      type: "color",
      label: "Text Color",
      format: "hex",
      defaultValue: "#000000",
    },
    alignment: {
      type: "select",
      component: defineAsyncComponent(
        () =>
          // @ts-ignore
          import("~/components/builder/elements/heading/types/Alignment.vue"),
      ),
      label: "Text Alignment",
      options: ["left", "center", "right"],
      defaultValue: "left",
    },
  },

  metadata: {
    description: "A simple text element with customizable styling",
    icon: "las la-heading",
    tags: ["text", "content", "basic"],
    version: "1.0.0",
  },
});
