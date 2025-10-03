import type {EditorElementInstance} from "../../editorElementInstanceRegistry";

export function createMockElement(instanceId: string = "0"): EditorElementInstance<any> {
    const now = new Date();

    return {
        instanceId,
        elementId: 'mock-element',

        properties: {level: 0},

        defaults: {},

        connections: {
            consumed: {},
            provided: {},
        },

        selected: false,

        highlighted: false,

        created: now,
        modified: now
    }
}