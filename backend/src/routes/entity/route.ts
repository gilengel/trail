import { ApiProperty } from '@nestjs/swagger';
import { RouteSegment } from '../../routes.segments/entity/routes.segment';

/**
 * Represents a database Route object.
 */
export class Route {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  segments: Array<RouteSegment>;
}
