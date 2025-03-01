/**
 * Wrapper for a DELETE request.
 * @template T The type of the object that will be returned.
 * @param url - The backend api endpoint.
 * @returns - The response from the backend.
 */
export async function useDelete<T>(url: string) {
    return await $fetch(url, {
        method: "DELETE",
    }) as T;
}