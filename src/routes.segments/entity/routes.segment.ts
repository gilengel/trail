import { ApiProperty } from '@nestjs/swagger';

export class RouteSegment {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  coordinates: string;
}
