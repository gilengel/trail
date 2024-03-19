import { IsInt, IsDefined, IsString } from "class-validator";
import { RouteSegment } from "./";

export class Route {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    name!: string;

    @IsDefined()
    segments!: RouteSegment[];
}
