/**
 * @file DTO specification for a db route segment.
 */
import { ApiProperty } from '@nestjs/swagger';

export class RouteSegment {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  coordinates: string;
}
