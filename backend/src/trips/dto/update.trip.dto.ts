/**
 * @file DTO specification for updating a route.
 */
import { OmitType, PartialType } from '@nestjs/swagger';
import { Trip } from '.';

export class UpdateTrip extends PartialType(
  OmitType(Trip, ['id', 'routes'] as const),
) {}
