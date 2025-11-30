import type {EditorElementInstance} from "../../instances/instance";

export function createMockElement(instanceId: string = "0"): EditorElementInstance<any> {
    const now = new Date();

    return {
        instanceId,
        elementId: 'mock-element',

        properties: {level: 0},

        connections: {
            consumed: {
                properties: {},
            },
            provided: {
                properties: {},
                events: {
                    listeners: {}
                }
            },
        },

        selected: false,

        created: now,
        modified: now
    }
}