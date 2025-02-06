/**
 * @file Provides functionality to create, read, update and delete routes.
 */
import { Injectable } from '@nestjs/common';
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
}
