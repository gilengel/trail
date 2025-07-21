/**
 * @file Unit tests for drop zone.
 */
import {describe, expect, it} from "vitest";
import {mountSuspended} from "@nuxt/test-utils/runtime";
import DropZone from "@/components//DropZone.vue";
import {mockFile} from "~/tests/util";

describe("Component", () => {
    describe("DropZone", () => {
        it('should display "Release to drop files here." if the user is dragging a file over', async () => {
            const component = await mountSuspended(DropZone, {
                props: {
                    allowedFileExtensions: ["gpx"],
                },
            });
            await component.get('[data-cy="drop-zone"]').trigger("dragover");
            await nextTick();

            expect(component.get("[data-cy=release-msg]")).toBeTruthy();
        });


        it('should display "Drop files here or <u>click here</u> to upload." if the user is dragging out of the element', async () => {
            const component = await mountSuspended(DropZone, {
                props: {
                    allowedFileExtensions: ["gpx"],
                },
            });

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(mockFile("gpx", 1000));

            await component.get('[data-cy="drop-zone"]').trigger("dragover", {
                dataTransfer,
            });
            await nextTick();
            expect(component.get("[data-cy=release-msg]")).toBeTruthy();
            await component.get('[data-cy="drop-zone"]').trigger("dragleave");
            await nextTick();
            //expect(component.get("[data-cy=release-msg]")).toBeFalsy();
        });

        /*
                it('should display "File has wrong type." if the dropped file is of an unallowed type', async () => {
                    const component = await mountSuspended(DropZone, {
                        props: {
                            allowedFileExtensions: ["gpx"],
                        },
                    });

                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(mockFile("txt", 1000));

                    await component.get('[data-cy="drop-zone"]').trigger("dragover", {
                        dataTransfer,
                    });
                    await nextTick();
                    expect(component.get("[data-cy=wrong-file-extension]")).toBeTruthy();
                });


                        it('should hide "File has wrong type." after timeout', async () => {
                            const component = await mountSuspended(DropZone, {
                                props: {
                                    allowedFileExtensions: ["gpx"],
                                },
                            });

                            const dataTransfer = new DataTransfer();

                            dataTransfer.items.add(mockFile(".txt", 1000));
                            await component
                                .get('[data-cy="drop-zone"]')
                                .trigger("drop", {dataTransfer});
                            await nextTick();
                            expect(component.get("[data-cy=wrong-file-extension]")).toBeTruthy();
                            await nextTick();
                            expect(component.get("[data-cy=wrong-file-extension]")).toBeFalsy();
                        });

                        it("should display the dropped file(s)", async () => {
                            const component = await mountSuspended(DropZone, {
                                props: {
                                    allowedFileExtensions: ["gpx"],
                                },
                            });

                            const dataTransfer = new DataTransfer();

                            dataTransfer.items.add(mockFile(".gpx", 1000));
                            await component
                                .get('[data-cy="drop-zone"]')
                                .trigger("drop", {dataTransfer});
                            await nextTick();
                            expect(component.get("[data-cy=preview-container]")).toBeTruthy();
                        });

                        it("should remove a dropped file if clicked on the trash button", async () => {
                            const component = await mountSuspended(DropZone, {
                                props: {
                                    allowedFileExtensions: ["gpx"],
                                },
                            });

                            const dataTransfer = new DataTransfer();

                            dataTransfer.items.add(mockFile(".gpx", 1000));
                            await component
                                .get('[data-cy="drop-zone"]')
                                .trigger("drop", {dataTransfer});

                            await component.get('[data-cy="delete-btn"]').trigger("click");
                            expect(component.get("[data-cy=preview-container]")).toBeTruthy();
                        });
                */
    });
});
