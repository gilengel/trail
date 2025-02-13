/**
 * @file Contains functionality to parse gpx files into typescript objects.
 */
import { XMLParser } from 'fast-xml-parser';
import { NotEnoughCoordinatesError } from '../routes.segments/routes.segments.service';
import { Buffer } from 'buffer';

export interface GPXRoute {
  name?: string;
  segments: GPXRouteSegment[];
}

export interface GPXRouteSegment {
  name: string;
  coordinates: Array<[number, number, number]>;
}

 
/**
 * Extracts the geospatial coordinates from a string or file buffer.
 * @param data - The content of the gpx file.
 * @returns The coordinates as a route.
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

    const coordinates = segment.trkpt.map((point): number[] => {
      const elevation = point.ele ? `${point.ele}` : '0';

      return [point['@_lat'], point['@_lon'], elevation];
    });

    return {
      name,
      coordinates,
    };
  });

  return {
    segments: convertedSegments,
  };
}
