/**
 * @file DTO specification for a route.
 */
import { ApiProperty } from '@nestjs/swagger';
import { RouteSegmentDto } from '../../routes.segments/dto/route.segment.dto';

export class RouteWithoutSegmentsDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}

export class RouteDto extends RouteWithoutSegmentsDto {
  @ApiProperty()
  segments: RouteSegmentDto[];
}

export class RouteWithMultipleFilesDTO {
  @ApiProperty({ description: 'Route name' })
  name: string;

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
