import { describe, it, expect } from "vitest";
import { mountSuspended, registerEndpoint } from "@nuxt/test-utils/runtime";
import { MapLibreSegment } from "~/data/routes/types";
import TripFeedItem from "./FeedItem.vue";
import { LngLat } from "maplibre-gl";

describe("Component", () => {
  describe("TripFeedItem", () => {
    it("should render a trip feed item", async () => {
      registerEndpoint(
        "http://localhost:3000/images/route_segment/number",
        () => 1
      );

      registerEndpoint("http://localhost:3000/images/route_segment", () => {
        return {
          id: "aeb50f69-189d-437a-aba6-14f69400b37b",
          timestamp: new Date(),
          name: "image",
          coordinates: [0, 0],
          url: "irrelevant",
        };
      });

      const start = new LngLat(30.712, -74.227);
      const end = new LngLat(90.774, -74.125);

      const segment = new MapLibreSegment(
        0,
        "segment",
        [start, end],
        "rgb(255, 0, 0)"
      );

      const component = await mountSuspended(TripFeedItem, {
        props: { segment },
      });
      expect(component.get('[data-cy="trip-feed-item"]')).toBeTruthy();
    });
  });
});
