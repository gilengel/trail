/**
 * @file Contains all dto definition for all entities.
 */

export * from './trips/dto';
export * from './routes/routes/dto';
export * from './routes/segments/dto';
export * from './images/dto';

export interface GPXRoute {
  name?: string;
  segments: GPXRouteSegment[];
}

export interface GPXRouteSegment {
  name: string;
  coordinates: [number, number, number][];
}
