/**
 * @file DTO specification for a trip.
 */
import { ApiProperty } from './decorators';
import {IsInt, IsString, IsArray, IsOptional, IsObject} from 'class-validator';

import {RouteDto} from './route.dto';

export class TripDto {
    //@ApiProperty()
    @IsInt()
    id: number;

    //@ApiProperty()
    @IsString()
    name: string;

    //@ApiProperty()
    @IsObject()
    layout: unknown;

    //@ApiProperty({ type: () => RouteDto })
    @IsArray()
    @IsOptional()
    routes?: RouteDto[];
}
