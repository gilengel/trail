import {describe, expect, it} from 'vitest';
import {mountSuspended} from "@nuxt/test-utils/runtime";
import TextAlignTypeComponent from '@/components/types/TextAlign.vue';

describe('GridEditor', () => {
    describe('Types', () => {
        describe('TextAlign', () => {
            it('renders', async () => {
                const component = await mountSuspended(TextAlignTypeComponent, {
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
