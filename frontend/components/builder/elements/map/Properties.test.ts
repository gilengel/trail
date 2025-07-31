import {describe, it, expect, vi} from 'vitest';
import MapProperties from '~/components/builder/elements/map/Properties.vue';
import {mountSuspended} from "@nuxt/test-utils/runtime";
import {ElementType} from "~/types/grid";
import {createVuetify} from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import {SwitchModeKey} from "~/components/builder/BuilderMode";
import {mount} from "@vue/test-utils";

const getByTripId = vi.fn();
vi.mock('@/stores/route', () => {
    return {
        useRouteStore: vi.fn(() => ({
            getByTripId,
        })),
    };
});

const vuetify = createVuetify({
    components,
    directives,
})

describe('Component', () => {
    describe('Map[Properties]', () => {
        it('renders', () => {
            getByTripId.mockResolvedValue([]);

            const component = mount(MapProperties, {

                props: {
                    plugins: [vuetify],
                    provide: {
                        [SwitchModeKey]: vi.fn(),
                    },
                    element: {
                        id: '0',
                        type: ElementType.Map,
                        attributes: {
                            routeId: 0,
                            segmentsIds: []
                        },
                        providedProperties: [],
                        consumedProperties: [],
                        connectedProvidedProperties: {},
                        connectedConsumedProperties: {}
                    }, selected: true,
                    highlighted: false,
                    grid: {tripId: 0, rows: []}
                }
            });
            expect(component.exists).toBeTruthy();
        });
    });
});
