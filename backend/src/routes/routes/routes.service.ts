/**
 * @file Provides functionality to create, read, update and delete routes.
 */
import {
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';

import { RouteSegmentsService } from '../segments/route.segments.service';
import * as DTO from '../../dto';
import { RoutesDatabase } from './routes.database';

// General note: Prisma currently does not support PostGIS, therefore we must use raw queries 🙁
@Injectable()
export class RoutesService {
  constructor(
    private routesDatabase: RoutesDatabase,
    @Inject(forwardRef(() => RouteSegmentsService))
    private segments: RouteSegmentsService,
  ) { }

  /**
   * Retrieve a route by its ID.
   * @param id - The ID of the route to retrieve.
   * @returns A Promise that resolves to a Route object or null if not found.
   */
  async route(id: number): Promise<DTO.Route | null> {
    const routeDB = await this.routesDatabase.getOneById(id);

    if (!routeDB) {
      return Promise.resolve(null);
    }

    const route: DTO.Route = {
      id,
      name: routeDB.name,
      description: routeDB.description,
      segments: []
    };

    route.segments = await this.segments.findAllForRoute(route);

    return Promise.resolve(route);
  }

  /**
   * Get all stored routes from the database.
   * @returns A Promise that resolves to an array of Route objects.
   */
  async routes(): Promise<DTO.RouteWithoutSegments[]> {
    return this.routesDatabase.getAll();
  }

  /**
   * Get all stored routes from the database that belong to one trip.
   * @param id - The id of the trip you want to get the routes of.
   * @returns A Promise that resolves to an array of Route objects.
   */
  async routesOfTrip(id: number): Promise<DTO.RouteWithoutSegments[]> {
    return this.routesDatabase.getAllByTripId(id);
  }

  /**
   * Create a new route in the database.
   * @param route - The data for creating the new route.
   * @param trip - The trip for which the routes are created (and therefore associated with).
   * @returns A Promise that resolves to a Route object.
   */
  async createRoute(route: DTO.CreateRoutePrivate, trip: DTO.Trip): Promise<DTO.Route> {
    if (route.segments) {
      route.segments.forEach((segment) =>
        this.segments.validateCoordinates(segment.coordinates),
      );
    }

    const newRoute = await this.routesDatabase.create(route, trip);

    return Promise.resolve(newRoute);
  }

  /**
   * Update an existing route in the database.
   * @param id - The ID of the route to update.
   * @param data - The data for updating the route.
   * @returns A Promise that resolves to the updated route.
   */
  async updateRoute(
    id: number,
    data: DTO.UpdateRoute,
  ): Promise<DTO.RouteWithoutSegments | null> {
    const route = await this.routesDatabase.update(id, data);

    return Promise.resolve(route);
  }

  /**
   * Delete a route from the database.
   * @param id - The ID of the route to delete.
   * @returns True if the route was successfully deleted, false otherwise.
   */
  async deleteRoute(id: number): Promise<boolean> {
    return this.routesDatabase.delete(id);
  }
}
