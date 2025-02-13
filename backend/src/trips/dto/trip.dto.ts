/**
 * @file DTO specification for a route.
 */
import { ApiProperty } from '@nestjs/swagger';

export class TripDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  layout: object;
}
