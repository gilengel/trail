/**
 * @file Public API for route segments.
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RoutesSegmentsService } from './routes.segments.service';
import { NoAttributesProvidedError } from '../routes/routes.service';
import { CreateRouteSegmentDto, RouteSegmentDto, UpdateRouteSegmentDto } from '../dto';

@Controller('routes/segment')
export class RoutesSegmentsController {
  constructor(private readonly routesSegmentsService: RoutesSegmentsService) {}

  @Post()
  async create(
    @Body() createRouteSegmentDto: CreateRouteSegmentDto,
  ): Promise<RouteSegmentDto> {
    try {
      const segment = await this.routesSegmentsService.create(
        createRouteSegmentDto,
      );

      return Promise.resolve(segment);
    } catch (e) {
      // < 2 coordinates, > 1.000.000 coordinates or mixed dimension coordinates
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<RouteSegmentDto> {
    return this.routesSegmentsService.findOne(id);
  }

  @Get('route/:id')
  findAllForRoute(@Param('id') id: number): Promise<RouteSegmentDto[]> {
    return this.routesSegmentsService.findAllForRoute(id);
  }

  @Get('length/:id')
  async length(@Param() params: { id: number }): Promise<{ length: number }> {
    const length = await this.routesSegmentsService.length(params.id);
    return Promise.resolve({ length });
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateRouteSegmentDto: UpdateRouteSegmentDto,
  ): Promise<RouteSegmentDto> {
    try {
      const updatedRow = await this.routesSegmentsService.update(
        id,
        updateRouteSegmentDto,
      );
      return updatedRow;
    } catch (e) {
      // special case, inform that the error is on client side
      if (e instanceof NoAttributesProvidedError) {
        throw new HttpException(
          'No fields to be updated were provided.',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'The requested route segment you want to update does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
