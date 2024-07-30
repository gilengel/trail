import { describe, it, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TripImages from "./Images.vue";
import { registerEndpoint } from "@nuxt/test-utils/runtime";
import { MapLibreSegment } from "~/data/routes/types";
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

const getImageNumberFakeApiCall = vi.fn();
const getImagesFakeApiCall = vi.fn();

registerEndpoint(
  "http://localhost:3000/images/route_segment/number",
  getImageNumberFakeApiCall
);
registerEndpoint(
  "http://localhost:3000/images/route_segment",
  getImagesFakeApiCall
);

describe("Component", () => {
  describe("TripImages", () => {
    it("should render part of the images and show an indication for the number of images not shown", async () => {
      getImageNumberFakeApiCall.mockImplementation(() => 10);
      getImagesFakeApiCall.mockImplementation(() =>
        Array(10).fill({
          id: "aeb50f69-189d-437a-aba6-14f69400b37b",
          timestamp: new Date(),
          name: "image",
          coordinates: [0, 0],
          url: "irrelevant",
        })
      );

      const component = await mountSuspended(TripImages, {
        props: {
          segment,
        },
      });

      expect(
        await component.find('[data-cy="trip-images"]').exists()
      ).toBeTruthy();
      //expect(
      //  await component.find('[data-cy="single-image"]').exists()
      //).toBeTruthy();
    });

    it("should render all images", async () => {
      getImageNumberFakeApiCall.mockImplementation(() => {
        return 1;
      });
      getImagesFakeApiCall.mockImplementation(() => {
        return [
          {
            id: "aeb50f69-189d-437a-aba6-14f69400b37b",
            timestamp: new Date(),
            name: "image",
            coordinates: [0, 0],
            url: "irrelevant",
          },
        ];
      });

      const component = await mountSuspended(TripImages, {
        props: {
          segment,
        },
      });

      expect(
        await component.find('[data-cy="trip-images"]').exists()
      ).toBeTruthy();
      //expect(
      //  await component.find('[data-cy="single-image"]').exists()
      //).toBeTruthy();
    });
  });
});
