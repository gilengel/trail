/**
 * @file DTO specification for a route.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsArray, IsOptional, IsObject } from 'class-validator';
import { Prisma } from "@prisma/client";

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
  layout: Prisma.JsonValue;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  routes?: RouteDto[];
}
