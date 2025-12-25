import type { MapElement } from "~/components/builder/elements/map/index";
import type { EditorElementInstance } from "@trail/grid-editor/instances/instance";

/**
 * Creates a mock map element to be used in unit tests.
 * @returns The mock instance.
 */
export function createMockElement(): EditorElementInstance<typeof MapElement> {
  const now = new Date();
  return {
    instanceId: "0",
    elementId: "ElevationProfile0",

    properties: {
      route: {
        id: 0,
        segmentIds: [],
      },
    },

    connections: {
      consumed: {
        properties: {},
      },
      provided: {
        properties: {},
        events: {
          listeners: {},
        },
      },
    },

    selected: true,

    created: now,
    modified: now,
  };
}
