import type {EditorElementInstance} from "@trail/grid-editor/instances/instance";
import type {ImageElement} from "~/components/builder/elements/image/index";
import {ImagePosition, ImageSize} from "~/components/builder/elements/image/Properties";

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

        /*
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
        */

        connections: {
            consumed: {
                properties: {}
            },
            provided: {
                properties: {},
                events: {
                    listeners: {}
                }
            }
        },

        selected: true,

        created: now,
        modified: now
    };
}