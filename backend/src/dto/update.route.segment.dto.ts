/**
 * @file DTO specification for updating a route segment.
 */
import { PartialType } from './partial';
import { CreateRouteSegment } from './create.route.segment.dto';

export class UpdateRouteSegmentDto extends PartialType(CreateRouteSegment) {

}
