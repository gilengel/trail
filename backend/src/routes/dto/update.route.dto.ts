/**
 * @file DTO specification for updating a route.
 */
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRouteDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  description?: string;
}
