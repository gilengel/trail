import {mount} from '@vue/test-utils'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import MapComponent from "~/components/TMap.vue";
import {LngLat, LngLatBounds, Map as MockMap} from 'maplibre-gl'
import {MapLibreSegment, MapLibreTrip} from "~/data/routes/types";

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
            addLayer: vi.fn(),
            fitBounds: vi.fn(),
            panTo: vi.fn(),
        };
    })
    const LngLatBounds = vi.fn(() => ({
        extend: vi.fn(),
        getCenter: vi.fn(() => ({lat: 0, lng: 0})),
    }))

    const LngLat = vi.fn((lng, lat) => ({
        lng,
        lat,
        toArray: vi.fn(() => [lng, lat]),
    }))
    return {Map: MockMap, LngLat, LngLatBounds}
})

vi.mock('uuid', () => ({
    v4: vi.fn(() => 'unique-id'),
}))

describe('MapComponent', () => {
    let wrapper: any

    const segment = new MapLibreSegment(
        0,
        "test_segment",
        [
            new LngLat(0, 0),
            new LngLat(1, 1)
        ],
        "red"
    );
    const mockTrip = new MapLibreTrip(0, 'test_route', [segment], '');


    beforeEach(() => {
        vi.clearAllMocks()

        wrapper = mount(MapComponent, {
            props: {trip: mockTrip},
        })
    })

    it('renders the map container', () => {
        expect(wrapper.find('[data-cy="map-container"]').exists()).toBe(true)
    })

    it('initializes the map on mount with correct options', () => {
        expect(MockMap).toHaveBeenCalledWith({
            container: expect.any(HTMLElement),
            style: expect.stringContaining('/assets/map_styles/terrain.json'),
            center: {lat: 0, lng: 0},
            zoom: 16,
        })
    })

    /*
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
        wrapper.vm.addLine(coordinates, style)

        // Directly reference the mock instance of Map
        const mockMapInstance = (MockMap as any).mock.results[0].value;
        expect(mockMapInstance.addSource).toHaveBeenCalledWith(
            'route_unique-id',
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
            id: 'route_unique-id',
            type: 'line',
            source: 'route_unique-id',
            layout: {'line-join': 'round', 'line-cap': 'round'},
            paint: {'line-color': style.color, 'line-width': style.width},
        })
    })

    it('zooms to the entire trip with fitBounds and pan', () => {
        wrapper.vm.zoomToTrip(mockTrip, false)

        const mockMapInstance = (MockMap as any).mock.results[0].value;
        expect(mockMapInstance.fitBounds).toHaveBeenCalledWith(
            mockTrip.bounds,
            {padding: {top: 10, bottom: 25, left: 15, right: 5}, animate: false}
        )
    })

    it('zooms to a single segment', () => {
        const mockSegment = {bounds: new LngLatBounds([0, 0], [5, 5])}
        wrapper.vm.zoomToSegment(mockSegment, true)

        const mockMapInstance = (MockMap as any).mock.results[0].value;
        expect(mockMapInstance.fitBounds).toHaveBeenCalledWith(
            mockSegment.bounds,
            {padding: {top: 10, bottom: 25, left: 15, right: 5}, animate: true}
        )
    })

    it('fits bounds with padding and animation option', () => {
        const bounds = new LngLatBounds([0, 0], [10, 10])
        wrapper.vm.fitBounds(bounds, false)

        const mockMapInstance = (MockMap as any).mock.results[0].value;
        expect(mockMapInstance.fitBounds).toHaveBeenCalledWith(
            bounds,
            {padding: {top: 10, bottom: 25, left: 15, right: 5}, animate: false}
        )
    })
})