import {describe, expect, it} from 'vitest';
import {mountSuspended} from "@nuxt/test-utils/runtime";
import LevelTypeComponent from '@/components/builder/elements/heading/types/Level.vue';
import {createVuetify} from "vuetify/framework";

describe('GridEditor', () => {
    describe('Types', () => {
        describe('Level', () => {
            it('renders', async () => {
                const component = await mountSuspended(LevelTypeComponent, {
                    props: {
                        config: {
                            type: 'custom',
                            label: 'level'
                        },
                        propertyKey: '',
                        modelValue: 1
                    }
                });
                expect(component.exists()).toBeTruthy();
            });

            it('emits "update:modelValue" when a level was selected', async () => {
                const wrapper = await mountSuspended(LevelTypeComponent, {
                    global: {
                        plugins: [createVuetify()]
                    },
                    props: {
                        config: {
                            type: 'custom',
                            label: 'level'
                        },
                        propertyKey: '',
                        modelValue: 1
                    },
                });

                const button = wrapper.find('[data-testid="editor-level-h3-btn"]');
                expect(button.exists()).toBe(true);

                await button.trigger('click');
                await nextTick();


                const emitted = wrapper.emitted('update:modelValue');
                expect(emitted).toBeTruthy();
                expect(emitted![0][0]).toEqual(2);
            });

        })
    });
});
