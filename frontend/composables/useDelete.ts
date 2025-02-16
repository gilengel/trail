/**
 * Wrapper for a DELETE request.
 * @param url - The backend api endpoint.
 */
export async function useDelete(url: string) {
    return await $fetch(url, {
        method: "DELETE",
    });
}