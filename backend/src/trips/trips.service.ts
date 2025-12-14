/**
 * @file Provides functionality to create, read, update and delete routes.
 */
import { Injectable } from '@nestjs/common';
import * as DTO from '../dto';
import { TripsDatabase } from './trips.database';

@Injectable()
export class TripsService {
  constructor(private database: TripsDatabase) {}

  /**
   * Create a new trip in the database.
   * @param tripDto - The data for creating the new route.
   * @returns A Promise that resolves to a RouteDto object.
   */
  async createTrip(tripDto: DTO.CreateTrip): Promise<DTO.Trip> {
    return this.database.create(tripDto);
  }

  /**
   * Retrieve a trip by its ID.
   * @param id - The ID of the trip to retrieve.
   * @returns A Promise that resolves to a TripDto object or null if not found.
   */
  async trip(id: number): Promise<DTO.Trip | null> {
    return this.database.getOneById(id);
  }

  /**
   * Get all stored trips from the database.
   * @returns A Promise that resolves to an array of RouteDto objects.
   */
  async trips(): Promise<DTO.Trip[]> {
    return this.database.getAll();
  }

  /**
   * Update an existing trip in the database.
   * @param id - The ID of the trip to update.
   * @param data - The data for updating the trip.
   * @returns A Promise that resolves to the updated trip.
   */
  async updateTrip(id: number, data: DTO.UpdateTrip): Promise<DTO.Trip> {
    return this.database.update(id, data);
  }

  /**
   * Delete a route from the database.
   * @param id - The ID of the route to delete.
   * @returns A Promise that resolves to a RouteDto object representing the deleted route.
   */
  async deleteTrip(id: number): Promise<DTO.Trip> {
    return this.database.delete(id);
  }
}
