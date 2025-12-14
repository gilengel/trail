/**
 * @file Public API for trips.
 */
import {
  Body,
  Controller,
  Get,
  Delete,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import * as DTO from '../dto'

@Controller('trips')
export class TripsController {
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

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<DTO.Trip> {
    const trip = await this.tripsService.trip(id);

    if (!trip) {
      throw new HttpException(
        `Trip with id ${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return Promise.resolve(trip);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() UpdateTrip: DTO.UpdateTrip,
  ): Promise<DTO.Trip> {
    try {
      return await this.tripsService.updateTrip(id, UpdateTrip);
    } catch (e) {
      this.logger.error(e);

      throw new HttpException(
        'The requested trip you want to update does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DTO.Trip> {
    return this.tripsService.deleteTrip(id);
  }
}
