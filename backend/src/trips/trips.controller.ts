/**
 * @file Public API for trips.
 */
import { Body, Controller, Post } from '@nestjs/common';
import { CreateTripDto } from './dto/create.trip.dto';
import { TripsService } from './trips.service';
import { TripDto } from './dto/trip.dto';

@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post()
  async create(@Body() createTripDto: CreateTripDto): Promise<TripDto> {
    const route = await this.tripsService.createTrip(createTripDto);

    return Promise.resolve(route);
  }
}
