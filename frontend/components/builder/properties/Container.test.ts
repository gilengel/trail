import {describe, it, expect, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import Container from "~/components/builder/properties/Container.vue";
import {SwitchModeKey} from "~/components/builder/BuilderMode";
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import {createVuetify} from "vuetify";

const vuetify = createVuetify({
    components,
    directives,
});

describe('PropertyCard (with stubs)', () => {
    it('renders title and properties slots', () => {
        const mockSwitchMode = vi.fn();

        const wrapper = mount(Container, {
            props: {
                grid: {
                    tripId: 0,
                    rows: []
                },

                id: '0',
                properties: {},
                providedProperties: [],
                consumedProperties: [],
            },
            
            global: {
                plugins: [vuetify],
                provide: {
                    [SwitchModeKey]: mockSwitchMode,
                },
                stubs: {
                    VCard: {template: '<div class="v-card"><slot /></div>'},
                    VCardTitle: {template: '<div class="v-card-title"><slot /></div>'},
                    VCardText: {template: '<div class="v-card-text"><slot /></div>'},
                },
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
