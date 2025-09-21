import {
    type ElevationProfileProperties
} from "~/components/builder/elements/elevation_profile/index";
import type {EditorElementInstance} from "~/components/GridEditor/editorElementInstanceRegistry";
import type {MapElement} from "~/components/builder/elements/map/index";
import type {TextElement} from "~/components/builder/elements/text/index";

export function createMockElement(): EditorElementInstance<typeof TextElement> {
    const now = new Date();
    return {

        instanceId: '0',
        elementId: 'TextElement',

        properties: {
            content: 'Default text',
            fontSize: 16,
            color: '#000000',
            bold: false,
        },

        defaults: {
            properties: {
                content: 'Default text',
                fontSize: 16,
                color: '#000000',
                bold: false,
            },
            providedProperties: ["content"],
            consumedProperties: [],
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