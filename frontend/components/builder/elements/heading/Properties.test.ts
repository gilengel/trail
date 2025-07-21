import {describe, it, expect, vi} from 'vitest'
import HeadingProperties from './Properties.vue'
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
    describe('Map[Properties]', () => {
        it('renders', async () => {
            const component = await mountSuspended(HeadingProperties, {
                props: {
                    element: {
                        id: '0',
                        type: ElementType.Map,
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
