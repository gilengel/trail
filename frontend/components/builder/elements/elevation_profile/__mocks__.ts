import type {Color} from "~/types/color";
import {
    ElevationProfileElement,
    type ElevationProfileProperties
} from "~/components/builder/elements/elevation_profile/index";
import type {EditorElementInstance} from "@trail/grid-editor/editorElementInstanceRegistry";

/**
 * Creates a mock elevation profile element to be used in unit tests.
 * @returns The mock instance.
 */
export function createMockElement(): EditorElementInstance<typeof ElevationProfileElement> {
    const now = new Date();
    return {

        instanceId: '0',
        elementId: 'ElevationProfile0',

        properties: {
            segmentsIds: [],
            routeId: 0,
            color: '#FF0000' as Color
        },

        defaults: {
            properties: {} as ElevationProfileProperties,
            providedProperties: ["segmentsIds", "routeId"],
            consumedProperties: ["segmentsIds", "routeId"],
        },

        connections: {
            consumed: {},
            provided: {}
        },

        selected: true,

        created: now,
        modified: now
    };
}