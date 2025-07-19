/**
 * @file DTO specification for a trip.
 */
import type {RouteDto} from "~/types/dto/route.dto";

export interface TripDto {
    id: number;

    name: string;

    layout: unknown;

    routes?: RouteDto[];
}
