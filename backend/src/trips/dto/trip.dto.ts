/**
 * @file DTO specification for a trip.
 */
import {
  IsInt,
  IsString,
  IsArray,
  IsOptional,
  IsObject,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Route } from '../../routes/routes/dto/route.dto';

export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

export class Trip {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty({
    required: false,
    example: 'My Awesome Trip',
    description: 'The name of the trip',
    type: () => String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
    example: { key: 'value' },
    description: 'Trip layout as JSON',
    type: () => Object,
  })
  @IsObject()
  layout: Json;

  @ApiProperty({ type: () => Route })
  @IsArray()
  @IsOptional()
  routes?: Route[];
}
