import { IsInt, IsDefined, IsString } from "class-validator";
import "./";

export class Route {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    name!: string;
}
