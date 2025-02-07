/**
 * Converts a camel case string to single words.
 * @param s - The string in camel case format.
 * @returns The single words.
 */
export function camelCaseToWords(s: string) {
    const result = s.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
}
