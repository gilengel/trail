import {
    type ElevationProfileProperties
} from "~/components/builder/elements/elevation_profile/index";
import type {EditorElementInstance} from "~/components/GridEditor/editorElementInstanceRegistry";
import type {MapElement} from "~/components/builder/elements/map/index";

export function createMockElement(): EditorElementInstance<typeof MapElement> {
    const now = new Date();
    return {

        instanceId: '0',
        elementId: 'ElevationProfile0',

        properties: {
            segmentsIds: [],
            routeId: 0,
        },

        defaults: {
            properties: {} as ElevationProfileProperties,
            providedProperties: ["routeId", "segmentsIds"],
            consumedProperties: ["routeId", "segmentsIds"],
        },

        connections: {
            consumed: {},
            provided: {}
        },

        selected: true,
        highlighted: false,

        created: now,
        modified: now
    }
}