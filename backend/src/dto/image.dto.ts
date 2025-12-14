/**
 * @file Dto definitions for images, both api and database (internal).
 */
import { ApiProperty } from '@nestjs/swagger';

export class DbImageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  coordinates: string;

  @ApiProperty()
  mime_type: string;
}

export class CountDto {
  @ApiProperty()
  count: string;
}
