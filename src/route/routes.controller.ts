import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRouteDto } from './dto/create.route.dto';
import { NoAttributesProvidedError, RoutesService } from './routes.service';
import { RouteDto } from './dto/route.dto';
import { UpdateRouteDto } from './dto/update.route.dto';

@Controller('routes')
export class RoutesController {
  constructor(private routeService: RoutesService) {}

  @Get()
  async findAll(): Promise<RouteDto[]> {
    const routes = await this.routeService.routes();

    return routes;
  }

  @Get(':id')
  async findOne(@Param() params: { id: number }): Promise<RouteDto> {
    return this.routeService.route(params.id);
  }

  @Post()
  async create(@Body() createRouteDto: CreateRouteDto): Promise<RouteDto> {
    return this.routeService.createRoute(createRouteDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateRouteDto: UpdateRouteDto,
  ): Promise<RouteDto> {
    try {
      const updatedRow = await this.routeService.updateRoute(
        id,
        updateRouteDto,
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
