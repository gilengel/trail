import { IsInt, IsDefined, IsString, IsOptional } from "class-validator";
import "./";

export class spatial_ref_sys {
    @IsDefined()
    @IsInt()
    srid!: number;

    @IsOptional()
    @IsString()
    auth_name?: string;

    @IsOptional()
    @IsInt()
    auth_srid?: number;

    @IsOptional()
    @IsString()
    srtext?: string;

    @IsOptional()
    @IsString()
    proj4text?: string;
}
