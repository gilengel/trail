import {describe, expect, it} from 'vitest';
import WidgetLayoutComponent from '@/components/builder/WidgetLayout.vue';
import {mountSuspended} from "@nuxt/test-utils/runtime";
import {createTestGrid} from "~/stores/actions/test.helper";


describe('Component', () => {
    describe('WidgetLayoutComponent', () => {
        it('renders', async () => {
            const component = await mountSuspended(WidgetLayoutComponent, {
                props: {
                    tripId: 0,
                    grid: createTestGrid(2, 2)
                }
            });

            expect(component.exists()).toBeTruthy();
        });
    });
});
