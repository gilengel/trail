import { describe, it, expect, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TripAspects from "./Aspects.vue";

describe("Component", () => {
  describe("TripAspects", () => {
    it("should render the loop indicator if prop is set to true", async () => {
      const component = await mountSuspended(TripAspects, {
        props: { tripLength: 0, tripIsLoop: true },
      });
      expect(component.get('[data-cy="trip-loop-indicator"]')).toBeTruthy();
    });

    it("should not render the loop indicator if prop is set to false", async () => {
      const component = await mountSuspended(TripAspects, {
        props: { tripLength: 0, tripIsLoop: false },
      });
      expect(
        component.find('[data-cy="trip-loop-indicator"]').exists()
      ).toBeFalsy();
    });
  });
});
