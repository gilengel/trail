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
}

export class RouteDto extends RouteWithoutSegmentsDto {
  @ApiProperty()
  segments: RouteSegmentDto[];
}
