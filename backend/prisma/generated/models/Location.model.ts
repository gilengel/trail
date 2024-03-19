import { IsInt, IsDefined, IsDate } from "class-validator";
import "./";

export class Location {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;
}
