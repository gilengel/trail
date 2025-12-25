import {describe, expect, it} from 'vitest';
import {mountSuspended} from "@nuxt/test-utils/runtime";
import TextTypeComponent from '@/components/types/Text.vue';

describe('GridEditor', () => {
    describe('Types', () => {
        describe('Text', () => {
            it('renders', async () => {
                const component = await mountSuspended(TextTypeComponent, {
                    props: {
                        config: {
                            type: 'custom',
                            label: 'text'
                        },
                        propertyKey: '',
                        modelValue: ''
                    }
                });
                expect(component.exists()).toBeTruthy();
            });
        })
    });
});
