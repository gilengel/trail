import {describe, it, expect} from 'vitest';
import SwitchComponent from '@/components/ThemeToggleButton.vue';
import {mountSuspended} from "@nuxt/test-utils/runtime";

describe('Component', () => {
    describe('ThemeToggleButton', () => {
        it('renders with initial checked state based on isLight', async () => {
            const component = await mountSuspended(SwitchComponent);

            const checkbox = component.find('input[type="checkbox"]').element as HTMLInputElement;
            expect(checkbox.checked).toBe(false);
        });
    });
});
