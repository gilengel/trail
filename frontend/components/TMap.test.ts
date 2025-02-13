/**
 * @file Unit tests for the map element.
 */
import {mount, VueWrapper} from '@vue/test-utils'
import {beforeEach, describe, expect, it, type Mock, vi} from 'vitest'
import MapComponent from "~/components/TMap.vue";
import {LngLatBounds, Map as MockMap} from 'maplibre-gl'
import {LngLatWithElevation, MapLibreSegment, MapLibreTrip} from "~/types/route";

// Mock maplibre-gl components and methods
vi.mock('maplibre-gl', () => {
    const MockMap = vi.fn(() => {
        return {
            setCenter: vi.fn(),
            setZoom: vi.fn(),
            on: vi.fn((event, callback) => {
                if (event === 'load') callback();
            }),
            addSource: vi.fn(),
            removeSource: vi.fn(),
            addLayer: vi.fn(),
            removeLayer: vi.fn(),
            fitBounds: vi.fn(),
            panTo: vi.fn(),
        };
    })
    const LngLatBounds = vi.fn(() => ({
        extend: vi.fn(),
        getCenter: vi.fn(() => ({lat: 0, lng: 0})),
        isEmpty: vi.fn(() => false)
    }))

    const LngLat = vi.fn((lng, lat) => ({
        lng,
        lat,
        toArray: vi.fn(() => [lng, lat]),
    }))
    return {Map: MockMap, LngLat, LngLatBounds}
})

vi.mock('uuid', () => ({
    v4: vi.fn(() => '0'),
}))

describe('MapComponent', () => {
    let wrapper: VueWrapper<ComponentPublicInstance<typeof MapComponent>>;

    const segment = new MapLibreSegment(
        0,
        "test_segment",
        [
            new LngLatWithElevation(0, 0, 0),
            new LngLatWithElevation(0, 1, 0)
        ],
        "red"
    );
    const mockTrip = new MapLibreTrip(0, 'test_route', [segment], '');

    describe('without trip and segment props', () => {
        beforeEach(() => {
            (MockMap as Mock).mockClear();

            wrapper = mount(MapComponent)
        })

        it('renders the map container without adding lines if no segment or trip provided', () => {
            expect(wrapper.find('[data-cy="map-container"]').exists()).toBe(true);

            const mockMapInstance = (MockMap as Mock).mock.results[0].value;
            expect(mockMapInstance.addSource).not.toHaveBeenCalled();
            expect(mockMapInstance.addLayer).not.toHaveBeenCalled();
        })
    })


    describe('with segments', () => {
        beforeEach(() => {
            (MockMap as Mock).mockClear();

            wrapper = mount(MapComponent, {
                props: {segments: [segment]},
            })
        })

        it('renders the map container', () => {
            expect(wrapper.find('[data-cy="map-container"]').exists()).toBe(true)
        })

        it('removes a line segment if segments prop changes', async () => {
            await wrapper.setProps({segments: []})

            const mockMapInstance = (MockMap as Mock).mock.results[0].value;
            expect(mockMapInstance.removeSource).toHaveBeenCalled();
            expect(mockMapInstance.removeLayer).toHaveBeenCalled();
        })

        it('adds a line segment if segments prop changes', async () => {
            const mockMapInstance = (MockMap as Mock).mock.results[0].value;
            expect(mockMapInstance.addSource).toHaveBeenCalledOnce();
            expect(mockMapInstance.addLayer).toHaveBeenCalledOnce();

            await wrapper.setProps({
                segments: [
                    new MapLibreSegment(
                        1,
                        "test_segment",
                        [
                            new LngLatWithElevation(0, 0, 0),
                            new LngLatWithElevation(1, 1, 0)
                        ],
                        "red"
                    ),
                    new MapLibreSegment(
                        2,
                        "test_segment",
                        [
                            new LngLatWithElevation(1, 1, 0),
                            new LngLatWithElevation(2, 2, 0)
                        ],
                        "orange"
                    )

                ]
            })


            expect(mockMapInstance.addSource).toHaveBeenCalledTimes(3);
            expect(mockMapInstance.addLayer).toHaveBeenCalledTimes(3);
        })
    })

    describe('with route', () => {
        beforeEach(() => {
            vi.clearAllMocks()

            wrapper = mount(MapComponent, {
                props: {trip: mockTrip},
            })
        })

        it('renders the map container', () => {
            expect(wrapper.find('[data-cy="map-container"]').exists()).toBe(true)
        })

        /*
        it('initializes the map on mount with correct options', () => {
            expect(MockMap).toHaveBeenCalledWith({
                container: expect.any(HTMLElement),
                style: expect.stringContaining('/assets/map_styles/terrain.json'),
                center: {lat: 0, lng: 0},
                zoom: 16,
            })
        })


        it('adds trip segments as lines on map load', () => {
            const addSourceSpy = (MockMap as any).mock.instances[0].addSource
            const addLayerSpy = (MockMap as any).mock.instances[0].addLayer

           // wrapper.vm.map.value.emit('load')

            expect(addSourceSpy).toHaveBeenCalledTimes(mockTrip.segments.length)
            expect(addLayerSpy).toHaveBeenCalledTimes(mockTrip.segments.length)
        })
        */

        it('calls addLine with the correct parameters', () => {
            const coordinates = [
                [0, 0],
                [1, 1],
            ]
            const style = {width: 5, color: '#f00'}

            // Call addLine to trigger addSource and addLayer
            wrapper.vm.addLine(0, coordinates, style)

            // Directly reference the mock instance of Map
            const mockMapInstance = (MockMap as Mock).mock.results[0].value;
            expect(mockMapInstance.addSource).toHaveBeenCalledWith(
                'route_0',
                {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates,
                        },
                    },
                }
            )

            expect(mockMapInstance.addLayer).toHaveBeenCalledWith({
                id: 'route_0',
                type: 'line',
                source: 'route_0',
                layout: {'line-join': 'round', 'line-cap': 'round'},
                paint: {'line-color': style.color, 'line-width': style.width},
            })
        })

        it('zooms to the entire trip with fitBounds and pan', () => {
            wrapper.vm.zoomToTrip(mockTrip, false)

            const mockMapInstance = (MockMap as Mock).mock.results[0].value;
            expect(mockMapInstance.fitBounds).toHaveBeenCalledWith(
                mockTrip.bounds,
                {padding: {top: 10, bottom: 25, left: 15, right: 5}, animate: false}
            )
        })

        it('zooms to a single segment', () => {
            const mockSegment = {bounds: new LngLatBounds([0, 0], [5, 5])}
            wrapper.vm.zoomToSegment(mockSegment, true)

            const mockMapInstance = (MockMap as Mock).mock.results[0].value;
            expect(mockMapInstance.fitBounds).toHaveBeenCalledWith(
                mockSegment.bounds,
                {padding: {top: 10, bottom: 25, left: 15, right: 5}, animate: true}
            )
        })

        it('fits bounds with padding and animation option', () => {
            const bounds = new LngLatBounds([0, 0], [10, 10])
            wrapper.vm.fitBounds(bounds, false)

            const mockMapInstance = (MockMap as Mock).mock.results[0].value;
            expect(mockMapInstance.fitBounds).toHaveBeenCalledWith(
                bounds,
                {padding: {top: 10, bottom: 25, left: 15, right: 5}, animate: false}
            )
        })
    })
})