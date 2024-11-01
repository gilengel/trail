/**
 * @file Provides functionality to create, read, update and delete routes.
 */
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRouteDto } from './dto/create.route.dto';
import { RouteDto, RouteWithoutSegmentsDto } from './dto/route.dto';
import { UpdateRouteDto } from './dto/update.route.dto';

import * as conversion from '../conversion';

import { GPXRoute, GPXRouteSegment } from './routes.parser';
import { Prisma } from '@prisma/client';
import { CreateRouteSegmentDto } from '../routes.segments/dto/create-route.segment.dto';
import { RoutesSegmentsService } from '../routes.segments/routes.segments.service';
import { RouteSegmentDto } from '../../src/routes.segments/dto/route.segment.dto';
import { Route } from './entity/route';

export class NoAttributesProvidedError extends Error {}

// General note: Prisma currently does not support PostGIS, therefore we must use raw queries 🙁
@Injectable()
export class RoutesService {
  constructor(
    private prisma: PrismaService,

    @Inject(forwardRef(() => RoutesSegmentsService))
    private segments: RoutesSegmentsService,
  ) {}

  // eslint-disable-next-line jsdoc/require-example
  /**
   * Retrieve a route by its ID.
   * @param id - The ID of the route to retrieve.
   * @returns A Promise that resolves to a RouteDto object or null if not found.
   */
  async route(id: number): Promise<RouteDto | null> {
    const routes = await this.prisma.$queryRaw<
      Route[]
    >`SELECT * FROM "Route" WHERE id = ${id}::int`;

    if (!routes || routes.length == 0) {
      throw new HttpException(
        `Route with id ${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    const segments = await this.segments.findAllForRoute(id);
    const result: Route = {
      id,
      name: routes[0].name,
      description: routes[0].description,
      segments,
    };

    return Promise.resolve(conversion.dbRoute2dto(result));
  }

  // eslint-disable-next-line jsdoc/require-example
  /**
   * Get all stored routes from the database.
   * @returns A Promise that resolves to an array of RouteDto objects.
   */
  async routes(): Promise<RouteWithoutSegmentsDto[]> {
    const routes = await this.prisma.$queryRaw<
      Route[]
    >`SELECT id, name FROM "Route"`;

    return Promise.resolve(routes);
  }

  // eslint-disable-next-line jsdoc/require-example
  /**
   * Create a new route in the database.
   * @param routeDto - The data for creating the new route.
   * @returns A Promise that resolves to a RouteDto object.
   */
  async createRoute(routeDto: CreateRouteDto): Promise<RouteDto> {
    routeDto.segments.forEach((e) =>
      this.segments.validateCoordinates(e.coordinates),
    );

    const routeIds = await this.prisma.$queryRaw<[{ id: number }]>`
    INSERT INTO "Route" (name, description) 
    VALUES (${routeDto.name}::text, ${routeDto.description}::text)
    RETURNING id`;
    const routeId = routeIds[0].id;

    const values = routeDto.segments.map((segment: CreateRouteSegmentDto) => {
      const coordinatesString = conversion.numberArray2wkt(segment.coordinates);

      return Prisma.sql`(${segment.name}::text, ${routeId}, '', ST_GeomFromText(${coordinatesString}::text, 4326))`;
    });

    const segmentIds = await this.prisma.$queryRaw<[{ id: number }]>`
      INSERT INTO "RouteSegment" (name, "routeId", description, coordinates) 
      VALUES ${Prisma.join(values)} RETURNING id;`;

    const segments: RouteSegmentDto[] = routeDto.segments.map((segment, i) => {
      return {
        id: segmentIds[i].id,
        name: segment.name,
        description: segment.description,
        coordinates: segment.coordinates,
      };
    });

    return Promise.resolve({
      id: routeId,
      name: routeDto.name,
      description: routeDto.description,
      segments,
    });
  }

  async createRouteFromGPX(route: GPXRoute): Promise<RouteDto> {
    route.segments.forEach((e) =>
      this.segments.validateCoordinates(e.coordinates),
    );

    const ids: [{ id: number }] = await this.prisma.$queryRaw<[{ id: number }]>`
    INSERT INTO "Route" (name, description) 
    VALUES (${route.name}::text, '')
    RETURNING id`;
    const routeId = ids[0].id;

    const values = route.segments.map((segment: GPXRouteSegment) => {
      const coordinatesString = conversion.numberArray2wkt(segment.coordinates);

      return Prisma.sql`(${segment.name}::text, ${routeId}, '', ST_GeomFromText(${coordinatesString}::text, 4326))`;
    });

    const segmentIds = await this.prisma.$queryRaw<{ id: number }[]>`
      INSERT INTO "RouteSegment" (name, "routeId", description, coordinates) 
      VALUES ${Prisma.join(values)} RETURNING id;`;

    const segments = route.segments.map((segment, i) => {
      return {
        id: segmentIds[i].id,
        name: segment.name,
        coordinates: segment.coordinates,
      };
    });

    return Promise.resolve({
      id: routeId,
      name: route.name,
      description: '',
      segments,
    });
  }

  // eslint-disable-next-line jsdoc/require-example
  /**
   * Update an existing route in the database.
   * @param id - The ID of the route to update.
   * @param data - The data for updating the route.
   * @returns A Promise that resolves to the updated route.
   */
  async updateRoute(
    id: number,
    data: UpdateRouteDto,
  ): Promise<RouteWithoutSegmentsDto> {
    if (!data.name && !data.description) {
      return Promise.reject(new NoAttributesProvidedError());
    }

    type RouteWithoutSegments = {
      id: number;
      name: string;
      description: string;
    };

    const attributesQueries = [];
    // Name only
    if (data.name) {
      attributesQueries.push(Prisma.sql`name = ${data.name}`);
    }

    // Description only
    if (data.description) {
      attributesQueries.push(Prisma.sql`description = ${data.description}`);
    }

    const query = Prisma.sql`UPDATE "Route" 
                             SET ${Prisma.join(attributesQueries)}
                             WHERE id = ${id}::int
                             RETURNING id, name, description`;

    const routes = await this.prisma.$queryRaw<RouteWithoutSegments[]>(query);

    if (routes.length == 0) {
      throw new HttpException(
        `Route with id ${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return Promise.resolve(routes[0]);
  }

  // eslint-disable-next-line jsdoc/require-example
  /**
   * Delete a route from the database.
   * @param id - The ID of the route to delete.
   * @returns A Promise that resolves to a RouteDto object representing the deleted route.
   */
  async deleteRoute(id: number): Promise<number> {
    const deletedRows: number = await this.prisma.$queryRaw`
        DELETE FROM "Route" 
        WHERE id = ${id}::int;`;

    return Promise.resolve(deletedRows);
  }
}
