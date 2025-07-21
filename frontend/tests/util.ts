/**
 * Mocks a file with the specified extension and size.
 * @param extension - The file extension (e.g., 'txt', 'jpg', 'pdf').
 * @param size - The size of the file in bytes.
 * @returns - A mock File object.
 */
export function mockFile(extension: string, size: number) {
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