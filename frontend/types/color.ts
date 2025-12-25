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
  const hexShorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const rgbRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
  const rgbaRegex =
    /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0|1|0?\.\d+)\)$/;

  const hexShorthandMatch = color.match(hexShorthandRegex);
  if (hexShorthandMatch && hexShorthandMatch.length == 4) {
    const r = parseInt(hexShorthandMatch[1]! + hexShorthandMatch[1]!, 16);
    const g = parseInt(hexShorthandMatch[2]! + hexShorthandMatch[2]!, 16);
    const b = parseInt(hexShorthandMatch[3]! + hexShorthandMatch[3]!, 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const hexRegexMatch = color.match(hexRegex);
  if (hexRegexMatch && hexRegexMatch.length == 4) {
    const r = parseInt(hexRegexMatch[1]!, 16);
    const g = parseInt(hexRegexMatch[2]!, 16);
    const b = parseInt(hexRegexMatch[3]!, 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const rgbMatch = color.match(rgbRegex);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const rgbaMatch = color.match(rgbaRegex);
  if (rgbaMatch) {
    const [, r, g, b] = rgbaMatch;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // If the color is not in `rgb` or `rgba` format, throw an error
  throw new Error("Invalid color format. Expected rgb() or rgba().");
}
