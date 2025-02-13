import { Prisma } from "@prisma/client";
import { IsInt, IsDefined } from "class-validator";
import { Route } from "./";

export class Trip {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    layout!: Prisma.JsonValue;

    @IsDefined()
    routes!: Route[];
}
