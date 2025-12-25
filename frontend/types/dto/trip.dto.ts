/**
 * @file DTO specification for a trip.
 */
import type { RouteDto } from "~/types/dto/route.dto";
import { type Grid } from "@trail/grid-editor/grid";

export interface TripDto {
  id: number;

  name: string;

  layout: Grid;

  routes?: RouteDto[];
}
