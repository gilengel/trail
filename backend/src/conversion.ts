/**
 * @file Provides functionality to convert geo data structures from and related dtos.
 */
import { DbImageDto, ImageDto } from './images/dto/image.dto';
import { RouteDto } from './routes/dto/route.dto';
import { RouteSegmentDto } from './routes.segments/dto/route.segment.dto';
import { RouteSegment } from './routes.segments/entity/routes.segment';
import { Route } from './routes/entity/route';

 
/**
 * Returns the file extension for supported image file types.
 * Be aware that this function will return undefined / nothing if the provided
 * mimeType is not 'image/jpeg' or 'image/tiff'. The controller will enforce that only
 * images of these types can be further processed.
 * @param mimeType - File type as mime type string see https://www.iana.org/assignments/media-types/media-types.xhtml for a list of media types.
 * @returns Jpg or tif, undefined or nothing if mimeType is invalid.
 */
export function generateFileExtensionBasedOnMimeType(mimeType: string): string {
  switch (mimeType) {
    case 'image/jpeg': {
      return 'jpg';
    }
    case 'image/tiff': {
      return 'tif';
    }
  }
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
export function wkt2point(wkt: string): Array<number> {
  return wkt
    .replace('POINT(', '')
    .replace(')', '')
    .split(' ')
    .map((value) => parseFloat(value));
}

/**
 * Takes a LineString in Well-Known Text (WKT) format and transforms it into an array of arrays of floats.
 * @param wkt - A string representing a LineString in 2D or 3D space.
 * @returns An array consisting of arrays of floats.
 * @example
 * // returns [[30, 10], [10, 30], [40, 40]]
 * wkt2numberArray('LINESTRING (30 10, 10 30, 40 40)')
 */
export function wkt2numberArray(wkt: string): Array<[number, number, number]> {
  return wkt
    .replace(/LINESTRING Z ?\(/, '')
    .replace(')', '')
    .split(',')
    .map((point) => {
      const coordinates = point
        .split(' ')
        .map((coordinate) => parseFloat(coordinate));

      return [coordinates[0], coordinates[1], coordinates[2]];
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
export function numberArray2wkt(
  array: Array<[number, number, number]>,
): string {
  const routePointsString = array.map((point) => point.join(' ')).join(',');

  return `LINESTRING Z(${routePointsString})`;
}

/**
 * Converts a database RouteDto object to a RouteDto object.
 * @param route - A database RouteDto object.
 * @returns A RouteDto object.
 * @example
 * // this would usually come directly from the database and be created manually
 * const dbRoute : Route = {
 *   id: 0,
 *   name: 'route',
 *   segments: [
 *     {
 *       id: 1,
 *       name: 'segment',
 *       coordinated: 'POINT(32 64)
 *     }
 *   ]
 * }
 *
 * // returns {
 * //   id: 0,
 * //   name: 'route',
 * //   segments: [
 * //     {
 * //       id: 1,
 * //       name: 'segment',
 * //       coordinated: [32, 64]
 * //     }
 * //   ]
 * // }
 * dbRoute2dto(dbRoute)
 */
export function dbRoute2dto(route: Route): RouteDto {
  return {
    id: route.id,
    name: route.name,
    description: route.description,
    segments: route.segments.map(dbRouteSegment2dto),
  };
}

/**
 * Converts a database RouteSegmentDto object to a RouteSegmentDto object.
 * @param routeSegment - A database RouteSegmentDto object.
 * @returns A RouteSegmentDto object.
 * @example
 * // this would usually come directly from the database and be created manually
 * const dbRouteSegment : RouteSegment = {
 *   id: 1,
 *   name: 'segment',
 *   coordinated: 'POINT(32 64)
 * }
 *
 * // returns {
 * //   id: 1,
 * //   name: 'segment',
 * //   coordinated: [32, 64]
 * // }
 * dbRouteSegment2dto(dbRouteSegment)
 */
export function dbRouteSegment2dto(
  routeSegment: RouteSegment,
): RouteSegmentDto {
  return {
    id: routeSegment.id,
    name: routeSegment.name,
    description: routeSegment.description,
    coordinates: wkt2numberArray(routeSegment.coordinates),
  };
}

/**
 * Converts an image dto as it is saved within the database into a dto that can
 * be used more easily. It mainly takes care of converting the coordinates from wkt format
 * to an array of numbers.
 * @param image - The image dto as it saved in the database.
 * @returns A ImageDto instance.
 * @example
 * // this would usually come directly from the database and be created manually
 * const dbImageDto : DbImageDto = {
 *   uuid: '0cbb5048-f0a7-44bc-b436-31ce5df46094',
 *   timestamp: Date.parse('01 Jan 1970 00:00:00 GMT'),
 *   coordinated: 'POINT(32 64)'
 * }
 *
 * // returns {
 * //   uuid: '0cbb5048-f0a7-44bc-b436-31ce5df46094',
 * //   timestamp same as above,
 * //   name: 'name of the image file saved on the server'
 * //   coordinated: [32, 64]
 * // }
 * dbimage2dto(dbRouteSegment)
 */
export function dbimage2dto(image: DbImageDto): ImageDto {
  return {
    id: image.id,
    timestamp: image.timestamp,
    name: 'not_implemented',
    coordinates: wkt2point(image.coordinates),
    url: `${image.id}.${generateFileExtensionBasedOnMimeType(image.mime_type)}`,
  };
}

/**
 * Converts multiple image dtos as they are saved within the database into an array of dtos that can
 * be used more easily. It mainly takes care of converting the coordinates from wkt format of each image dto
 * to an array of numbers.
 * @param images - The image dtos as they are saved in the database.
 * @returns Multiple ImageDto instances.
 * @example
 * // this would usually come directly from the database and be created manually
 * const dbImageDto : DbImageDto[] = [{
 *   uuid: '0cbb5048-f0a7-44bc-b436-31ce5df46094',
 *   timestamp: Date.parse('01 Jan 1970 00:00:00 GMT'),
 *   coordinated: 'POINT(32 64)'
 * }]
 *
 * // returns [{
 * //   uuid: '0cbb5048-f0a7-44bc-b436-31ce5df46094',
 * //   timestamp same as above,
 * //   name: 'name of the image file saved on the server'
 * //   coordinated: [32, 64]
 * // }]
 * dbimages2dto(dbRouteSegment)
 */
export function dbimages2dto(images: DbImageDto[]): ImageDto[] {
  return images.map((image) => dbimage2dto(image));
}
