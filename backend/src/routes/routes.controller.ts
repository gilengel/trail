/**
 * @file Public API for routes.
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateRouteDto } from './dto/create.route.dto';
import { NoAttributesProvidedError, RoutesService } from './routes.service';
import {
  RouteDto,
  RouteWithMultipleFilesDTO,
  RouteWithoutSegmentsDto,
} from './dto/route.dto';
import { UpdateRouteDto } from './dto/update.route.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GPXRoute, extractCoordinatesFromGPX } from './routes.parser';
import { ApiConsumes } from '@nestjs/swagger';

@Controller('routes')
export class RoutesController {
  private readonly logger = new Logger(RoutesController.name);

  constructor(private routeService: RoutesService) {}

  @Get()
  async findAll(): Promise<RouteWithoutSegmentsDto[]> {
    try {
      return await this.routeService.routes();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param() params: { id: number }): Promise<RouteDto> {
    return this.routeService.route(params.id);
  }

  @Post()
  async create(@Body() createRouteDto: CreateRouteDto): Promise<RouteDto> {
    try {
      const route = await this.routeService.createRoute(createRouteDto);

      return Promise.resolve(route);
    } catch (e) {
      this.logger.error(e);

      // < 2 coordinates, > 1.000.000 coordinates or mixed dimension coordinates
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('gpx')
  //@UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  async createFromGPX(
    @Body() body: RouteWithMultipleFilesDTO,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<RouteDto> {
    try {
      const mergedRoute: GPXRoute = {
        name: body.name,
        segments: [],
      };
      for (const file of files) {
        const gpxRoute: GPXRoute = extractCoordinatesFromGPX(file.buffer);
        mergedRoute.segments.push(...gpxRoute.segments);
      }

      const routeDto = await this.routeService.createRouteFromGPX(mergedRoute);

      return Promise.resolve(routeDto);
    } catch (e) {
      this.logger.error(e);

      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateRouteDto: UpdateRouteDto,
  ): Promise<RouteWithoutSegmentsDto> {
    try {
      const updatedRow = await this.routeService.updateRoute(
        id,
        updateRouteDto,
      );
      return updatedRow;
    } catch (e) {
      this.logger.error(e);

      // special case, inform that the error is on client side
      if (e instanceof NoAttributesProvidedError) {
        throw new HttpException(
          'No fields to be updated were provided.',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'The requested route you want to update does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<number> {
    return this.routeService.deleteRoute(id);
  }
}
