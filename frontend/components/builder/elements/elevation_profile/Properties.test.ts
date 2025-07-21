import {describe, it, expect, vi} from 'vitest'
import ElevationProfileProperties from './Properties.vue'
import {mountSuspended} from "@nuxt/test-utils/runtime";
import {ElementType} from "~/types/grid";

const getByTripId = vi.fn();
vi.mock('@/stores/route', () => {
    return {
        useRouteStore: vi.fn(() => ({
            getByTripId,
        })),
    };
});

describe('Component', () => {
    describe('ElevationProfileProperties[Properties]', () => {
        it('renders', async () => {
            getByTripId.mockResolvedValue([]);

            const component = await mountSuspended(ElevationProfileProperties, {
                props: {
                    element: {
                        id: '0',
                        type: ElementType.ElevationProfile,
                        attributes: {
                            routeId: 0,
                            segmentsIds: []
                        }
                    }, selected: true
                }
            });
            expect(component.exists).toBeTruthy();
        })
    })
})
