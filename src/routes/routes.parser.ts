/**
 * @file Contains functionality to parse gpx files into typescript objects.
 */
import { XMLParser } from 'fast-xml-parser';
import { NotEnoughCoordinatesError } from '../routes.segments/routes.segments.service';

export interface GPXRoute {
  name: string;
  segments: GPXRouteSegment[];
}

export interface GPXRouteSegment {
  name: string;
  coordinates: number[][];
}

// eslint-disable-next-line jsdoc/require-example
/**
 * Creates a new route in the database based on a gpx file.
 * @param data - The content of the gpx file.
 * @returns A Promise that resolves to a RouteDto object.
 * @throws {NotEnoughCoordinatesError} If there are no coordinates within the gpx file.
 */
export function extractCoordinatesFromGPX(data: string | Buffer): GPXRoute {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });
  const obj = parser.parse(data);

  let segments = obj.gpx.trk.trkseg;
  if (!Array.isArray(segments) && !segments.trkpt) {
    throw new NotEnoughCoordinatesError();
  }

  if (!Array.isArray(segments)) {
    segments = [segments];
  }

  let names = obj.gpx.trk.name;
  if (!Array.isArray(names)) {
    names = [obj.gpx.trk.name];
  }

  const convertedSegments: GPXRouteSegment[] = segments.map((segment, i) => {
    const name = names[i];

    const coordinates = segment.trkpt.map((point): number[] => [
      point['@_lat'],
      point['@_lon'],
    ]);

    return {
      name,
      coordinates,
    };
  });

  let routeName = obj.gpx.metadata.name;
  if (!routeName) {
    routeName = 'no_name';
  }

  const result = {
    name: routeName,
    segments: convertedSegments,
  };

  return result;
}
