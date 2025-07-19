/**
 * @file DTO specification for a route.
 */
import type {RouteSegmentDto} from "~/types/dto/route.segment.dto";

export interface RouteWithoutSegmentsDto {

    id: number;

    tripId: number;

    name: string;

    description: string;
}

export interface RouteDto extends RouteWithoutSegmentsDto {
    segments: RouteSegmentDto[];
}