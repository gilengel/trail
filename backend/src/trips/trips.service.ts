/**
 * @file Provides functionality to create, read, update and delete routes.
 */
import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTripDto } from './dto/create.trip.dto';
import { TripDto } from './dto/trip.dto';
import { Prisma } from '@prisma/client'


// General note: Prisma currently does not support PostGIS, therefore we must use raw queries 🙁
@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

   
  /**
   * Create a new trip in the database.
   * @param tripDto - The data for creating the new route.
   * @returns A Promise that resolves to a RouteDto object.
   */
  async createTrip(tripDto: CreateTripDto): Promise<TripDto> {
    const trip = await this.prisma.trip.create({
      data: tripDto,
    })

    return Promise.resolve(trip);
  }

  /**
   * Retrieve a trip by its ID.
   * @param id - The ID of the trip to retrieve.
   * @returns A Promise that resolves to a TripDto object or null if not found.
   */
  async trip(id: number): Promise<TripDto | null> {
    const trip = await this.prisma.trip.findUnique({
      where: {
        id: Number(id)
      },
    })

    if(!trip){
      throw new HttpException(
        `Trip with id ${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return trip;
  }

  /**
   * Get all stored trips from the database.
   * @returns A Promise that resolves to an array of RouteDto objects.
   */
  async trips(): Promise<TripDto[]> {
    const trips = await this.prisma.trip.findMany()

    return Promise.resolve(trips as TripDto[]);
  }

  /**
   * Update an existing trip in the database.
   * @param id - The ID of the trip to update.
   * @param data - The data for updating the trip.
   * @returns A Promise that resolves to the updated trip.
   */
  async updateTrip(
    id: number,
    data: Prisma.TripUpdateInput,
  ): Promise<TripDto> {
    const updatedTrip = await this.prisma.trip.update({
      where: {
        id: Number(id)
      },
      data
    });

    return Promise.resolve(updatedTrip);
  }

  /**
   * Delete a route from the database.
   * @param id - The ID of the route to delete.
   * @returns A Promise that resolves to a RouteDto object representing the deleted route.
   */
  async deleteTrip(id: number): Promise<TripDto> {
    return await this.prisma.trip.delete({
      where: {
        id: Number(id)
      },
    })
  }
}
