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
import { UpdateTripDto } from './dto/update.trip.dto';


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
      data: {
        layout: tripDto.layout
      },
    })

    return Promise.resolve({
      id: trip.id,
      layout: tripDto.layout,
    });
  }

  /**
   * Retrieve a trip by its ID.
   * @param id - The ID of the trip to retrieve.
   * @returns A Promise that resolves to a TripDto object or null if not found.
   */
  async trip(id: number): Promise<TripDto | null> {
    try {
      const trip = await this.prisma.trip.findUnique({
        where: {
          id
        },
      })

      return Promise.resolve(trip as TripDto);
    }catch{
      throw new HttpException(
        `Trip with id ${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Update an existing trip in the database.
   * @param id - The ID of the trip to update.
   * @param data - The data for updating the trip.
   * @returns A Promise that resolves to the updated trip.
   */
  async updateTrip(
    id: number,
    data: UpdateTripDto,
  ): Promise<TripDto> {
    const updatedTrip = await this.prisma.trip.update({
      where: {
        id: Number(id)
      },
      data: {
        layout: data.layout
      }
    });

    return Promise.resolve({ id: updatedTrip.id, layout: updatedTrip.layout as object });
  }
}
