import {describe, it, expect} from 'vitest';
import AddRoute from './Add.vue';
import {mountSuspended} from "@nuxt/test-utils/runtime";

describe('Route', () => {
    describe('Add', () => {
        it('renders', async () => {
            const component = await mountSuspended(AddRoute, {});
            expect(component.exists).toBeTruthy();
        });
    });
});
