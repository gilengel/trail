/**
 * @file Service that provides all related functionality regarding route segment like creating, updating, deleting, accessing.
 * Also, it provides functions for different calculations like the length of a segment.
 */
import { Injectable } from '@nestjs/common';
import { RouteSegmentsDatabase } from './route.segments.database';
import * as DTO from '../../dto';

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

// If the coordinates bot have 2D and 3D data
export class MixedCoordinatesError extends Error {
  constructor() {
    super(`Mixing 2D and 3D coordinates in a route segment is not supported.`);
  }
}

@Injectable()
export class RouteSegmentsService {
  constructor(private database: RouteSegmentsDatabase) {}

  /**
   * Create a new route in the database.
   * @param segment - The data for creating the new route.
   * @param route - The route where the new segment is associated with.
   * @returns The newly created route segment.
   */
  async create(
    segment: DTO.CreateRouteSegmentPrivate,
    route: DTO.Route,
  ): Promise<DTO.RouteSegment> {
    this.validateCoordinates(segment.coordinates);

    return this.database.create(segment, route);
  }

  async findAllForRoute(route: DTO.Route): Promise<DTO.RouteSegment[]> {
    return this.database.getAllForRoute(route);
  }

  /**
   * Retrieve a route segment by its ID.
   * @param id - The ID of the route segment to retrieve.
   * @returns The route segment with the given ID if found, null otherwise.
   */
  async findOne(id: number): Promise<DTO.RouteSegment | null> {
    return this.database.getOneById(id);
  }

  /**
   * Calculates the length (2d) of a segment and returns it.
   * @param id - The ID of the route segment to retrieve.
   * @returns A Promise that resolves to a RouteSegmentDto object or null if not found.
   */
  async length(id: number): Promise<number> {
    return this.database.length(id);
  }

  /**
   * Updates an existing route segment in the database.
   * @param id - The ID of the route segment to be updated.
   * @param data - The data that will be changed. Only name and coordinates can be changed.
   * @returns The changed route segment.
   */
  async update(
    id: number,
    data: DTO.UpdateRouteSegment,
  ): Promise<DTO.RouteSegment> {
    if (data.coordinates) {
      this.validateCoordinates(data.coordinates);
    }

    return this.database.update(id, data);
  }

  /**
   * Validates an array of coordinates to ensure they meet specific criteria.
   * @param coordinates - An array of arrays representing coordinates.
   * @throws {NotEnoughCoordinatesError} - If the array contains fewer than 2 coordinate sets.
   * @throws {TooManyCoordinatesError} - If the array contains more than 1,000,000 coordinate sets.
   */
  validateCoordinates(coordinates: number[][]): void {
    // Check if there are at least 2 coordinates.
    if (coordinates.length < 2) {
      throw new NotEnoughCoordinatesError();
    }

    // Check if the array contains an excessive number of coordinates.
    if (coordinates.length > 1000000) {
      throw new TooManyCoordinatesError();
    }

    const innerLength = coordinates[0].length;
    const allSameLength = coordinates.every(
      (inner) => inner.length === innerLength,
    );
    if (!allSameLength) {
      throw new MixedCoordinatesError();
    }
  }
}
