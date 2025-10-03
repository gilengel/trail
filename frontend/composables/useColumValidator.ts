/**
 * Checks that the given parameter is in the range from 0 till 12.
 * @param x - The column value to be validated.
 * @returns True if 0 <= x <= 12, false otherwise.
 */
export function columnValueValidator(x: number) {
    return x >= 0 && x <= 12;
}