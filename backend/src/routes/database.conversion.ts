/**
 * Takes a LineString in Well-Known Text (WKT) format and transforms it into an array of arrays of floats.
 * @param wkt - A string representing a LineString in 2D or 3D space.
 * @returns An array consisting of arrays of floats.
 * @example
 * // returns [[30, 10], [10, 30], [40, 40]]
 * wkt2numberArray('LINESTRING (30 10, 10 30, 40 40)')
 */
export function wkt2numberArray(wkt: string): number[][] {
    return wkt
        .replace(/LINESTRING Z ?\(/, '')
        .replace(')', '')
        .split(',')
        .map((point) => {
            const coordinates = point
                .split(' ')
                .map((coordinate) => parseFloat(coordinate));

            return coordinates;
        });
}

/**
 * Takes an array of arrays of numbers and converts it into a string representation using the WKT format.
 * @param array - An array of arrays of numbers. Each inner array represents a point.
 * @returns A string in WKT format representing the LineString.
 * @example
 * // returns 'LINESTRING (30 10, 10 30, 40 40)'
 * numberArray2wkt([[30, 10], [10, 30], [40, 40]]
 */
export function numberArray2wkt(array: number[][]): string {
    const routePointsString = array.map((point) => point.join(' ')).join(',');

    return `LINESTRING Z(${routePointsString})`;
}


/**
 * Takes a point in the form of a number array and converts it into the wkt (well known text)
 * format. This is necessary e.g. For storing the point in a POSTGIS database.
 * @param point - The point as array. Can have multiple dimensions.
 * @returns String in the wkt standard representing the point.
 * @example
 * // returns {string} POINT(32 64)
 * point2wkt([32, 64])
 */
export function point2wkt(point: number[]): string {
    return `POINT(${point.join(' ')})`;
}


/**
 * Takes a point as a string in the wkt format and converts it into an array where each member
 * within the array corresponds to one coordinate.
 * @param wkt - The point as wkt string.
 * @returns Array of numbers where each member corresponds to a coordinate of the point.
 * @example
 * // returns [32, 64]
 * wkt2point('POINT(32 64)')
 */
export function wkt2point(wkt: string): number[] {
    return wkt
        .replace('POINT(', '')
        .replace(')', '')
        .split(' ')
        .map((value) => parseFloat(value));
}