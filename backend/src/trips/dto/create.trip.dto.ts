/**
 * @file DTO specification for creating a route.
 */
import { ApiProperty } from '@nestjs/swagger';

export class CreateTripDto {
  @ApiProperty()
  layout: Object;
}
