import type {EditorElementInstance} from "@trail/grid-editor/editorElementInstanceRegistry";
import {HeadingElement} from "~/components/builder/elements/heading/index";
import type {HeadingProperties} from "~/components/builder/elements/heading/Properties";

/**
 * Creates a mock heading element to be used in unit tests.
 * @param "properties" - Can be used to pass non default properties necessary for single tests.
 * @returns The mock instance.
 */
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

        created: now,
        modified: now
    };
}