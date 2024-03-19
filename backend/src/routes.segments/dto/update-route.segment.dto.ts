import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ConcealedCreateRouteSegmentDto } from './create-route.segment.dto';

export class UpdateRouteSegmentDto extends PartialType(
  ConcealedCreateRouteSegmentDto,
) {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  coordinates?: Array<Array<number>>;
}
