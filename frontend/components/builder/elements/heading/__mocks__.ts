import type {EditorElementInstance} from "@trail/grid-editor/editorElementInstanceRegistry";
import {HeadingElement} from "~/components/builder/elements/heading/index";
import type {HeadingProperties} from "~/components/builder/elements/heading/Properties";

export function createMockElement(properties: HeadingProperties = {
    level: 0,
    color: '#000',
    text: 'Heading',
    alignment: 'left'
}): EditorElementInstance<typeof HeadingElement> {
    const now = new Date();
    return {

        instanceId: '0',
        elementId: 'ElevationProfile0',

        properties,

        defaults: {
            properties: {} as HeadingProperties,
            providedProperties: [],
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