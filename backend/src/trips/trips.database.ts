/**
 * @file Contains the database logic for the trip api.
 */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as DTO from './dto'
import { PrismaService } from '../prisma.service';

// General note: Prisma currently does not support PostGIS, therefore we must use raw queries 🙁
@Injectable()
export class TripsDatabase {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new trip in the database.
   * @param tripDto - The data for creating the new route.
   * @returns A Promise that resolves to a RouteDto object.
   */
  async create(tripDto: DTO.CreateTrip): Promise<DTO.Trip> {
    const trip = await this.prisma.trip.create({
      data: tripDto,
    });

    return Promise.resolve(trip);
  }

  /**
   * Retrieve a trip by its ID.
   * @param id - The ID of the trip to retrieve.
   * @returns A Promise that resolves to a TripDto object or null if not found.
   */
  async getOneById(id: number): Promise<DTO.Trip | null> {
    const trip = await this.prisma.trip.findUnique({
      where: {
        id: Number(id),
      },
    });

    return trip;
  }

  /**
   * Get all stored trips from the database.
   * @returns A Promise that resolves to an array of RouteDto objects.
   */
  async getAll() {
    const trips = await this.prisma.trip.findMany();

    return Promise.resolve(trips as DTO.Trip[]);
  }

  /**
   * Update an existing trip in the database.
   * @param id - The ID of the trip to update.
   * @param data - The data for updating the trip.
   * @returns A Promise that resolves to the updated trip.
   */
  async update(id: number, data: DTO.UpdateTrip): Promise<DTO.Trip> {
    const updatedTrip = await this.prisma.trip.update({
      where: {
        id: Number(id),
      },
      data: {
        layout: data.layout ?? Prisma.JsonNull
      },
    });

    return Promise.resolve(updatedTrip);
  }

  /**
   * Delete a route from the database.
   * @param id - The ID of the route to delete.
   * @returns A Promise that resolves to a RouteDto object representing the deleted route.
   */
  async delete(id: number): Promise<DTO.Trip> {
    return await this.prisma.trip.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
