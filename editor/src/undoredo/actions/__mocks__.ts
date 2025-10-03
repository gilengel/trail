import type {EditorElementInstance} from "../../editorElementInstanceRegistry";

export function createMockElement(): EditorElementInstance<any> {
    const now = new Date();

    return {
        instanceId: '0',
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