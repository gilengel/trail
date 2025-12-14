/**
 * @file Public API for routes.
 */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnprocessableEntityException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { RoutesService } from './routes.service';

import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { extractCoordinatesFromGPX, GPXRoute } from '../../dto/convert';
import { Route, RouteWithMultipleFiles, RouteWithoutSegments } from './dto/route.dto';
import * as DTO from '../../dto'
import { TripsService } from '../../trips/trips.service';
import { MixedCoordinatesError, NotEnoughCoordinatesError, TooManyCoordinatesError } from '../segments/route.segments.service';

@Controller('routes')
export class RoutesController {
  private readonly logger = new Logger(RoutesController.name);

  constructor(private routeService: RoutesService, private tripService: TripsService) { }

  @Get()
  async findAll(): Promise<RouteWithoutSegments[]> {
    try {
      return await this.routeService.routes();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('trip/:id')
  async findAllOfTrip(
    @Param('id') id: number,
  ): Promise<RouteWithoutSegments[]> {
    return await this.routeService.routesOfTrip(Number(id));
  }

  @Get(':id')
  async findOne(@Param() params: { id: number }): Promise<Route> {
    const route = await this.routeService.route(params.id);

    if (route === null) {
      throw new NotFoundException();
    }

    return route;
  }


  @Post()
  async create(@Body() route: DTO.CreateRoutePublic): Promise<Route> {
    const trip = await this.tripService.trip(route.tripId);

    if (trip === null) {
      throw new UnprocessableEntityException();
    }

    return this._create(route, trip);
  }


  @Post('gpx')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  async createFromGPX(
    @Body() body: RouteWithMultipleFiles,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Route> {
    if(body.tripId === undefined) {
      throw new BadRequestException("tripId is missing");
    }

    const trip = await this.tripService.trip(body.tripId);
    if (trip === null) {
      throw new UnprocessableEntityException();
    }

    const mergedRoute: GPXRoute = {
      name: body.name,
      segments: [],
    };
    for (const file of files) {
      const gpxRoute: GPXRoute = extractCoordinatesFromGPX(file.buffer);
      mergedRoute.segments.push(...gpxRoute.segments);
    }

    const routeDto: DTO.CreateRoutePublic = {
      tripId: body.tripId,
      name: body.name,
      segments: mergedRoute.segments.map(gpxSegment => {
        return {
          routeId: 0, //
          name: gpxSegment.name,
          coordinates: gpxSegment.coordinates
        }
      })
    }

    return this._create(routeDto, trip);
  }


  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() route: DTO.UpdateRoute,
  ): Promise<RouteWithoutSegments> {
    if (route.name === undefined && route.description === undefined) {
      throw new HttpException(
        'No fields to be updated were provided.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.routeService.updateRoute(id, route);

    if (result == null) {
      throw new NotFoundException('The requested route you want to update does not exist.');
    }

    return result;
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<boolean> {
    return this.routeService.deleteRoute(id);
  }

    private async _create(route: DTO.CreateRoutePublic, trip: DTO.Trip): Promise<Route> {
    try {
      const newRoute = await this.routeService.createRoute(route, trip);

      return Promise.resolve(newRoute);
    }
    catch (e) {
      if (e instanceof NotEnoughCoordinatesError) {
        throw new BadRequestException(e.message);
      } else if (e instanceof TooManyCoordinatesError) {
        throw new BadRequestException(e.message);
      } else if (e instanceof MixedCoordinatesError) {
        throw new BadRequestException(e.message);
      }
    }
  }
}
