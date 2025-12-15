/**
 * @file Entity definition for a route segment. Only to be used in domain logic.
 */
import { Route } from '../routes/route.entity';

export type RouteSegment = {
  route: Route;

  id: number;

  name: string;

  description: string;

  coordinates: [number, number, number][];
};
