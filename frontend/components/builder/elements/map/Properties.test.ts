import {describe, it, expect, vi} from 'vitest';
import MapProperties from '~/components/builder/elements/map/Properties.vue';
import {createVuetify} from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import {mount} from "@vue/test-utils";
import {createMockElement} from "~/components/builder/elements/map/__mocks__";

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
});

describe('Component', () => {
    describe('Map[Properties]', () => {
        it('renders', () => {
            getByTripId.mockResolvedValue([]);

            const component = mount(MapProperties, {

                props: {
                    plugins: [vuetify],
                    provide: {},
                    element: createMockElement(),
                    grid: {tripId: 0, rows: []}
                }
            });
            expect(component.exists).toBeTruthy();
        });
    });
});
