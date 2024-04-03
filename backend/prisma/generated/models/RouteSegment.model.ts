import { IsInt, IsDefined, IsString, IsOptional } from "class-validator";
import { Route } from "./";

export class RouteSegment {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsInt()
    routeId!: number;

    @IsDefined()
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDefined()
    route!: Route;
}
