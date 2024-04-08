import { IsString, IsDefined } from "class-validator";
import "./";

export class Image {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsString()
    name!: string;

    @IsDefined()
    @IsString()
    mime_type!: string;
}
