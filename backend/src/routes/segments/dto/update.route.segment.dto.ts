/**
 * @file DTO specification for updating a route segment.
 */
import { OmitType, PartialType } from '@nestjs/swagger';
import { RouteSegment } from './route.segment.dto';


export class UpdateRouteSegment extends PartialType (
  OmitType(RouteSegment, ['id'] as const),
) {}
