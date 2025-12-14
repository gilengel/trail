/**
 * @file DTO specification for creating a route.
 */
import { ApiProperty, IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { CreateRouteSegmentPrivate } from '../../segments/dto';
import { Route } from './route.dto';


class muu extends IntersectionType(
  OmitType(Route, ['id', 'segments', 'description'] as const),
  IntersectionType(
    PickType(Route, ['name' as const]),
    PartialType(PickType(Route, ['description' as const]))
  )
){}
/**
 * public DTO that can be used in the customer API
 */
export class CreateRoutePublic extends muu
{
  @ApiProperty()
  tripId: number;
  
  @ApiProperty({ required: false, type: [CreateRouteSegmentPrivate] })
  segments?: CreateRouteSegmentPrivate[];
}

/**
 * private DTO that cannot be used in the customer API
 */
export class CreateRoutePrivate extends muu
{
  @ApiProperty()
  tripId: number;
  
  @ApiProperty({ required: false, type: [CreateRouteSegmentPrivate] })
  segments?: CreateRouteSegmentPrivate[];
}
