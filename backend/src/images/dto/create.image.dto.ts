/**
 * @file DTO specification for persisting a new image.
 */
import { Image } from './image.dto'
import { OmitType } from "@nestjs/swagger";

export class CreateImage extends OmitType(Image, ["id", "timestamp", "url"] as const) {
    public buffer: Buffer;
} 