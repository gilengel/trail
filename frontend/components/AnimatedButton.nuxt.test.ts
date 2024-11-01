import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AnimatedButton from "./AnimatedButton.vue";

describe("Component", () => {
  describe("AnimatedButton", () => {
    it('should trigger the animate "in" the tree svg elements on mouse over', async () => {
      const component = await mountSuspended(AnimatedButton, {
        props: { title: "Test Button" },
      });
      component.get('[data-cy="animated-btn"]').trigger("mouseover");
      component.vm.$nextTick(() => {
        expect(component.get("[data-cy=svg-tree]").classes("out")).toBe(true);
      });
    });

    it('should trigger the animate "in" the tree svg elements on focus in', async () => {
      const component = await mountSuspended(AnimatedButton, {
        props: { title: "Test Button" },
      });

      component.get('[data-cy="animated-btn"]').trigger("focusin");
      component.vm.$nextTick(() => {
        expect(component.get("[data-cy=svg-tree]").classes("out")).toBe(true);
      });
    });

    it('should trigger the animate "out" the tree svg elements on mouse leave', async () => {
      const component = await mountSuspended(AnimatedButton, {
        props: { title: "Test Button" },
      });

      component.get('[data-cy="animated-btn"]').trigger("mouseleave");
      component.vm.$nextTick(() => {
        expect(component.get("[data-cy=svg-tree]").classes("in")).toBe(true);
      });
    });

    it('should trigger the animate "out" the tree svg elements on focus out', async () => {
      const component = await mountSuspended(AnimatedButton, {
        props: { title: "Test Button" },
      });

      component.get('[data-cy="animated-btn"]').trigger("focusout");
      component.vm.$nextTick(() => {
        expect(component.get("[data-cy=svg-tree]").classes("in")).toBe(true);
      });
    });
    /*
    it('should do nothing if clicked on "Upload" if no file was selected to be uploaded', () => {
      cy.get('[data-test=upload-btn]').click()
    })

    it('should update a file', () => {
      cy.intercept(
        {
          method: 'POST', // Route all GET requests
          url: 'http://localhost:3000/routes/gpx' // that have a URL that matches '/users/*'
        },
        [] // and force the response to be: []
      )

      cy.get('input[type=file]').selectFile('src/components/__tests__/data/short.gpx')
      cy.get('[data-test=upload-btn]').click()
    })
    */
  });
});
