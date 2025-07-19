/**
 * @file DTO specification for a route segment.
 */
import {CreateRouteSegment} from './create.route.segment.dto';

export interface RouteSegmentDto extends CreateRouteSegment {
    id: number;
}
