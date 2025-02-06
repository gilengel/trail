/**
 * @file Public API for trips.
 */
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTripDto } from './dto/create.trip.dto';
import { TripsService } from './trips.service';
import { TripDto } from './dto/trip.dto';
import { UpdateTripDto } from './dto/update.trip.dto';

@Controller('trips')
export class TripsController {
  private readonly logger = new Logger(TripsController.name);

  constructor(private tripsService: TripsService) {}

  @Post()
  async create(@Body() createTripDto: CreateTripDto): Promise<TripDto> {
    const trip = await this.tripsService.createTrip(createTripDto);

    return Promise.resolve(trip);
  }

  @Get(':id')
  async findOne(@Param() params: { id: number }): Promise<TripDto> {
    const trip = await this.tripsService.trip(params.id);

    return Promise.resolve(trip);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTripDto: UpdateTripDto,
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
}
