import { ApiProperty } from '@nestjs/swagger';
import { ConcealedCreateRouteSegmentDto } from '../../routes.segments/dto/create-route.segment.dto';

export class CreateRouteDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  segments: ConcealedCreateRouteSegmentDto[];
}
