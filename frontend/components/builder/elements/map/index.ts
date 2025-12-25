import type {
  ConsumedPropertiesRoute,
  ProvidedPropertiesRoute,
  RouteProperty,
} from "~/components/builder/elements/RouteProperty";
import { createEditorElementDefinition } from "@trail/grid-editor/editorConfiguration";
import type { EditorElementDefinition } from "@trail/grid-editor/definition/elementDefinition";
import { defineCallback } from "@trail/grid-editor/events/eventRegistry";
import type { EditorElementInstance } from "@trail/grid-editor/instances/instance";

export const MapElement: EditorElementDefinition<
  RouteProperty,
  ProvidedPropertiesRoute,
  ConsumedPropertiesRoute
> = createEditorElementDefinition({
  id: "map",
  name: "Map",
  category: "content",

  component: defineAsyncComponent(
    // @ts-ignore
    () => import("~/components/builder/elements/map/Element.vue"),
  ),

  defaults: {
    properties: {} as RouteProperty,

    connections: {
      provided: {
        properties: ["route", "color"],
        events: {
          "segment-hovered-on": {
            name: "segment-hovered-on",
            label: "Segment was hovered on",
            description: "Fired when map is panned or zoomed",
            payloadType: "custom",
            payloadSchema: {
              point: { lat: 0, lng: 0 },
            },
          },
        },
      },

      consumed: {
        properties: ["route", "color"],

        callbacks: {
          "segment-hovered-on": defineCallback(
            { point: { lat: 0, lng: 0 } },
            (
              instance: EditorElementInstance,
              args: {
                point: { lat: number; lng: number };
              },
            ) => {
              instance.properties.marker = args.point;
            },
            { name: "segment-hovered-on", label: "Segment hovered" },
          ),
        },
      },
    },
  },

  propertySchema: {
    route: {
      type: "custom",
      component: defineAsyncComponent(
        // @ts-ignore
        () => import("~/components/types/RouteSelect.vue"),
      ),
      label: "Route",
      description: "Select the route you want to display on the map",
    },

    color: {
      type: "color",
      label: "Route Color",
      format: "hex",
      defaultValue: "#000000",
    },
  },

  metadata: {
    description: "A simple text element with customizable styling",
    icon: "las la-map-marked-alt",
    tags: ["text", "content", "basic"],
    version: "1.0.0",
  },
});
