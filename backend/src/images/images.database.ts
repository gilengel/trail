/**
 * @file Contains the database logic for the image api.
 */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as DTO from './dto'
import { PrismaService } from '../prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { numberArray2wkt, point2wkt, wkt2point } from '../routes/database.conversion';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DB {
    export type Image = {
        id: string;

        name: string;

        timestamp: Date;

        coordinates: string;

        mime_type: string;
    }


    export type Count = {
        count: bigint;
    }
}


/**
 * Returns the file extension for supported image file types.
 * Be aware that this function will return undefined / nothing if the provided
 * mimeType is not 'image/jpeg' or 'image/tiff'. The controller will enforce that only
 * images of these types can be further processed.
 * @param mimeType - File type as mime type string see https://www.iana.org/assignments/media-types/media-types.xhtml for a list of media types.
 * @returns Jpg or tif, undefined or nothing if mimeType is invalid.
 */
function generateFileExtensionBasedOnMimeType(mimeType: string): string {
    switch (mimeType) {
        case 'image/jpeg': {
            return 'jpg';
        }
        case 'image/tiff': {
            return 'tif';
        }
    }
}


// General note: Prisma currently does not support PostGIS, therefore we must use raw queries 🙁
@Injectable()
export class ImagesDatabase {
    constructor(private prisma: PrismaService) { }

    async create(images: DTO.CreateImage[]): Promise<DTO.Image[]> {
        const dbImages = images.map(image => [
            uuidv4(),
            image.name,
            Prisma.sql`ST_GeomFromText(${point2wkt(image.coordinates)}::text, 4326)`,
            image.mimeType,
        ])
        const result: DB.Image[] = await this.prisma
            .$queryRaw`
                INSERT INTO "Image" (id, name, coordinates, mime_type) 
                VALUES ${Prisma.join(
                dbImages.map((image) => Prisma.sql`(${Prisma.join(image)})`),
            )}
                RETURNING id, name, ST_AsText(coordinates) as coordinates, mime_type`;

        // save all images to storage
        // TODO: it is bad to store them on the same server. Move them to another via REST
        result.forEach(async (value, index) => {
            const extension = generateFileExtensionBasedOnMimeType(
                images[index].mimeType,
            );

            fs.writeFileSync(`images/${value.id}.${extension}`, images[index].buffer);
        });

        return Promise.resolve(result.map(this.db2Dto));
    }

    async getByCoordinate(
        coordinate: number[],
        maxOffsetRadius: number,
        maxNumberOfImages?: number
    ): Promise<DTO.Image[]> {
        const pointWkt = point2wkt(coordinate);
        return this.getByGeometry(pointWkt, maxOffsetRadius, maxNumberOfImages);
    }

    async getByLineSegment(
        segment: number[][],
        maxOffsetRadius: number,
        maxNumberOfImages?: number
    ): Promise<DTO.Image[]> {
        const linestringWkt = numberArray2wkt(segment);

        return this.getByGeometry(linestringWkt, maxOffsetRadius, maxNumberOfImages);
    }

    private async getByGeometry(
        geometryAsWkt: string,
        offset: number,
        maxNumberOfImages?: number,
    ): Promise<Array<DTO.Image>> {
        const limit = this.saveLimit(maxNumberOfImages);

        const query = Prisma.sql`
        SELECT id, name, ST_AsText(coordinates) as coordinates, mime_type
        FROM "Image"
        WHERE ST_3DDWithin( coordinates, ST_GeomFromText(${geometryAsWkt}::text, 4326), ${offset}::int ) 
        LIMIT ${limit}`;

        const result: DB.Image[] = await this.prisma.$queryRaw(query);
        return Promise.resolve(result.map(this.db2Dto));
    }

    async getCountByGeometry(
        geometryAsWkt: string,
        offset: number,
        maxNumberOfImages?: number,
    ): Promise<number> {
        const limit = this.saveLimit(maxNumberOfImages);

        const query = Prisma.sql`
        SELECT COUNT(id)
        FROM "Image"
        WHERE ST_3DDWithin( coordinates, ST_GeomFromText(${geometryAsWkt}::text, 4326), ${offset}::int )
        LIMIT ${limit}`;

        const result: DB.Count[] = await this.prisma.$queryRaw(query);

        return Promise.resolve(Number(result[0].count));
    }

    private saveLimit(value?: number): bigint {
        return value ? BigInt(value) : BigInt(Number.MAX_SAFE_INTEGER);
    }

    /**
     * Converts an image dto as it is saved within the database into a dto that can
     * be used more easily. It mainly takes care of converting the coordinates from wkt format
     * to an array of numbers.
     * @param image - The image dto as it saved in the database.
     * @returns A ImageDto instance.
     * @example
     * // this would usually come directly from the database and be created manually
     * const dbImageDto : DbImageDto = {
     *   uuid: '0cbb5048-f0a7-44bc-b436-31ce5df46094',
     *   timestamp: Date.parse('01 Jan 1970 00:00:00 GMT'),
     *   coordinated: 'POINT(32 64)'
     * }
     *
     * // returns {
     * //   uuid: '0cbb5048-f0a7-44bc-b436-31ce5df46094',
     * //   timestamp same as above,
     * //   name: 'name of the image file saved on the server'
     * //   coordinated: [32, 64]
     * // }
     * dbimage2dto(dbRouteSegment)
     */
    private db2Dto(image: DB.Image): DTO.Image {
        return {
            id: image.id,
            name: image.name,
            url: `${image.id}.${generateFileExtensionBasedOnMimeType(image.mime_type)}`,
            mimeType: image.mime_type,
            timestamp: image.timestamp,
            coordinates: wkt2point(image.coordinates)
        }
    }
}
