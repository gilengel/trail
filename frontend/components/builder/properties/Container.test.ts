import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from '@vue/test-utils';
import Container from "~/components/builder/properties/Container.vue";
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import {createVuetify} from "vuetify";
import {createGlobal} from "~/components/builder/elements/__mocks__";
import {EditorInjectionKey} from "@trail/grid-editor/editor";

const vuetify = createVuetify({
    components,
    directives,
});

describe('Component', () => {
    let global: ReturnType<typeof createGlobal>;

    beforeEach(() => {
        global = createGlobal();
    });

    it('renders title and properties slots', () => {
        const now = new Date();
        const wrapper = mount(Container, {


            props: {

                grid: global.provide[EditorInjectionKey as unknown as number].grid,

                id: '0',
                element: {
                    instanceId: '',
                    elementId: '',
                    defaults: {
                        properties: {},
                        providedProperties: {},
                        consumedProperties: {}
                    },
                    connections: {
                        consumed: {},
                        provided: {}
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
