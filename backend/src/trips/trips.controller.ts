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
import { CreateTripDto } from 'shared';
import { TripsService } from './trips.service';
import { TripDto } from 'shared';
import { Prisma } from '@prisma/client';

@Controller('trips')
export class TripsController {
  private readonly logger = new Logger(TripsController.name);

  constructor(private tripsService: TripsService) {}

  @Post()
  async create(@Body() createTripDto: CreateTripDto): Promise<TripDto> {
    const trip = await this.tripsService.createTrip(createTripDto);

    return Promise.resolve(trip);
  }

  @Get()
  async findAll(): Promise<TripDto[]> {
    return await this.tripsService.trips();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TripDto> {
    const trip = await this.tripsService.trip(id);

    return Promise.resolve(trip);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTripDto: Prisma.TripUpdateInput,
  ): Promise<TripDto> {
    try {
      return await this.tripsService.updateTrip(id, updateTripDto);
    } catch (e) {
      this.logger.error(e);

      throw new HttpException(
        'The requested trip you want to update does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<TripDto> {
    return this.tripsService.deleteTrip(id);
  }
}
