import {describe, it, expect} from "vitest";
import {mountSuspended} from "@nuxt/test-utils/runtime";
import TripOverview from "./Overview.vue";

describe("Component", () => {
    describe("With existing trips", () => {
        it("should render the images of a trip", async () => {
            const wrapper = await mountSuspended(TripOverview);

            const h1 = wrapper.find('[data-cy="overview-title"]');
            expect(h1.exists()).toBeTruthy();
            expect(h1.text()).toBe("My Latest Trips");
        });

        /*
        it("should emit a signal after a trip was selected", function () {
          this.store.routesWithoutSegments.push({
            id: 1,
            name: "intercepted route",
            segments: [
              {
                id: 1,
                name: "intercepted route",
                coordinates: [
                  [47.387563828378916, 10.939971758052707, 1127.800048828125],
                  [47.38756508566439, 10.939996987581253, 1128],
                  [47.38756240345538, 10.940024564042687, 1128.199951171875],
                  [47.387563828378916, 10.939971758052707, 1127.800048828125],
                ],
              },
            ],
          });

          cy.mount(TripOverview as any).then(({ wrapper }) => {
            cy.get('[data-cy="trip-entry"]').first().click();
            cy.wait(100).then(() => {
              const emitted = wrapper.emitted("selectedTripChanged");
              expect(emitted?.length).to.be.equal(1);

              const id = emitted as unknown[][];
              expect(id[0][0]).to.be.equal(1);
            });
          });
        });

        it("should render a message that no trips exist", function () {
          this.store.routesWithoutSegments = [];
          cy.mount(TripOverview as any);
          component.get("[data-cy=error-empty-text]").toBeTruthy();
        });

        it("should render a message if there was a network error", function () {
          this.store.networkError = true;

          cy.mount(TripOverview as any);
          component.get("[data-cy=error-network-text]").toBeTruthy();
        });
        */
    });
});
