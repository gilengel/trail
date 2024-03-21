/**
 * @file DTO specification for a route segment.
 */
import { ApiProperty } from '@nestjs/swagger';
import { ConcealedCreateRouteSegmentDto } from './create-route.segment.dto';

export class RouteSegmentDto extends ConcealedCreateRouteSegmentDto {
  @ApiProperty()
  id: number;
}
