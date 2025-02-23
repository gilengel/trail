/**
 * @file DTO specification for a route segment.
 */
import { ApiProperty } from '../decorators';
import {CreateRouteSegment} from './create.route.segment.dto';

export class RouteSegmentDto extends CreateRouteSegment {
    //@ApiProperty()
    id: number;
}
