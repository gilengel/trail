import { describe, it, expect, vi } from "vitest";

import { mockComponent, mountSuspended } from "@nuxt/test-utils/runtime";
import TripMap from "./Map.vue";
import { MapLibreTrip, MapLibreSegment } from "~/data/routes/types";
import { LngLat } from "maplibre-gl";
const testRouteSegment = new MapLibreSegment(
  0,
  "test_segment",
  [
    new LngLat(47.387563828378916, 10.939971758052707),
    new LngLat(47.38756508566439, 10.939996987581253),
    new LngLat(47.38756240345538, 10.940024564042687),
    new LngLat(47.387563828378916, 10.939971758052707),
  ],
  "rgb(255, 0, 0)",
  "description"
);

const testRoute: MapLibreTrip = new MapLibreTrip(0, "test_route", [
  testRouteSegment,
]);
/*
const markers: Feature[] = [
  new Feature({
    geometry: new Point([47.387563828378916, 10.939971758052707]),
  }),
  new Feature({ geometry: new Point([47.38756508566439, 10.939996987581253]) }),
  new Feature({ geometry: new Point([47.38756240345538, 10.940024564042687]) }),
  new Feature({
    geometry: new Point([47.387563828378916, 10.939971758052707]),
  }),
];
*/

mockComponent("MapTMap", {
  props: {
    value: String,
  },
  setup(props) {
    // ...
  },
});

describe("Component", () => {
  describe("TripMap", () => {
    it("should render the trip details", async () => {
      const component = await mountSuspended(TripMap, {
        props: { trip: testRoute, a: "Cow" },
      });
      expect(component.get('[data-cy="trip-details"]')).toBeTruthy();
    });

    /*
  
    //TODO: I don't know why but passing the props to the component does not work (cypress makes them undefined) -> disabled for now
    it("should render the provided markers", async () => {
      const component = await mountSuspended(TripMap, {
        props: {
          trip: testRoute,
          markers,
        },
      });

      // 6 as 2 are added for the trip, 4 as custom markers
      cy.get(".leaflet-marker-icon").should("have.length", 6);
    });

  
    it("should zoom to the segment the user clicked on", async () => {
      cy.intercept("GET", "/api/routes/1", {
        statusCode: 200,
        body: {
          id: "1",
          name: "Ehrwald Hiking",
          segments: [
            {
              id: 1,
              name: "Ehrwald Hiking",
              coordinates: [
                [47.387563828378916, 10.939971758052707, 1127.800048828125],
                [47.38756508566439, 10.939996987581253, 1128],
                [47.38756240345538, 10.940024564042687, 1128.199951171875],
                [47.387563828378916, 10.939971758052707, 1127.800048828125],
              ],
            },
          ],
        },
      });

      let zoomed = false;
      const component = await mountSuspended(TripMap, {
        stubs: {
          Map: {
            methods: {
              add: () => {},
              zoomToSegment: () => {
                zoomed = true;

                expect(zoomed).to.be.true;
              },
            },
            expose: ["add", "zoomToSegment"],
          },
        },

        props: { trip: testRoute, markers },
      });
      cy.get('[data-cy="trip-segment"]').click();
    });
    */
  });
});
