/**
 * @file DTO specification for a route.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsArray, IsOptional, IsObject } from 'class-validator';

import { RouteDto } from '../../routes/dto/route.dto';
export class TripDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsObject()
  layout: JsonValue; // Replace `any` with a known structure if possible

  @ApiProperty()
  @IsArray()
  @IsOptional()
  routes?: RouteDto[];
}
