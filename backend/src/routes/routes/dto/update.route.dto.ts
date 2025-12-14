/**
 * @file DTO specification for updating a route.
 */
import { ValidateIf } from 'class-validator';
import { CreateRoutePublic } from './create.route.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateRoute extends PartialType(CreateRoutePublic) {
  /**
   * TODO: reenable.
   * @ValidateIf(
   * (dto: CreateRoute) => !dto.name && !dto.description && !dto.segments,
   * )
   * validateAtLeastOneField() {
   * throw new Error(
   * 'At least one field (name, description, or segments) must be set.',
   * );
   * }
   */
}
