/**
 * @file Service that provides all related functionality regarding route segment like creating, updating, deleting, accessing.
 * Also it provides functions for different calculations like the length of a segment.
 */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRouteSegmentDto } from './dto/create-route.segment.dto';
import { UpdateRouteSegmentDto } from './dto/update-route.segment.dto';
import { PrismaService } from '../prisma.service';
import * as conversion from '../conversion';
import { Prisma } from '@prisma/client';
import { NoAttributesProvidedError } from '../routes/routes.service';
import { RouteSegmentDto } from './dto/route.segment.dto';
import { RouteSegment } from './entity/routes.segment';

// If the client tries to create/update routes with less then two coordinates
export class NotEnoughCoordinatesError extends Error {
  constructor() {
    super(
      'Minimum number of coordinates for a route is two which was not met.',
    );
  }
}

// If the client tries to create/update routes with more than one million points
export class TooManyCoordinatesError extends Error {
  constructor() {
    super(
      `Maximum number of coordinates for a route is 1'000'000 which was exceed.`,
    );
  }
}

@Injectable()
export class RoutesSegmentsService {
  constructor(private prisma: PrismaService) {}

  // eslint-disable-next-line jsdoc/require-example
  /**
   * Create a new route in the database.
   * @param createRouteSegmentDto - The data for creating the new route.
   * @returns A Promise that resolves to a RouteDto object.
   */
  async create(
    createRouteSegmentDto: CreateRouteSegmentDto,
  ): Promise<RouteSegmentDto> {
    this.validateCoordinates(createRouteSegmentDto.coordinates);

    const coordinatesString = conversion.numberArray2wkt(
      createRouteSegmentDto.coordinates,
    );

    const values = Prisma.sql`(
      ${createRouteSegmentDto.routeId}, 
      ${createRouteSegmentDto.name}::text, 
      ${createRouteSegmentDto.description}::text, 
      ST_GeomFromText(${coordinatesString}::text, 4326)
    )`;

    const result = await this.prisma.$queryRaw<[{ id: number }]>`
      INSERT INTO "RouteSegment" ("routeId", name, description, coordinates) 
      VALUES ${values} RETURNING id`;

    return Promise.resolve({
      id: result[0].id,
      name: createRouteSegmentDto.name,
      coordinates: createRouteSegmentDto.coordinates,
    });
  }

  async findAllForRoute(routeId: number): Promise<RouteSegment[] | null> {
    const segments = await this.prisma.$queryRaw<
      RouteSegment[]
    >`SELECT "RouteSegment".id, "RouteSegment".name, "RouteSegment".description, ST_AsText(coordinates) AS coordinates 
    FROM "RouteSegment" 
    JOIN "Route" ON "RouteSegment"."routeId" = "Route".id
    WHERE "Route".id = ${routeId}::int`;

    return Promise.resolve(segments);
  }

  // eslint-disable-next-line jsdoc/require-example
  /**
   * Retrieve a route segment by its ID.
   * @param id - The ID of the route segment to retrieve.
   * @returns A Promise that resolves to a RouteSegmentDto object or null if not found.
   * @throws {HttpException} 404 if a route segment with the requested id could not be found in the database.
   */
  async findOne(id: number): Promise<RouteSegmentDto | null> {
    const routeSegment = await this.prisma.$queryRaw<RouteSegment[]>`
      SELECT "RouteSegment".id, "RouteSegment".name, "RouteSegment".description, ST_AsText(coordinates) AS coordinates 
      FROM "RouteSegment" 
      WHERE id = ${id}::int`;

    if (routeSegment.length == 0) {
      Promise.resolve([]);
      throw new HttpException(
        `Route segment with id ${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return Promise.resolve(conversion.dbRouteSegment2dto(routeSegment[0]));
  }

  // eslint-disable-next-line jsdoc/require-example
  /**
   * Calculates the length (2d) of a segment and returns it.
   * @param id - The ID of the route segment to retrieve.
   * @returns A Promise that resolves to a RouteSegmentDto object or null if not found.
   * @throws {HttpException} 404 if a route segment with the requested id could not be found in the database.
   */
  async length(id: number): Promise<number> {
    interface PostgisLength {
      st_length: number;
    }
    const segmentLength = await this.prisma.$queryRaw<PostgisLength[]>`
      SELECT ST_Length(coordinates) 
      FROM "RouteSegment" 
      WHERE id = ${id}::int`;

    return Promise.resolve(segmentLength[0].st_length);
  }

  // eslint-disable-next-line jsdoc/require-example
  /**
   * Updates an existing route segment in the database.
   * @param id - The ID of the route segment to be updated.
   * @param updateRouteSegmentDto - The data that will be changed. Only name and coordinates can be changed.
   * @returns A promise that resolves to the route segment with updated data.
   * @throws NoAttributesProvidedError if neither name nor coordinates are within the data.
   */
  async update(
    id: number,
    updateRouteSegmentDto: UpdateRouteSegmentDto,
  ): Promise<RouteSegmentDto> {
    // No attributes, invalid use case -> reject with error
    if (
      !updateRouteSegmentDto.name &&
      !updateRouteSegmentDto.coordinates &&
      !updateRouteSegmentDto.description
    ) {
      return Promise.reject(new NoAttributesProvidedError());
    }

    const attributesQueries = [];

    // Name only
    if (updateRouteSegmentDto.name) {
      attributesQueries.push(Prisma.sql`name = ${updateRouteSegmentDto.name}`);
    }

    // Coordinates only
    if (updateRouteSegmentDto.coordinates) {
      this.validateCoordinates(updateRouteSegmentDto.coordinates);
      const coordinates = conversion.numberArray2wkt(
        updateRouteSegmentDto.coordinates,
      );

      attributesQueries.push(Prisma.sql`coordinates = ${coordinates}`);
    }

    // Description only
    if (updateRouteSegmentDto.description) {
      const description = updateRouteSegmentDto.description;
      attributesQueries.push(Prisma.sql`description = ${description}`);
    }

    const query = Prisma.sql`UPDATE "RouteSegment"
                             SET ${Prisma.join(attributesQueries)} 
                             WHERE id= ${id}::int 
                             RETURNING id, name, description, ST_AsText(coordinates) AS coordinates;`;

    const result = await this.prisma.$queryRaw(query);

    return Promise.resolve(conversion.dbRouteSegment2dto(result[0]));
  }

  // eslint-disable-next-line jsdoc/require-example
  /**
   * Validates an array of coordinates to ensure they meet specific criteria.
   * @param coordinates - An array of arrays representing coordinates.
   * @throws {NotEnoughCoordinatesError} - If the array contains fewer than 2 coordinate sets.
   * @throws {TooManyCoordinatesError} - If the array contains more than 1,000,000 coordinate sets.
   */
  validateCoordinates(coordinates: Array<[number, number, number]>): void {
    // Check if there are at least 2 coordinates.
    if (coordinates.length < 2) {
      throw new NotEnoughCoordinatesError();
    }

    // Check if the array contains an excessive number of coordinates.
    if (coordinates.length > 1000000) {
      throw new TooManyCoordinatesError();
    }
  }
}
