/**
 * @file DTO specification for a route.
 */
import { ApiProperty } from '@nestjs/swagger';
import { RouteDto } from '../../routes/dto/route.dto';

export class TripDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  layout: Object;
}

