/**
 * @file Provides functionality to create, read, update and delete images.
 */
import { Injectable, Logger } from '@nestjs/common';
import { DbImageDto, ImageDto } from './dto/image.dto';

import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma.service';
import ExifReader from 'exifreader';
import { Prisma } from '@prisma/client';
import * as conversion from '../conversion';
import * as fs from 'fs';
import { RouteSegmentDto } from '../routes.segments/dto/route.segment.dto';
import { generateFileExtensionBasedOnMimeType } from '../conversion';

interface SphericalCoordinates {
  longitude: number;
  latitude: number;
}

export class NoOrWrongGeoInformationError extends Error {
  constructor() {
    super('The provided image has no or wrong geo information.');
  }
}

export class InvalidOffsetError extends Error {
  constructor(value: number) {
    super(
      `The provided offset query parameter must be greater or equal to zero, got ${value}`,
    );
  }
}

export class InvalidCoordinates extends Error {
  constructor() {
    super(
      'The provided coordinates are invalid. Either longitude, latitude or both are undefined or outside the range',
    );
  }
}

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(private prisma: PrismaService) {}

  private extractCoordinates(image: Express.Multer.File): SphericalCoordinates {
    const metaInfo = ExifReader.load(image.buffer, {
      async: false,
      expanded: true,
      includeUnknown: true,
    });

    if (!metaInfo.gps) {
      throw new NoOrWrongGeoInformationError();
    }

    const longitude = metaInfo.gps.Longitude;
    const latitude = metaInfo.gps.Latitude;

    return {
      longitude,
      latitude,
    };
  }

  async saveImages(images: Express.Multer.File[]): Promise<DbImageDto[]> {
    let values;
    try {
      values = images.map((image) => {
        const coordinates = this.extractCoordinates(image);
        const point = conversion.point2wkt([
          coordinates.latitude,
          coordinates.longitude,
        ]);

        return [
          uuidv4(),
          'test',
          Prisma.sql`ST_GeomFromText(${point}::text, 4326)`,
          image.mimetype,
        ];
      });
    } catch (e) {
      return Promise.reject(new NoOrWrongGeoInformationError());
    }

    const result: DbImageDto[] = await this.prisma
      .$queryRaw`INSERT INTO "Image" (id, name, coordinates, mime_type) 
    VALUES ${Prisma.join(
      values.map((row) => Prisma.sql`(${Prisma.join(row)})`),
    )}
    RETURNING id, name, ST_AsText(coordinates) as coordinates`;

    // save all images to storage
    // TODO: it is bad to store them on the same server. Move them to another via REST
    result.forEach(async (value, index) => {
      const extension = generateFileExtensionBasedOnMimeType(
        images[index].mimetype,
      );

      fs.writeFileSync(`images/${value.id}.${extension}`, images[index].buffer);
    });

    return Promise.resolve(result);
  }

  private async multipleImagesQuery(
    geomertyAsWkt: string,
    offset: number,
  ): Promise<Array<ImageDto>> {
    const query = Prisma.sql`
    SELECT id, name, ST_AsText(coordinates) as coordinates, mime_type
    FROM "Image"
    WHERE ST_3DDWithin( coordinates, ST_GeomFromText(${geomertyAsWkt}::text, 4326), ${offset}::int )`;

    const result: Array<DbImageDto> = await this.prisma.$queryRaw(query);
    return Promise.resolve(conversion.dbimages2dto(result));
  }

  async getImagesNearCoordinate(
    longitude: number,
    latitude: number,
    altitude: number,
    maxOffsetRadius: number,
  ): Promise<Array<ImageDto>> {
    if (
      longitude === undefined ||
      latitude === undefined ||
      altitude === undefined
    ) {
      throw new InvalidCoordinates();
    }
    if (maxOffsetRadius < 0) {
      throw new InvalidOffsetError(maxOffsetRadius);
    }

    const pointWkt = conversion.point2wkt([longitude, latitude, altitude]);
    return this.multipleImagesQuery(pointWkt, maxOffsetRadius);
  }

  async getImagesNearRouteSegment(
    segment: RouteSegmentDto,
    maxOffset: number,
  ): Promise<ImageDto[]> {
    const routeWkt = conversion.numberArray2wkt(segment.coordinates);
    return this.multipleImagesQuery(routeWkt, maxOffset);
  }
}
