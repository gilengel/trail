import { IsInt, IsDefined, IsString } from "class-validator";
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

    @IsDefined()
    route!: Route;
}
