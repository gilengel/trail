import DropZone from "./DropZone.vue";
import TripUpload from "./Upload.vue";
import { mockFile } from "../__tests__/util";

describe("Component", () => {
  describe("TripUpload", () => {
    beforeEach(() => {
      (cy.getRouteStore() as any).as("store");
    });

    it("should render the trip upload element", () => {
      cy.mount(TripUpload as any);
      cy.get("h1").should("exist").and("have.text", "Trip Upload");
    });

    it("should show an success message if file was succesfully uploaded", function () {
      cy.stub(this.store, "addRoute").resolves();

      cy.mount(TripUpload as any).then(({ wrapper }) => {
        const childWrapper = wrapper.getComponent(DropZone);
        childWrapper.vm.$emit("onFilesChanged", [mockFile("gpx", 1000)]);

        cy.get("[data-cy=upload-btn]").click();
        cy.get("[data-cy=status-msg]").should("exist").and("have.text", ":)");
      });
    });

    it("should show an error message if files couldn't be uploaded", () => {
      cy.intercept("POST", "/api/routes/gpx", {
        statusCode: 300,
      });

      cy.mount(TripUpload as any).then(({ wrapper }) => {
        const childWrapper = wrapper.getComponent(DropZone);
        childWrapper.vm.$emit("onFilesChanged", [mockFile("gpx", 1000)]);

        cy.get("[data-cy=upload-btn]").click();
        cy.get("[data-cy=status-msg]").should("exist").and("have.text", ":/");
      });
    });

    it("should update the name of a route", function () {
      cy.stub(this.store, "addRoute").callsFake(async (name: string) => {
        expect(name).to.be.eq("NameChanged");

        Promise.resolve();
      });

      cy.mount(TripUpload as any).then(({ wrapper }) => {
        const childWrapper = wrapper.getComponent(DropZone);
        childWrapper.vm.$emit("onFilesChanged", [mockFile("gpx", 1000)]);

        cy.get("[data-cy=singleline-text]").type("NameChanged");
        cy.get("[data-cy=upload-btn]").click();
      });
    });
  });
});
