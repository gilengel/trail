import { ApiProperty } from '@nestjs/swagger';

export class UpdateRouteDto {
  @ApiProperty()
  name?: string;
}
