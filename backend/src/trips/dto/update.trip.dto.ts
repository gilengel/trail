/**
 * @file DTO specification for updating a route.
 */
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTripDto {
  @ApiProperty()
  layout: object;
}
