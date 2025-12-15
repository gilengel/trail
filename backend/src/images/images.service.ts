/**
 * @file Provides functionality to create, read, update and delete images.
 */
import { Injectable } from '@nestjs/common';

import * as DTO from '../dto';

import { RouteSegment } from '../routes/segments/dto/route.segment.dto';
import { ImagesDatabase } from './images.database';
import { numberArray2wkt } from '../routes/database.conversion';

export class InvalidOffsetError extends Error {
  constructor(value: number) {
    super(
      `The provided offset query parameter must be greater or equal to zero, got ${value}`,
    );
  }
}

@Injectable()
export class ImagesService {
  constructor(private database: ImagesDatabase) {}

  async saveImages(images: DTO.CreateImage[]): Promise<DTO.Image[]> {
    return this.database.create(images);
  }

  private async multipleImagesQueryCount(
    geometryAsWkt: string,
    offset: number,
  ): Promise<number> {
    return this.database.getCountByGeometry(geometryAsWkt, offset);
  }

  async getImagesNearCoordinate(
    coordinate: number[],
    maxOffsetRadius: number,
    maxNumberOfImages?: number,
  ): Promise<DTO.Image[]> {
    return this.database.getByCoordinate(
      coordinate,
      maxOffsetRadius,
      maxNumberOfImages,
    );
  }

  async getImagesNearRouteSegment(
    segment: RouteSegment,
    maxOffset: number,
    maxNumberOfImages?: number,
  ): Promise<DTO.Image[]> {
    return this.database.getByLineSegment(
      segment.coordinates,
      maxOffset,
      maxNumberOfImages,
    );
  }

  async getNumberOfImagesNearRouteSegment(
    segment: RouteSegment,
    maxOffset: number,
  ): Promise<number> {
    const routeWkt = numberArray2wkt(segment.coordinates);
    return this.multipleImagesQueryCount(routeWkt, maxOffset);
  }
}
