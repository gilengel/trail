import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import {createVuetify} from "vuetify";
import {createGlobal} from "~/components/builder/elements/__mocks__";
import {EditorInjectionKey} from "@trail/grid-editor/editor";
import {GridEditorPropertyConnections} from "#components";

const vuetify = createVuetify({
    components,
    directives,
});

describe('Component', () => {
    let global: ReturnType<typeof createGlobal>;

    beforeEach(() => {
        global = createGlobal();

        global.provide[EditorInjectionKey].definitions.register({
            id: 'muu',
            name: 'Muu',
            category: 'Muu',
            component: undefined as unknown as Component,
            defaults: {
                properties: {},
                connections: {
                    provided: {
                        properties: [],
                        events: {}
                    },
                    consumed: {
                        properties: [],
                        callbacks: {}
                    }
                }
            }

        })
    });

    it('renders title and properties slots', () => {
        const now = new Date();
        const wrapper = mount(GridEditorPropertyConnections, {


            props: {

                grid: global.provide[EditorInjectionKey].grid,

                id: '0',
                element: {
                    instanceId: 'muu',
                    elementId: 'muu',
                    /*
                    defaults: {
                        properties: {},
                        providedProperties: [],
                        consumedProperties: []
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
                    properties: {},
                    selected: true,

                    created: now,
                    modified: now
                }

            },

            global: {
                ...global,
                plugins: [vuetify],
            },
            slots: {
                title: '<div>Mock Title</div>',
                properties: '<div>Mock Properties</div>',
            },
        });

        expect(wrapper.text()).toContain('Mock Title');
        expect(wrapper.text()).toContain('Mock Properties');
    });
});
