/**
 * @file DTO specification for a trip.
 */
import {RouteDto} from './route.dto';

export interface TripDto {
    id: number;


    name: string;


    layout: unknown;

    routes?: RouteDto[];
}
