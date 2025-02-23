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
import { CreateRouteDto } from'shared';
import { RouteDto, RouteWithoutSegmentsDto } from'shared';

import * as conversion from '../conversion';

import { GPXRoute, GPXRouteSegment } from 'shared';
import { Prisma } from '@prisma/client';
import { CreateRouteSegmentDto } from'shared';
import { RoutesSegmentsService } from '../routes.segments/routes.segments.service';
import { RouteSegmentDto } from'shared';
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

    const segmentDTOs = await this.segments.findAllForRoute(id);
    const route: Route = {
      id,
      tripId: routes[0].tripId,
      name: routes[0].name,
      description: routes[0].description,
      segments: [],
    };

    const routeDto = conversion.dbRoute2dto(route);
    routeDto.segments = segmentDTOs;

    return Promise.resolve(routeDto);
  }

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

  /**
   * Get all stored routes from the database that belong to one trip.
   * @param id - The id of the trip you want to get the routes of.
   * @returns A Promise that resolves to an array of RouteDto objects.
   */
  async routesOfTrip(id: number): Promise<RouteWithoutSegmentsDto[]> {
    const routes = await this.prisma.route.findMany({
      where: {
        tripId: id
      },
    })

    return Promise.resolve(routes);
  }

  /**
   * Create a new route in the database.
   * @param routeDto - The data for creating the new route.
   * @returns A Promise that resolves to a RouteDto object.
   */
  async createRoute(routeDto: CreateRouteDto): Promise<RouteDto> {
    if (routeDto.segments) {
      routeDto.segments.forEach((e) =>
        this.segments.validateCoordinates(e.coordinates),
      );
    }

    const data = {
      name: routeDto.name ? routeDto.name : '',
      description: routeDto.description ? routeDto.description : '',
      trip: {
        connect: { id: routeDto.tripId },
      }
    }

    const newRoute = await this.prisma.route.create({
      data
    });

    if (routeDto.segments) {
      const values = routeDto.segments.map((segment: CreateRouteSegmentDto) => {
        const coordinatesString = conversion.numberArray2wkt(
          segment.coordinates,
        );

        return Prisma.sql`(${segment.name}::text, ${newRoute.id}, '', ST_GeomFromText(${coordinatesString}::text, 4326))`;
      });

      const segmentIds = await this.prisma.$queryRaw<[{ id: number }]>`
      INSERT INTO "RouteSegment" (name, "routeId", description, coordinates) 
      VALUES ${Prisma.join(values)} RETURNING id;`;

      const segments: RouteSegmentDto[] = routeDto.segments.map(
        (segment, i) => {
          return {
            id: segmentIds[i].id,
            name: segment.name,
            description: segment.description,
            coordinates: segment.coordinates,
          };
        },
      );

      return Promise.resolve({
        id: newRoute.id,
        tripId: routeDto.tripId,
        name: routeDto.name,
        description: routeDto.description,
        segments,
      });
    }

    return Promise.resolve({
      id: newRoute.id,
      tripId: routeDto.tripId,
      name: routeDto.name,
      description: routeDto.description,
      segments: [],
    });
  }

  async createRouteFromGPX(route: GPXRoute, tripId: number): Promise<RouteDto> {
    route.segments.forEach((e) =>
      this.segments.validateCoordinates(e.coordinates),
    );

    const newRoute = await this.prisma.route.create({
      data: {
        name: route.name,
        description: '',
        trip: {
          connect: { id: Number(tripId) },
        },
      },
    });

    const values = route.segments.map((segment: GPXRouteSegment) => {
      const coordinatesString = conversion.numberArray2wkt(segment.coordinates);

      return Prisma.sql`(${segment.name}::text, ${newRoute.id}, '', ST_GeomFromText(${coordinatesString}::text, 4326))`;
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
      id: newRoute.id,
      tripId: newRoute.tripId,
      name: route.name,
      description: '',
      segments,
    });
  }

  /**
   * Update an existing route in the database.
   * @param id - The ID of the route to update.
   * @param data - The data for updating the route.
   * @returns A Promise that resolves to the updated route.
   */
  async updateRoute(
    id: number,
    data: Prisma.RouteUpdateInput,
  ): Promise<RouteWithoutSegmentsDto> {
    if (!data.name && !data.description) {
      return Promise.reject(new NoAttributesProvidedError());
    }

    type RouteWithoutSegments = {
      id: number;
      tripId: number;
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
