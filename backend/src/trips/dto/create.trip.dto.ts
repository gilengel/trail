/**
 * @file DTO specification for creating a route.
 */
import { ApiProperty } from '@nestjs/swagger';

export class CreateTripDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  layout: object;
}

export class CreateTripWithRoutes {
  @ApiProperty({
    description: 'Routes',
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

