import { IsInt, IsDefined, IsString, IsOptional } from "class-validator";
import { RouteSegment, Trip } from "./";

export class Route {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDefined()
    segments!: RouteSegment[];

    @IsDefined()
    trip!: Trip;

    @IsDefined()
    @IsInt()
    tripId!: number;
}
