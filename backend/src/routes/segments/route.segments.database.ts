/**
 * @file Contains all logic to persist and retrieve route segments from the database.
 */
import { Injectable } from '@nestjs/common';
import { Prisma, RouteSegment as PrismaRouteSegment } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { NoAttributesProvidedError } from '../routes/routes.database';
import * as DTO from '../../dto';
import { numberArray2wkt, wkt2numberArray } from '../database.conversion';

// General note: Prisma currently does not support PostGIS and won't create the correct types
//               for schema types that contain unsupported fields such as coordinates ->
//               you'll find the correct types in this namespace.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DB {
  export type Coordinates = { coordinates: [number, number, number][] };
  export type CoordinatesWKT = { coordinates: string };

  export type RouteSegment = PrismaRouteSegment & CoordinatesWKT;
  export type RouteSegmentCreateInput = Partial<
    Omit<RouteSegment, 'routeId'>
  > & { routeId: number };
  export type RouteSegmentUpdateInput = Pick<
    Prisma.RouteSegmentUpdateInput,
    'name' | 'description'
  > &
    Partial<Coordinates>;
}

// General note: Prisma currently does not support PostGIS, therefore we must use raw queries 🙁
@Injectable()
export class RouteSegmentsDatabase {
  constructor(private prisma: PrismaService) {}

  async create(
    segment: DTO.CreateRouteSegmentPrivate,
    route: DTO.Route,
  ): Promise<DTO.RouteSegment | null> {
    const coordinatesInWktFormat = numberArray2wkt(segment.coordinates);

    const insertedRouteSegmentWKT = await this.prisma.$queryRaw<
      DB.RouteSegment[]
    >`
            INSERT INTO "RouteSegment"
                ("routeId", "name", "description", "coordinates")
            VALUES (
                ${route.id},
                ${segment.name},
                ${segment.description},
                ST_GeomFromText(${coordinatesInWktFormat}, 4326)
            )
            RETURNING id, "routeId", name, description, ST_AsText(coordinates) AS coordinates;
        `;

    return Promise.resolve(this.db2Dto(insertedRouteSegmentWKT[0]));
  }

  async createMultiple(
    segments: DTO.CreateRouteSegmentPrivate[],
    route: DTO.Route,
  ): Promise<DTO.RouteSegment[]> {
    const values = segments.map((segment) => {
      const wkt = numberArray2wkt(segment.coordinates);

      return Prisma.sql`(
                ${route.id},
                ${segment.name},
                ${segment.description},
                ST_GeomFromText(${wkt}, 4326)
            )`;
    });

    const insertedRouteSegments = await this.prisma.$queryRaw<
      DB.RouteSegment[]
    >`
            INSERT INTO "RouteSegment"
                ("routeId", "name", "description", "coordinates")
            VALUES ${Prisma.join(values)}
            RETURNING id, "routeId", name, description, ST_AsText(coordinates) AS coordinates;
    `;

    return insertedRouteSegments.map(this.db2Dto);
  }

  async getOneById(id: number): Promise<DTO.RouteSegment | null> {
    const routeSegments = await this.prisma.$queryRaw<DB.RouteSegment[]>`
          SELECT "RouteSegment".id, "RouteSegment"."routeId", "RouteSegment".name, "RouteSegment".description, ST_AsText(coordinates) AS coordinates 
          FROM "RouteSegment" 
          WHERE id = ${id}::int`;

    if (routeSegments.length === 0) {
      return Promise.resolve(null);
    }

    return Promise.resolve(this.db2Dto(routeSegments[0]));
  }

  async getAllForRoute(route: DTO.Route): Promise<DTO.RouteSegment[]> {
    const segmentsWKT = await this.prisma.$queryRaw<
      DB.RouteSegment[]
    >`SELECT "RouteSegment".id, "RouteSegment".name, "RouteSegment".description, ST_AsText(coordinates) AS coordinates 
          FROM "RouteSegment" 
          WHERE "routeId" = ${route.id}::int`;

    const segment = segmentsWKT.map((segment) => this.db2Dto(segment));
    return Promise.resolve(segment);
  }

  /**
   * Updates an existing route segment in the database.
   * @param id - The ID of the route segment to be updated.
   * @param data - The route segment data that will be changed. Only name and coordinates can be changed.
   * @returns A promise that resolves to the route segment with updated data.
   * @throws NoAttributesProvidedError if neither name nor coordinates are within the data.
   */
  async update(
    id: number,
    data: DTO.UpdateRouteSegment,
  ): Promise<DTO.RouteSegment> {
    const attributesQueries = [];

    // No attributes, invalid use case -> reject with error
    if (!data.name && !data.coordinates && !data.description) {
      return Promise.reject(new NoAttributesProvidedError());
    }

    // Name only
    if (data.name) {
      attributesQueries.push(Prisma.sql`name = ${data.name}`);
    }

    // Coordinates only
    if (data.coordinates) {
      const coordinates = numberArray2wkt(data.coordinates);

      attributesQueries.push(Prisma.sql`coordinates = ${coordinates}`);
    }

    // Description only
    if (data.description) {
      const description = data.description;
      attributesQueries.push(Prisma.sql`description = ${description}`);
    }

    const query = Prisma.sql`UPDATE "RouteSegment"
                             SET ${Prisma.join(attributesQueries)} 
                             WHERE id= ${id}::int 
                             RETURNING id, "routeId", name, description, ST_AsText(coordinates) AS coordinates;`;

    const updateRouteSegmentWKT = await this.prisma.$queryRaw(query);
    const updateRouteSegment = this.db2Dto(updateRouteSegmentWKT[0]);

    return Promise.resolve(updateRouteSegment);
  }

  /**
   * Calculates the length (2d) of a segment and returns it.
   * @param id - The id of the segment from which the length shall be calculated.
   * @returns The length of the required segment, null if the required segment does not exist.
   */
  async length(id: number): Promise<number | null> {
    interface PostgisLength {
      st_length: number;
    }
    const segmentLength = await this.prisma.$queryRaw<PostgisLength[]>`
            SELECT ST_Length(coordinates) 
            FROM "RouteSegment" 
            WHERE id = ${id}::int`;

    return Promise.resolve(segmentLength[0].st_length);
  }

  /**
   * Converts a database RouteSegmentDto object to a RouteSegmentDto object.
   * @param routeSegment - A database RouteSegmentDto object.
   * @returns A RouteSegmentDto object.
   * @example
   * // this would usually come directly from the database and be created manually
   * const dbRouteSegment : RouteSegment = {
   *   id: 1,
   *   name: 'segment',
   *   coordinated: 'POINT(32 64)
   * }
   *
   * // returns {
   * //   id: 1,
   * //   name: 'segment',
   * //   coordinated: [32, 64]
   * // }
   * dbRouteSegment2dto(dbRouteSegment)
   */
  private db2Dto(routeSegment: DB.RouteSegment): DTO.RouteSegment {
    return {
      id: routeSegment.id,
      name: routeSegment.name,
      description: routeSegment.description,
      coordinates: wkt2numberArray(routeSegment.coordinates),
    };
  }
}
