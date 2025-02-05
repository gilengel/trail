/**
 * @file DTO specification for a db route.
 */
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a database Route object.
 */
export class Trip {
  @ApiProperty()
  id: number;

  @ApiProperty()
  layout: Object;
}
