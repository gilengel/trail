import { DbRouteDto, RouteDto } from './route/dto/route.dto';

/**
 * Takes a LineString in Well-Known Text (WKT) format and transforms it into an array of arrays of floats.
 *
 * @param wkt - A string representing a LineString in 2D or 3D space.
 * @returns An array consisting of arrays of floats.
 */
export function wkt2numberArray(wkt: string): Array<Array<number>> {
  return wkt
    .replace('LINESTRING(', '')
    .replace(')', '')
    .split(',')
    .map((point) =>
      point.split(' ').map((coordinate) => parseFloat(coordinate)),
    );
}

/**
 * Takes an array of arrays of numbers and converts it into a string representation using the WKT format.
 *
 * @param array - An array of arrays of numbers. Each inner array represents a point.
 * @returns A string in WKT format representing the LineString.
 */
export function numberArray2Wkt(array: Array<Array<number>>): string {
  const routePointsString = array.map((point) => point.join(' ')).join(',');

  return `LINESTRING(${routePointsString})`;
}

/**
 * Converts a database RouteDto object to a RouteDto object.
 *
 * @param route - A database RouteDto object.
 * @returns A RouteDto object.
 */
export function dbRoute2dto(route: DbRouteDto): RouteDto {
  return {
    id: route.id,
    name: route.name,
    coordinates: wkt2numberArray(route.coordinates),
  };
}

/**
 * Converts an array of database RouteDto objects to an array of RouteDto objects.
 *
 * @param routes - An array of database RouteDto objects.
 * @returns An array of RouteDto objects.
 */
export function dbRoutes2dto(routes: DbRouteDto[]): RouteDto[] {
  return routes.map((x) => dbRoute2dto(x));
}
