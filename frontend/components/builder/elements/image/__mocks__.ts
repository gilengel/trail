import type {EditorElementInstance} from "@trail/grid-editor/editorElementInstanceRegistry";
import type {ImageElement} from "~/components/builder/elements/image/index";
import {ImagePosition, type ImageProperties, ImageSize} from "~/components/builder/elements/image/Properties";

/**
 * Creates a mock image element to be used in unit tests.
 * @returns The mock instance.
 */
export function createMockElement(): EditorElementInstance<typeof ImageElement> {
    const now = new Date();
    return {

        instanceId: '0',
        elementId: 'ElevationProfile0',

        properties: {
            scale: {origin: {x: 0, y: 0}, value: 1},
            aspectRatio: 1,
            sizeType: ImageSize.Free,
            positionType: ImagePosition.Free
        },

        defaults: {
            properties: {
                scale: {origin: {x: 0, y: 0}, value: 1},
                aspectRatio: 1,
                sizeType: ImageSize.Free,
                positionType: ImagePosition.Free
            } as ImageProperties,
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
    };
}