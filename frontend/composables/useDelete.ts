/**
 * Wrapper for a DELETE request.
 * @param url - The backend api endpoint.
 * @returns - The response from the backend.
 */
export async function useDelete<T>(url: string) {
    return await $fetch(url, {
        method: "DELETE",
    }) as T;
}