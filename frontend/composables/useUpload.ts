/**
 * @file Composables for upload data.
 */

/**
 * Wrapper for a POST request.
 * @param url - The backend api endpoint.
 * @param body - The data you want to upload.
 */
export async function useUpload(url: string, body: object) {
    await $fetch(url, {
        method: "POST",
        body,
    });
}

export type NewRouteDto = {
    name: string;
    description?: string;
    files: File[];
};

/**
 * Wrapper for uploading a route to the backend.
 * @param body - The new route.
 */
export async function useRouteUpload(body: NewRouteDto) {
    const formData = useFileFormData(body.files);
    formData.append("name", body.name);

    if (body.description) {
        formData.append("description", body.description);
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
