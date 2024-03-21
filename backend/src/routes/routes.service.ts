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

import { GPXRoute } from './routes.parser';
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

  /**
   * Retrieve a route by its ID.
   *
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
      segments,
    };

    return Promise.resolve(conversion.dbRoute2dto(result));
  }

  async length(id: number): Promise<number> {
    const length = await this.prisma.$queryRaw<
      number[]
    >`SELECT SUM(ST_LENGTH(coordinates)) FROM "RouteSegment" WHERE "routeId"=${id}`;

    if (!length || length.length == 0) {
      throw new HttpException(
        `Route with id ${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return Promise.resolve(length[0]);
  }

  /**
   * Retrieve a list of routes based on provided parameters.
   *
   * @param params - An object containing query parameters (skip, take, cursor, where, orderBy).
   * @returns A Promise that resolves to an array of RouteDto objects.
   */
  async routes(): Promise<RouteWithoutSegmentsDto[]> {
    const routes = await this.prisma.$queryRaw<
      Route[]
    >`SELECT id, name FROM "Route"`;

    return Promise.resolve(routes);
  }

  /**
   * Create a new route in the database.
   *
   * @param routeDto - The data for creating the new route.
   * @returns A Promise that resolves to a RouteDto object.
   */
  async createRoute(routeDto: CreateRouteDto): Promise<RouteDto> {
    routeDto.segments.forEach((e) =>
      this.segments.validateCoordinates(e.coordinates),
    );

    const routeIds = await this.prisma.$queryRaw<[{ id: number }]>`
    INSERT INTO "Route" (name) 
    VALUES (${routeDto.name}::text)
    RETURNING id`;
    const routeId = routeIds[0].id;

    const values = routeDto.segments.map((segment: CreateRouteSegmentDto) => {
      const coordinatesString = conversion.numberArray2wkt(segment.coordinates);

      return Prisma.sql`(${segment.name}::text, ${routeId}, ST_GeomFromText(${coordinatesString}::text, 4326))`;
    });

    const segmentIds = await this.prisma.$queryRaw<[{ id: number }]>`
      INSERT INTO "RouteSegment" (name, "routeId", coordinates) 
      VALUES ${Prisma.join(values)} RETURNING id;`;

    const segments: RouteSegmentDto[] = routeDto.segments.map((segment, i) => {
      return {
        id: segmentIds[i].id,
        name: segment.name,
        coordinates: segment.coordinates,
      };
    });

    return Promise.resolve({
      id: routeId,
      name: routeDto.name,
      segments,
    });
  }

  async createRouteFromGPX(route: GPXRoute): Promise<RouteDto> {
    route.segments.forEach((e) =>
      this.segments.validateCoordinates(e.coordinates),
    );

    const ids: [{ id: number }] = await this.prisma.$queryRaw<[{ id: number }]>`
    INSERT INTO "Route" (name) 
    VALUES (${route.name}::text)
    RETURNING id`;
    const routeId = ids[0].id;

    const values = route.segments.map((segment: CreateRouteSegmentDto) => {
      const coordinatesString = conversion.numberArray2wkt(segment.coordinates);

      return Prisma.sql`(${segment.name}::text, ${routeId}, ST_GeomFromText(${coordinatesString}::text, 4326))`;
    });

    const segmentIds = await this.prisma.$queryRaw<{ id: number }[]>`
      INSERT INTO "RouteSegment" (name, "routeId", coordinates) 
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
      segments,
    });
  }

  /**
   * Update an existing route in the database.
   *
   * @param id - The ID of the route to update.
   * @param data - The data for updating the route.
   *
   * @returns A Promise that resolves to the updated route.
   */
  async updateRoute(id: number, data: UpdateRouteDto): Promise<RouteDto> {
    if (!data.name) {
      return Promise.reject(new NoAttributesProvidedError());
    }

    const routes = await this.prisma.$queryRaw<[{ id: number; name: string }]>`
      UPDATE "Route" 
      SET name = ${data.name}
      WHERE id = ${id}::int
      RETURNING id, name`;

    const segments = await this.segments.findAllForRoute(id);
    const result: Route = {
      id,
      name: routes[0].name,
      segments,
    };

    return Promise.resolve(conversion.dbRoute2dto(result));
  }

  /**
   * Delete a route from the database.
   *
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
