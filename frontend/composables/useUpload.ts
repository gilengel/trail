/**
 * @file Composables for upload data.
 */

/**
 * Wrapper for a POST request.
 * @param url - The backend api endpoint.
 * @param body - The data you want to upload.
 */
export async function useUpload(url: string, body: object) {
   return await $fetch(url, {
        method: "POST",
        body,
    });
}

/**
 * Wrapper for uploading a route to the backend.
 * @param name - The name used for the route.
 * @param files - The gps files for the route. Mandatory is at least one.
 * @param description - Optional description for the trip.
 */
export async function useRouteUpload(name: string, files: File[], description?: string) {
    const formData = useFileFormData(files);
    formData.append("name", name);

    if (description) {
        formData.append("description", description);
    }

    await useUpload("api/routes/gpx", formData);
}

/**
 * Helper that creates a FormData element that can be used to upload multiply files.
 * @param files - The files that are appended to the form data.
 * @returns An object in form of a FormData containing all the files.
 */
export function useFileFormData(
    files: File[]
): FormData {
    const formData = new FormData();

    for (const file of files) {
        formData.append("files", file);
    }

    return formData;
}
