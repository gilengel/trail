/**
 * Converts a camel case string to single words.
 * @param s - The string in camel case format.
 * @returns The single words.
 */
export function camelCaseToWords(s: string) {
    const result = s.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Converts a snake case string to single words.
 * @param input - The string in camel case format.
 * @returns The single words.
 */
export function snakeCaseToWords(input: string): string {

    return input
        .split('_')
        .map(word => {
            if (!isNaN(Number(word))) return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
}