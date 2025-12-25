/**
 * @file Public API for trips.
 */
import {
  Body,
  Controller,
  Get,
  Delete,
  NotFoundException,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import * as DTO from '../dto';

export const TRIPS_URI = 'trips';

@Controller(TRIPS_URI)
export class TripsController {
  public static QUERY = {
    ID: 'id',
  };
  private readonly logger = new Logger(TripsController.name);

  constructor(private tripsService: TripsService) {}

  @Post()
  async create(@Body() createTripDto: DTO.CreateTrip): Promise<DTO.Trip> {
    const trip = await this.tripsService.createTrip(createTripDto);

    return Promise.resolve(trip);
  }

  @Get()
  async findAll(): Promise<DTO.Trip[]> {
    return await this.tripsService.trips();
  }

  @Get(`:${TripsController.QUERY.ID}`)
  async findOne(
    @Param(TripsController.QUERY.ID) id: number,
  ): Promise<DTO.Trip> {
    const trip = await this.tripsService.trip(id);

    if (!trip) {
      throw new NotFoundException(`Trip with id ${id} does not exist.`);
    }

    return Promise.resolve(trip);
  }

  @Patch(`:${TripsController.QUERY.ID}`)
  async update(
    @Param(TripsController.QUERY.ID) id: number,
    @Body() UpdateTrip: DTO.UpdateTrip,
  ): Promise<DTO.Trip> {
    const trip = await this.tripsService.updateTrip(id, UpdateTrip);
    if (trip === null) {
      throw new NotFoundException(
        'The requested trip you want to update does not exist.',
      );
    }

    return Promise.resolve(trip);
  }

  @Delete(`:${TripsController.QUERY.ID}`)
  async delete(@Param(TripsController.QUERY.ID) id: number): Promise<DTO.Trip> {
    return this.tripsService.deleteTrip(id);
  }
}
