/**
 * @file DTO for the creation of trips.
 */
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrip {
  @ApiProperty({
    example: 'My Awesome Trip',
    description: 'The name of the trip',
    type: () => String,
  })
  name: string;

  @ApiProperty({
    example: { key: 'value' },
    description: 'Trip layout as JSON',
    type: () => Object,
  })
  layout: object;
}
