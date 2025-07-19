/**
 * @file Unit tests for drop zone.
 */
import {describe, expect, it} from "vitest";
import {mountSuspended} from "@nuxt/test-utils/runtime";
import DropZone from "@/components//DropZone.vue";

/**
 * Mocks a file with the specified extension and size.
 * @param extension - The file extension (e.g., 'txt', 'jpg', 'pdf').
 * @param size - The size of the file in bytes.
 * @returns - A mock File object.
 */
function mockFile(extension: string, size: number) {
    // Generate a file name with the given extension
    const fileName = `mock-file.${extension}`;

    // Create a blob with the specified size
    const blob = new Blob([new ArrayBuffer(size)], {type: `application/${extension}`});

    // Convert the blob to a File object
    return new File([blob], fileName, {
        type: blob.type,
        lastModified: Date.now(),
    });
}

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
