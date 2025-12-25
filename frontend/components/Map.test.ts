/**
 * @file Unit tests for the map element.
 */
import { mount, VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import MapComponent from "~/components/Map.vue";
import {
  LngLatWithElevation,
  MapLibreSegment,
  MapLibreRoute,
} from "~/types/route";

vi.mock("uuid", () => ({
  v4: vi.fn(() => "0"),
}));

import { LngLatBounds, Map } from "maplibre-gl";

describe("MapComponent", () => {
  let wrapper: VueWrapper<ComponentPublicInstance<typeof MapComponent>>;

  const segment = new MapLibreSegment(
    0,
    "test_segment",
    [new LngLatWithElevation(0, 0, 0), new LngLatWithElevation(0, 1, 0)],
    "red",
  );
  const mockTrip = new MapLibreRoute(0, "test_route", [segment], "");

  describe("without trip and segment props", () => {
    beforeEach(() => {
      (Map as unknown as Mock).mockClear();

      wrapper = mount(MapComponent);
    });

    it("renders the map container without adding lines if no segment or trip provided", () => {
      expect(wrapper.find('[data-cy="map-container"]').exists()).toBe(true);

      const mockMapInstance = (Map as unknown as Mock).mock.results[0]!.value;
      expect(mockMapInstance.addSource).not.toHaveBeenCalled();
      expect(mockMapInstance.addLayer).not.toHaveBeenCalled();
    });
  });

  describe("with segments", () => {
    beforeEach(() => {
      (Map as unknown as Mock).mockClear();

      wrapper = mount(MapComponent, {
        props: { segments: [segment] },
      });
    });

    it("renders the map container", () => {
      expect(wrapper.find('[data-cy="map-container"]').exists()).toBe(true);
    });

    it("removes a line segment if segments prop changes", async () => {
      await wrapper.setProps({
        segments: [
          new MapLibreSegment(
            1,
            "test_segment",
            [
              new LngLatWithElevation(0, 0, 0),
              new LngLatWithElevation(1, 1, 0),
            ],
            "red",
          ),
          new MapLibreSegment(
            2,
            "test_segment",
            [
              new LngLatWithElevation(1, 1, 0),
              new LngLatWithElevation(2, 2, 0),
            ],
            "orange",
          ),
        ],
      });

      await wrapper.setProps({ segments: [] });

      const mockMapInstance = (Map as unknown as Mock).mock.results[0]!.value;
      expect(mockMapInstance.removeSource).toHaveBeenCalled();
      expect(mockMapInstance.removeLayer).toHaveBeenCalled();
    });

    it("adds a line segment if segments prop changes", async () => {
      const mockMapInstance = (Map as unknown as Mock).mock.results[0]!.value;

      await wrapper.setProps({
        segments: [
          new MapLibreSegment(
            1,
            "test_segment",
            [
              new LngLatWithElevation(0, 0, 0),
              new LngLatWithElevation(1, 1, 0),
            ],
            "red",
          ),
          new MapLibreSegment(
            2,
            "test_segment",
            [
              new LngLatWithElevation(1, 1, 0),
              new LngLatWithElevation(2, 2, 0),
            ],
            "orange",
          ),
        ],
      });

      expect(mockMapInstance.addSource).toHaveBeenCalledTimes(2);
      expect(mockMapInstance.addLayer).toHaveBeenCalledTimes(2);
    });
  });

  describe("with route", () => {
    beforeEach(() => {
      vi.clearAllMocks();

      wrapper = mount(MapComponent, {
        props: { trip: mockTrip },
      });
    });

    it("renders the map container", () => {
      expect(wrapper.find('[data-cy="map-container"]').exists()).toBe(true);
    });

    /*
            it('initializes the map on mount with correct options', () => {
                expect(MockMap).toHaveBeenCalledWith({
                    container: expect.any(HTMLElement),
                    style: expect.stringContaining('/assets/map_styles/terrain.json'),
                    center: {lat: 0, lng: 0},
                    zoom: 16,
                })
            })


            it('adds trip segments as lines on a map load', () => {
                const addSourceSpy = (MockMap as any).mock.instances[0].addSource
                const addLayerSpy = (MockMap as any).mock.instances[0].addLayer

               // wrapper.vm.map.value.emit('load')

                expect(addSourceSpy).toHaveBeenCalledTimes(mockTrip.segments.length)
                expect(addLayerSpy).toHaveBeenCalledTimes(mockTrip.segments.length)
            })
            */

    it("calls addLine with the correct parameters", () => {
      const coordinates = [
        [0, 0],
        [1, 1],
      ];
      const style = { width: 5, color: "#f00" };

      // Call addLine to trigger addSource and addLayer
      wrapper.vm.addLine(0, coordinates, style);

      // Directly reference the mock instance of Map
      const mockMapInstance = (Map as unknown as Mock).mock.results[0]!.value;
      expect(mockMapInstance.addSource).toHaveBeenCalledWith("route_0", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates,
          },
        },
      });

      expect(mockMapInstance.addLayer).toHaveBeenCalledWith({
        id: "route_0",
        type: "line",
        source: "route_0",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": style.color, "line-width": style.width },
      });
    });

    it("zooms to the entire trip with fitBounds and pan", () => {
      wrapper.vm.zoomToTrip(mockTrip, false);

      const mockMapInstance = (Map as unknown as Mock).mock.results[0]!.value;
      expect(mockMapInstance.fitBounds).toHaveBeenCalledWith(mockTrip.bounds, {
        padding: { top: 10, bottom: 25, left: 15, right: 5 },
        animate: false,
      });
    });

    it("zooms to a single segment", () => {
      const mockSegment = { bounds: new LngLatBounds([0, 0], [5, 5]) };
      wrapper.vm.zoomToSegment(mockSegment, true);

      const mockMapInstance = (Map as unknown as Mock).mock.results[0]!.value;
      expect(mockMapInstance.fitBounds).toHaveBeenCalledWith(
        mockSegment.bounds,
        { padding: { top: 10, bottom: 25, left: 15, right: 5 }, animate: true },
      );
    });

    it("fits bounds with padding and animation option", () => {
      const bounds = new LngLatBounds([0, 0], [10, 10]);
      wrapper.vm.fitBounds(bounds, false);

      const mockMapInstance = (Map as unknown as Mock).mock.results[0]!.value;
      expect(mockMapInstance.fitBounds).toHaveBeenCalledWith(bounds, {
        padding: { top: 10, bottom: 25, left: 15, right: 5 },
        animate: false,
      });
    });
  });
});
