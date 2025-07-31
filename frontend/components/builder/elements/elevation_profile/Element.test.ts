import {describe, it, expect} from 'vitest';
import ElevationProfileComponent from '~/components/builder/elements/elevation_profile/Element.vue';
import {mountSuspended} from "@nuxt/test-utils/runtime";
import {ElementType, type Grid} from "~/types/grid";

describe('Component', () => {
    describe('ElevationProfile', () => {
        it('renders', async () => {
            const component = await mountSuspended(ElevationProfileComponent, {
                props: {
                    element: {
                        id: '0',
                        type: ElementType.Image,


                        attributes: {
                            segmentsIds: [],
                            routeId: 0,
                            color: 'rgb(255, 0, 0)'
                        },
                        providedProperties: [],
                        consumedProperties: [],
                        connectedProvidedProperties: [],
                        connectedConsumedProperties: []
                    },
                    selected: true,
                    highlighted: false,
                    grid: {tripId: 0, rows: []}
                }
            });
            expect(component.exists).toBeTruthy();
        });
    });
});
