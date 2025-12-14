/**
 * @file DTO specification for a route.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { RouteSegment } from '../../segments/dto/route.segment.dto';

export class Route {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  segments: RouteSegment[];
}

export type RouteWithoutSegments = Omit<Route, "segments">

export class RouteWithMultipleFiles {
  //@ApiProperty({ description: 'Route name' })
  name: string;

  @IsInt()
  @ApiProperty()
  tripId: number;

  @ApiProperty({
    description: 'Route segments',
    type: 'array',
    items: {
      type: 'file',
      items: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  files: unknown[];
}

