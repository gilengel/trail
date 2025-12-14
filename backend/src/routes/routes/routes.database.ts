/**
 * @file Contains the database logic for the routes api.
 */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma, Route } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import * as DTO from '../../dto'
import { RouteSegmentsDatabase } from '../segments';

export class NoAttributesProvidedError extends Error { }

// General note: Prisma currently does not support PostGIS, therefore we must use raw queries 🙁
@Injectable()
export class RoutesDatabase {
  constructor(
    @Inject(forwardRef(() => RouteSegmentsDatabase))
    private routeSegmentsDatabase: RouteSegmentsDatabase,
    private prisma: PrismaService
  ) { }

  /**
   * Create a new trip in the database.
   * @param data - The data for creating the new route.
   * @param trip - The trip the newly route shall be associated with.
   * @returns A Promise that resolves to a RouteDto object.
   */
  async create(data: DTO.CreateRoutePrivate, trip: DTO.Trip): Promise<DTO.Route> {
    const dbRoute = await this.prisma.route.create({
      data: {
        trip: { connect: { id: trip.id } },
        name: data.name,
        description: data.description,
      },
    });

    const dtoRoute = this.dbToDto(dbRoute);

    if (data.segments) {
      dtoRoute.segments = await this.routeSegmentsDatabase.createMultiple(data.segments, dtoRoute);
    }

    return Promise.resolve(dtoRoute);
  }

  /**
   * Retrieve a route by its ID.
   * @param id - The ID of the route to retrieve.
   * @returns A Promise that resolves to a RouteDto object or null if not found.
   */
  async getOneById(id: number): Promise<DTO.Route | null> {
    const routes = await this.prisma.$queryRaw<
      Route[]
    >`SELECT * FROM "Route" WHERE id = ${id}::int`;

    if (routes.length == 0) {
      return null;
    }

    const dtoRoute = this.dbToDto(routes[0]);
    dtoRoute.segments = await this.routeSegmentsDatabase.getAllForRoute(dtoRoute)

    return dtoRoute;
  }

  /**
   * Retrieve all routes that belongs to a trip (specified over the trip id).
   * @param tripId - Id of the trip from which you want to get all the routes.
   * @returns Array of all routes of a trip, can be empty if the trip does not have routes yet
   * or the trip does not exists.
   */
  async getAllByTripId(tripId: number): Promise<DTO.Route[] | null> {
    const routes = await this.prisma.route.findMany({
      where: {
        tripId,
      },
    });

    return Promise.resolve(routes.map(this.dbToDto));
  }

  /**
   * Get all stored routes from the database.
   * @returns A Promise that resolves to an array of RouteDto objects.
   */
  async getAll(): Promise<DTO.Route[]> {
    const routes = await this.prisma.$queryRaw<
      Route[]
    >`SELECT id, name FROM "Route"`;

    return Promise.resolve(routes.map(this.dbToDto));
  }

  /**
   * Update an existing trip in the database.
   * @param id - The ID of the trip to update.
   * @param data - The data for updating the trip.
   * @returns A Promise that resolves to the updated trip.
   */
  async update(id: number, data: DTO.UpdateRoute): Promise<DTO.RouteWithoutSegments | null> {
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

    const routes = await this.prisma.$queryRaw<DTO.RouteWithoutSegments[]>(query);

    if (routes.length == 0) {
      return Promise.resolve(null);
    }

    return Promise.resolve(routes[0]);
  }

  /**
   * Delete a route from the database.
   * @param id - The ID of the route to delete.
   * @returns A Promise that resolves to a Route object representing the deleted route.
   */
  async delete(id: number): Promise<boolean> {
    const deletedRows: number = await this.prisma.$queryRaw`
        DELETE FROM "Route" 
        WHERE id = ${id}::int;`;

    return deletedRows == 1;
  }

  /**
   * Converts a database RouteDto object to a RouteDto object.
   * @param route - A database RouteDto object.
   * @returns A RouteDto object.
   * @example
   * // this would usually come directly from the database and be created manually
   * const dbRoute : Route = {
   *   id: 0,
   *   name: 'route',
   *   segments: [
   *     {
   *       id: 1,
   *       name: 'segment',
   *       coordinated: 'POINT(32 64)
   *     }
   *   ]
   * }
   *
   * // returns {
   * //   id: 0,
   * //   name: 'route',
   * //   segments: [
   * //     {
   * //       id: 1,
   * //       name: 'segment',
   * //       coordinated: [32, 64]
   * //     }
   * //   ]
   * // }
   * dbRoute2dto(dbRoute)
   */
  private dbToDto(route: Route): DTO.Route {
    return {
      id: route.id,
      name: route.name,
      description: route.description,
      segments: []
    }
  }
}
