import {describe, it, expect, vi} from 'vitest';
import ElevationProfilePropertiesComponent from './Properties.vue';
import {mountSuspended} from "@nuxt/test-utils/runtime";
import {Element, ElementType} from "~/types/grid";
import type {ElevationProfileProperties} from "~/components/builder/elements/elevation_profile/Properties";
import {SwitchModeKey} from "~/components/builder/BuilderMode";

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
        const mockSwitchMode = vi.fn();
        
        it('renders', async () => {
            getByTripId.mockResolvedValue([]);

            const element = new Element<ElevationProfileProperties, ["segmentsIds", "routeId"], ["segmentsIds", "routeId"]>('0', ElementType.ElevationProfile, {
                routeId: 0,
                segmentsIds: []
            }, ["segmentsIds", "routeId"], ["segmentsIds", "routeId"], {}, {});
            const component = await mountSuspended(ElevationProfilePropertiesComponent, {
                provide: {
                    [SwitchModeKey]: mockSwitchMode,
                },
                props: {
                    element,
                    selected: true,
                    highlighted: false,
                    grid: {tripId: 0, rows: []}
                }
            });
            expect(component.exists).toBeTruthy();
        });
    });
});
