/**
 * @file DTO specification for creating a route segment.
 */
import { ApiProperty } from '@nestjs/swagger';

export class ConcealedCreateRouteSegmentDto {
  @ApiProperty()
  name: string;

  /**
   * Limits:
   * minimum: two coordinates 2d or 3d
   * maximum: one million coordinates 2d or 3d (although we highly recommend to not store such long routes as querying them will be slow).
   *
   * All coordinates must be either 2d or 3d - mixing is not allowed and shall return an error by the backend.
   */
  @ApiProperty()
  coordinates: Array<[number, number, number]>;
}

export class CreateRouteSegmentDto extends ConcealedCreateRouteSegmentDto {
  @ApiProperty()
  routeId: number;
}
