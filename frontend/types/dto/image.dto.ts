/**
 * @file Dto definitions for images, both api and database (internal).
 */
import { ApiProperty } from './decorators';

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

export class ImageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  coordinates: Array<number>;

  @ApiProperty()
  url: string;
}

export class CountDto {
  @ApiProperty()
  count: string;
}
