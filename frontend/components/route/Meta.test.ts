import {describe, it, expect} from 'vitest';
import MetaRoute from './Meta.vue';
import {mountSuspended} from "@nuxt/test-utils/runtime";

describe('Route', () => {
    describe('Meta', () => {
        it('renders', async () => {
            const component = await mountSuspended(MetaRoute, {
                props: {
                    title: 'Test',
                    route: {
                        id: 0,
                        tripId: 0,
                        name: '',
                        description: '',
                        segments: []
                    }
                }
            });
            expect(component.exists).toBeTruthy();
        });
    });
});
