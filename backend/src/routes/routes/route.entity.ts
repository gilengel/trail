/**
 * @file Entity definition for a route. Only to be used in domain logic.
 */
import { RouteSegment } from "../segments/route.segment.entity";
import { Trip } from "../../trips/trip.entity";

export type Route = {
    trip: Trip;

    id: number;

    name: string;

    description: string;

    segments: RouteSegment[];
}