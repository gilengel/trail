import {describe, expect, it} from 'vitest';
import ToolbarButtonComponent from '@/components/ToolbarButton.vue';
import {mountSuspended} from "@nuxt/test-utils/runtime";


describe('Component', () => {
    describe('ToolbarButton', () => {
        it('renders', async () => {
            const component = await mountSuspended(ToolbarButtonComponent, {
                props: {
                    icon: 'las la-question-circle',
                    tooltip: ''
                }
            });
            expect(component.exists()).toBeTruthy();
        });

        it('emits a click event when clicked', async () => {
            // Mount the component with necessary props
            const wrapper = await mountSuspended(ToolbarButtonComponent, {
                props: {
                    icon: 'las la-question-circle',
                    tooltip: '',
                    isActive: true
                },
                global: {
                    stubs: {
                        VTooltip: {
                            template: '<span><slot></slot></span>' // Stubbing tooltip to prevent teleporting
                        }
                    }
                }
            });

            const button = wrapper.findComponent('[data-testid="tooltip-button"]');
            await button.trigger('click');
            expect(wrapper.emitted('click')).toHaveLength(1);
        });
    });
});
