/**
 * @file DTO specification for creating a route segment.
 */
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { RouteSegment } from './route.segment.dto';

class muu extends PartialType(OmitType(RouteSegment, ['id'] as const)) {}

/**
 * Public DTO that can be used in the customer API.
 */
export class CreateRouteSegmentPublic extends muu {
  @ApiProperty()
  routeId: number;
}

/**
 * Private DTO that cannot be used in the customer API.
 */
export class CreateRouteSegmentPrivate extends muu {}
