import { describe, it, expect, vi } from "vitest";
import { mountSuspended, renderSuspended } from "@nuxt/test-utils/runtime";
import { MapLibreSegment, MapLibreTrip } from "~/data/routes/types";
import MapTMap from "~/components/map/TMap.vue";
import { LngLat } from "maplibre-gl";

const segment = new MapLibreSegment(
  0,
  "test_segment",
  [
    new LngLat(-122.4833858013153, 37.829607404976734),
    new LngLat(-122.4830961227417, 37.82932776098012),
    new LngLat(-122.4830746650696, 37.82932776098012),
    new LngLat(-122.48218417167662, 37.82889558180985),
    new LngLat(-122.48218417167662, 37.82890193740421),
    new LngLat(-122.48221099376678, 37.82868372835086),
    new LngLat(-122.4822163581848, 37.82868372835086),
    new LngLat(-122.48205006122589, 37.82801003030873),
  ],
  "red"
);

const trip = new MapLibreTrip(0, "test_trip", [segment]);

describe("Component", () => {
  describe("Map", () => {
    it("", () => {});
    /*
    it("should render the map properly on start", async () => {
      const component = await renderSuspended(MapTMap, { props: { trip } });
      //expect(
      //  component.get('[data-cy="map-container"]').classes("maplibregl-map")
      //).toBeTruthy();
    });

  
    it("should pan to new location", () => {
      cy.mount(MapTMap as any).then(({ wrapper }) => {
        wrapper.vm.panTo(new L.LatLng(10, 10));

        cy.get(".leaflet-map-pane")
          .then(($el) => {
            return window.getComputedStyle($el[0]);
          })
          .invoke("getPropertyValue", "transform")
          .should("equal", "matrix(1, 0, 0, 1, 3660, -659)");
      });
    });

    it("should fit view to bounds", () => {
      cy.mount(MapTMap as any).then(({ wrapper }) => {
        const southWest = L.latLng(30.712, -74.227);
        const northEast = L.latLng(90.774, -74.125);
        const bounds = L.latLngBounds(southWest, northEast);

        wrapper.vm.fitBounds(bounds);

        cy.get(".leaflet-zoom-animated")
          .first()
          .then(($el) => {
            return window.getComputedStyle($el[0]);
          })
          .invoke("getPropertyValue", "transform")
          .should("equal", "matrix(0.0625, 0, 0, 0.0625, 703, 467)");
      });
    });

    it("should zoom to segment", () => {
      cy.mount(MapTMap as any).then(({ wrapper }) => {
        const start = L.latLng(30.712, -74.227);
        const end = L.latLng(90.774, -74.125);

        const segment = new MapLibreSegment(
          0,
          "segment",
          [start, end],
          "rgb(255, 0, 0)"
        );

        wrapper.vm.zoomToSegment(segment);

        cy.get(".leaflet-zoom-animated")
          .first()
          .then(($el) => {
            return window.getComputedStyle($el[0]);
          })
          .invoke("getPropertyValue", "transform")
          .should("equal", "matrix(0.0625, 0, 0, 0.0625, -6788, -1919)");
      });
    });

    it("should zoom to segment with a route containing only one segment", () => {
      cy.mount(MapTMap as any).then(({ wrapper }) => {
        const start = L.latLng(30.712, -74.227);
        const end = L.latLng(90.774, -74.125);

        const segment = new MapLibreSegment(
          0,
          "segment",
          [start, end],
          "rgb(255, 0, 0)"
        );

        wrapper.vm.zoomToSegments([segment]);

        cy.get(".leaflet-zoom-animated")
          .first()
          .then(($el) => {
            console.log(window.getComputedStyle($el[0]));
            return window.getComputedStyle($el[0]);
          })
          .invoke("getPropertyValue", "transform")
          .should("equal", "matrix(0.0625, 0, 0, 0.0625, -6788, -1919)");
      });
    });

    it("should zoom to segments", () => {
      cy.mount(MapTMap as any).then(({ wrapper }) => {
        const segments: MapLibreSegment[] = [];
        const coordinates = [
          [L.latLng(69.790853, 30.794443), L.latLng(29.07997, 7.508152)],
          [L.latLng(29.07997, 7.508152), L.latLng(7.94894, 0.074356)],
        ];

        for (let i = 0; i < coordinates.length; i++) {
          segments.push(
            new MapLibreSegment(
              i,
              `segment_${i}`,
              coordinates[i],
              "rgb(255, 0, 0)"
            )
          );
        }

        wrapper.vm.zoomToSegments(segments);

        cy.get(".leaflet-zoom-animated")
          .first()
          .then(($el) => {
            return window.getComputedStyle($el[0]);
          })
          .invoke("getPropertyValue", "transform")
          .should("equal", "matrix(0.0625, 0, 0, 0.0625, -2965, -490)");
      });
    });

    it("should not zoom if segments are empty", () => {
      cy.mount(MapTMap as any).then(({ wrapper }) => {
        wrapper.vm.zoomToSegments([]);

        cy.get(".leaflet-zoom-animated")
          .first()
          .then(($el) => {
            return window.getComputedStyle($el[0]);
          })
          .invoke("getPropertyValue", "transform")
          .should("equal", "matrix(1, 0, 0, 1, 0, 0)");
      });
    });

    it("should add an element to the map", () => {
      cy.mount(MapTMap as any).then(({ wrapper }) => {
        const start = L.latLng(30.712, -74.227);

        wrapper.vm.add(new L.Marker(start));

        cy.get(".leaflet-marker-pane > img").should("have.length", 1);
      });
    });
    */
  });
});
