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
    const tripIds = await this.prisma.$queryRaw<[{ id: number }]>`
    INSERT INTO "Trip" (layout) 
    VALUES (${tripDto.layout}::json)
    RETURNING id`;
    const tripId = tripIds[0].id;

    return Promise.resolve({
      id: tripId,
      layout: tripDto.layout,
    });
  }

  /**
   * Retrieve a trip by its ID.
   * @param id - The ID of the trip to retrieve.
   * @returns A Promise that resolves to a TripDto object or null if not found.
   */
  async trip(id: number): Promise<TripDto | null> {
    const trips = await this.prisma.$queryRaw<
      TripDto[]
    >`SELECT * FROM "Trip" WHERE id = ${id}::int`;

    if (!trips || trips.length == 0) {
      throw new HttpException(
        `Route with id ${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return Promise.resolve(trips[0]);
  }
}
