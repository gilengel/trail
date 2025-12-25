/**
 * @file DTO specification for creating a route.
 */
import type { CreateRouteSegment } from "~/types/dto/create.route.segment.dto";

export interface CreateRouteDto {
  name?: string;

  description?: string;

  segments?: CreateRouteSegment[];

  tripId: number;
}
