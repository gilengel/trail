export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

/**
 * Adds or modifies the alpha value of a given color.
 * @param color - The input color (rgb, rgba, or any valid string).
 * @param alpha - The alpha value to set (0.0 to 1.0).
 * @returns A new color string in `rgba` format.
 * @throws Error if the color is not valid rgb or rgba format.
 */
export function addAlphaToColor(color: Color, alpha: number): string {
    // Regular expressions to match `rgb` and `rgba` formats
    const rgbRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
    const rgbaRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0|1|0?\.\d+)\)$/;

    // Check for `rgb` format
    const rgbMatch = color.match(rgbRegex);
    if (rgbMatch) {
        const [, r, g, b] = rgbMatch;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Check for `rgba` format
    const rgbaMatch = color.match(rgbaRegex);
    if (rgbaMatch) {
        const [, r, g, b] = rgbaMatch;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // If the color is not in `rgb` or `rgba` format, throw an error
    throw new Error('Invalid color format. Expected rgb() or rgba().');
}