import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import Container from "~/components/builder/properties/Container.vue";

describe('PropertyCard (with stubs)', () => {
    it('renders title and properties slots', () => {
        const wrapper = mount(Container, {
            global: {
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
