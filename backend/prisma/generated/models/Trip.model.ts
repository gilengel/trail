import { Prisma } from "@prisma/client";
import { IsInt, IsDefined } from "class-validator";
import "./";

export class Trip {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    layout!: Prisma.JsonValue;
}
