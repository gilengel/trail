import type {EditorElementInstance} from "@trail/grid-editor/editorElementInstanceRegistry";
import type {TextElement} from "~/components/builder/elements/text/index";

/**
 * Creates a mock text element to be used in unit tests.
 * @returns The mock instance.
 */
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

        created: now,
        modified: now
    };
}