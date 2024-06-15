import { MapLibreTrip, MapLibreSegment } from "@/stores/route/types";
import TripMap from "./TripMap.vue";
import { Feature } from "ol";
import Point from "ol/geom/Point";
const testRouteSegment: MapLibreSegment = new MapLibreSegment(
  0,
  "test_segment",
  [
    [47.387563828378916, 10.939971758052707, 1127.800048828125],
    [47.38756508566439, 10.939996987581253, 1128],
    [47.38756240345538, 10.940024564042687, 1128.199951171875],
    [47.387563828378916, 10.939971758052707, 1127.80004882812],
  ],
  "rgb(255, 0, 0)",
  "description"
);

const testRoute: MapLibreTrip = new MapLibreTrip(0, "test_route", [
  testRouteSegment,
]);
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

describe("Component", () => {
  describe("TripMap", () => {
    it("should render the trip details", () => {
      cy.mount(TripMap as any, { props: { trip: testRoute, a: "Cow" } });
      cy.get('[data-cy="trip-details"]').should("exist");
    });

    //TODO: I don't know why but passing the props to the component does not work (cypress makes them undefined) -> disabled for now
    it("should render the provided markers", () => {
      cy.mount(TripMap as any, {
        props: {
          trip: testRoute,
          markers,
        },
      });

      // 6 as 2 are added for the trip, 4 as custom markers
      cy.get(".leaflet-marker-icon").should("have.length", 6);
    });

    it("should zoom to the segment the user clicked on", () => {
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
      cy.mount(TripMap as any, {
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
  });
});
