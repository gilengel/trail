import { Prisma } from "@prisma/client";
import { IsInt, IsDefined, IsString } from "class-validator";
import { Route } from "./";

export class Trip {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    name!: string;

    @IsDefined()
    layout!: Prisma.JsonValue;

    @IsDefined()
    routes!: Route[];
}
