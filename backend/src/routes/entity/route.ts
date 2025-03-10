/**
 * @file DTO specification for a db route.
 */
import { ApiProperty } from '@nestjs/swagger';
import { RouteSegment } from '../../routes.segments/entity/routes.segment';

/**
 * Represents a database Route object.
 */
export class Route {
  @ApiProperty()
  id: number;

  @ApiProperty()
  tripId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  segments: Array<RouteSegment>;
}
