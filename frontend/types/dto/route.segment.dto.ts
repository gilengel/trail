/**
 * @file DTO specification for a route segment.
 */
import { type CreateRouteSegment } from "./create.route.segment.dto";

export interface RouteSegmentDto extends CreateRouteSegment {
  id: number;
}
