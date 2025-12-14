/**
 * @file DTO specification for an image.
 */
import { ApiProperty } from "@nestjs/swagger";

export class Image {
  @ApiProperty()
  id: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  coordinates: number[];

  @ApiProperty()
  url: string;
}