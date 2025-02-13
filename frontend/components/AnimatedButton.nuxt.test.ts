/**
 * @file Unit tests for animated button.
 */
import {describe, it, expect} from "vitest";
import {mountSuspended} from "@nuxt/test-utils/runtime";
import AnimatedButton from "./AnimatedButton.vue";

describe("Component", () => {
    describe("AnimatedButton", () => {
        it('should trigger the animate "in" the tree svg elements on mouse over', async () => {
            const wrapper = await mountSuspended(AnimatedButton, {
                props: {title: "Test Button"},
            });
            wrapper.get('[data-cy="animated-btn"]').trigger("mouseover");
            wrapper.vm.$nextTick(() => {
                expect(wrapper.get("[data-cy=svg-tree]").classes("out")).toBe(true);
            });
        });

        it('should trigger the animate "in" the tree svg elements on focus in', async () => {
            const wrapper = await mountSuspended(AnimatedButton, {
                props: {title: "Test Button"},
            });

            wrapper.get('[data-cy="animated-btn"]').trigger("focusin");
            wrapper.vm.$nextTick(() => {
                expect(wrapper.get("[data-cy=svg-tree]").classes("out")).toBe(true);
            });
        });

        it('should trigger the animate "out" the tree svg elements on mouse leave', async () => {
            const wrapper = await mountSuspended(AnimatedButton, {
                props: {title: "Test Button"},
            });

            wrapper.get('[data-cy="animated-btn"]').trigger("mouseleave");
            wrapper.vm.$nextTick(() => {
                expect(wrapper.get("[data-cy=svg-tree]").classes("in")).toBe(true);
            });
        });

        it('should trigger the animate "out" the tree svg elements on focus out', async () => {
            const wrapper = await mountSuspended(AnimatedButton, {
                props: {title: "Test Button"},
            });

            wrapper.get('[data-cy="animated-btn"]').trigger("focusout");
            wrapper.vm.$nextTick(() => {
                expect(wrapper.get("[data-cy=svg-tree]").classes("in")).toBe(true);
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
