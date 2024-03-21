/**
 * @file Dto definitions for images, both api and database (internal).
 */
import { ApiProperty } from '@nestjs/swagger';

export class DbImageDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  coordinates: string;
}

export class ImageDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  coordinates: Array<number>;
}
