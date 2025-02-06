/**
 * @file Public API for trips.
 */
import { Body, Controller, Post, Param, Get } from '@nestjs/common';
import { CreateTripDto } from './dto/create.trip.dto';
import { TripsService } from './trips.service';
import { TripDto } from './dto/trip.dto';
import { RouteDto } from '../routes/dto/route.dto';

@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post()
  async create(@Body() createTripDto: CreateTripDto): Promise<TripDto> {
    const route = await this.tripsService.createTrip(createTripDto);

    return Promise.resolve(route);
  }

  @Get(':id')
  async findOne(@Param() params: { id: number }): Promise<TripDto> {
    const trip = await this.tripsService.trip(params.id);

    return Promise.resolve(trip);
  }
}
