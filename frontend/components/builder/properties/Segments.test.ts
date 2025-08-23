import {describe, it, expect, vi} from "vitest";
import Segments from "~/components/builder/properties/Segments.vue";
import {mount} from "@vue/test-utils";
import {createVuetify} from "vuetify";
import {config} from '@vue/test-utils';

const mockRoutes = [
    {
        tripId: 0,
        description: "",
        id: 1,
        name: 'Route A',
        segments: [
            {id: 10, name: 'Segment X'},
            {id: 20, name: 'Segment Y'},
        ],
    },
    {
        tripId: 0,
        description: "",
        id: 2,
        name: 'Route B',
        segments: [
            {id: 30, name: 'Segment Z'},
        ],
    },
];

describe('Component', () => {
    describe('Segments', () => {
        it('renders warning when isConsumed is true', () => {
            const wrapper = mount(Segments, {
                global: {
                    plugins: [createVuetify()]
                },
                props: {
                    isConsumed: true,
                    routes: [],
                    segmentsIds: [],
                    routeId: undefined,
                },
            });
            expect(wrapper.findComponent({name: 'VAlert'}).exists()).toBe(true);
        });

        it('returns [] if route not found', () => {
            const wrapper = mount(Segments, {
                global: {
                    plugins: [createVuetify()]
                },
                props: {
                    isConsumed: false,
                    routes: [],
                    segmentsIds: [],
                    routeId: 1, // Not found
                },
            });
            expect((wrapper.vm as any).segments).toEqual([]);
        });

        it('returns segments from selectedRoute when no routeId', async () => {
            const wrapper = mount(Segments, {
                global: {
                    plugins: [createVuetify()]
                },
                props: {
                    isConsumed: false,
                    routes: [{
                        tripId: 0,
                        description: "",
                        id: 99,
                        name: 'Dynamic Route',
                        segments: [{id: 101, name: 'Dynamic Segment'}],
                    }],
                    segmentsIds: [],
                    routeId: undefined,
                },
            });

            await (wrapper.vm as any).selectedRouteChanged({
                id: 99,
                name: 'Dynamic Route',
                segments: [{id: 101, name: 'Dynamic Segment'}],
            });

            expect((wrapper.vm as any).segments).toEqual([{id: 101, name: 'Dynamic Segment'}]);
        });

        it('emits both routeId and segmentIds when a segment is selected', async () => {
            const wrapper = mount(Segments, {
                global: {
                    plugins: [createVuetify()]
                },
                props: {
                    isConsumed: false,
                    routes: mockRoutes,
                    segmentsIds: [],
                    routeId: 1,
                },
            });

            (wrapper.vm as any).selection = [10, 20];
            await wrapper.vm.$nextTick();

            expect(wrapper.emitted('update:selectedRouteId')).toEqual([[1]]);
            expect(wrapper.emitted('update:selectedSegmentIds')).toEqual([[[10, 20]]]);
        });

        it('emits update:selectedRouteId when selectedRouteChanged is called', async () => {
            const wrapper = mount(Segments, {
                global: {
                    plugins: [createVuetify()]
                },
                props: {
                    isConsumed: false,
                    routes: mockRoutes,
                    segmentsIds: [],
                    routeId: undefined,
                },
            });

            (wrapper.vm as any).selectedRouteChanged(mockRoutes[1]);

            expect(wrapper.emitted('update:selectedRouteId')).toEqual([[2]]);
        });

        it('does NOT emit when segments are selected and routeId is null', async () => {
            const errorSpy = vi.fn();
            const originalHandler = config.global.config.errorHandler;
            config.global.config.errorHandler = errorSpy;

            const wrapper = mount(Segments, {
                global: {
                    plugins: [createVuetify()],
                },
                props: {
                    isConsumed: false,
                    routes: mockRoutes,
                    segmentsIds: [],
                    routeId: undefined,
                },
            });

            (wrapper.vm as any).selection = [10];
            await wrapper.vm.$nextTick();

            expect(errorSpy).toHaveBeenCalled();
            const [[thrownError]] = errorSpy.mock.calls;
            expect(thrownError.message).toMatch(/SegmentsComponent set selectedSegments without a valid routeID/);

            expect(wrapper.emitted('update:selectedRouteId')).toBeFalsy();
            expect(wrapper.emitted('update:selectedSegmentIds')).toBeFalsy();

            // Restore original handler
            config.global.config.errorHandler = originalHandler;
        });

    });
});
