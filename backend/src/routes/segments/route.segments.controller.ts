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
  Inject,
  forwardRef,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  RouteSegmentsService,
} from './route.segments.service';
import { NoAttributesProvidedError } from '../routes/routes.database';
import * as DTO from '../../dto';
import { RoutesService } from '../routes/routes.service';
import { ThrowHttpExceptionFromDomainError } from '../routes/routes.controller';

@Controller('routes/segment')
export class RoutesSegmentsController {
  constructor(
    private readonly routeSegmentsService: RouteSegmentsService,
    @Inject(forwardRef(() => RoutesService))
    private readonly routesService: RoutesService,
  ) {}

  @Post()
  async create(
    @Body() createRouteSegment: DTO.CreateRouteSegmentPublic,
  ): Promise<DTO.RouteSegment> {
    const route = await this.routesService.route(createRouteSegment.routeId);
    if (route === null) {
      throw new UnprocessableEntityException();
    }

    try {
      const segment = await this.routeSegmentsService.create(
        createRouteSegment,
        route,
      );

      return Promise.resolve(segment);
    } catch (e) {
      ThrowHttpExceptionFromDomainError(e);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<DTO.RouteSegment> {
    const segment = await this.routeSegmentsService.findOne(id);

    if (segment === null) {
      throw new NotFoundException();
    }

    return segment;
  }

  @Get('route/:id')
  async findAllForRoute(@Param('id') id: number): Promise<DTO.RouteSegment[]> {
    const route = await this.routesService.route(id);
    return this.routeSegmentsService.findAllForRoute(route);
  }

  @Get('length/:id')
  async length(@Param() params: { id: number }): Promise<{ length: number }> {
    const length = await this.routeSegmentsService.length(params.id);
    return Promise.resolve({ length });
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateRouteSegmentDto: DTO.UpdateRouteSegment,
  ): Promise<DTO.RouteSegment> {
    try {
      const updatedRow = await this.routeSegmentsService.update(
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
