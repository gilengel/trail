import {describe, it, expect} from "vitest";
import {mountSuspended} from "@nuxt/test-utils/runtime";
import TripAspects from "./Aspects.vue";

describe("Component", () => {
    describe("TripAspects", () => {
        it("should render the loop indicator if prop is set to true", async () => {
            const wrapper = await mountSuspended(TripAspects, {
                props: {tripLength: 0, tripIsLoop: true, ascending: 0, descending: 0},
            });
            expect(wrapper.get('[data-cy="trip-loop-indicator"]')).toBeTruthy();
        });

        it("should not render the loop indicator if prop is set to false", async () => {
            const wrapper = await mountSuspended(TripAspects, {
                props: {tripLength: 0, tripIsLoop: false, ascending: 0, descending: 0},
            });
            expect(
                wrapper.find('[data-cy="trip-loop-indicator"]').exists()
            ).toBeFalsy();
        });
    });
});
