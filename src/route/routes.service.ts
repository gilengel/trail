import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRouteDto } from './dto/create.route.dto';
import { DbRouteDto, RouteDto } from './dto/route.dto';
import { UpdateRouteDto } from './dto/update.route.dto';

import * as conversion from '../conversion';

export class NoAttributesProvidedError extends Error {}

// General note: Prisma currently does not support PostGIS, therefore we must use raw queries 🙁
@Injectable()
export class RoutesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieve a route by its ID.
   *
   * @param id - The ID of the route to retrieve.
   * @returns A Promise that resolves to a RouteDto object or null if not found.
   */
  async route(id: number): Promise<RouteDto | null> {
    const routes = await this.prisma.$queryRaw<
      DbRouteDto[]
    >`SELECT id, name, st_astext(coordinates) AS coordinates FROM "Route" WHERE id = ${id}::int`;

    return Promise.resolve(conversion.dbRoute2dto(routes[0]));
  }

  /**
   * Retrieve a list of routes based on provided parameters.
   *
   * @param params - An object containing query parameters (skip, take, cursor, where, orderBy).
   * @returns A Promise that resolves to an array of RouteDto objects.
   */
  async routes(): Promise<RouteDto[]> {
    const routes = await this.prisma.$queryRaw<
      DbRouteDto[]
    >`SELECT id, name, st_astext(coordinates) AS coordinates FROM "Route"`;

    return Promise.resolve(conversion.dbRoutes2dto(routes));
  }

  /**
   * Create a new route in the database.
   *
   * @param data - The data for creating the new route.
   * @returns A Promise that resolves to a RouteDto object.
   */
  async createRoute(data: CreateRouteDto): Promise<RouteDto> {
    const routeString = conversion.numberArray2Wkt(data.coordinates);

    const routes: DbRouteDto = await this.prisma.$queryRaw`
        INSERT INTO "Route" (name, coordinates) 
        VALUES (${data.name}::text, ST_GeomFromText(${routeString}::text, 4326)) 
        RETURNING id, name, ST_AsText(coordinates) as coordinates`;

    const route = routes[0];
    return Promise.resolve(conversion.dbRoute2dto(route));
  }

  /**
   * Update an existing route in the database.
   *
   * @param id - The ID of the route to update.
   * @param data - The data for updating the route.
   * @returns A Promise that resolves to the number of updated routes (0 if no updates were made).
   */
  async updateRoute(id: number, data: UpdateRouteDto): Promise<RouteDto> {
    if (!data.name && !data.coordinates) {
      return Promise.reject(new NoAttributesProvidedError());
    }

    let result;
    if (data.name && !data.coordinates) {
      result = await this.prisma.$queryRaw`
      UPDATE "Route" 
      SET name = ${data.name}
      WHERE id = ${id}::int
      RETURNING id, name, ST_AsText(coordinates) AS coordinates;`;
    }

    if (!data.name && data.coordinates) {
      result = await this.prisma.$queryRaw`
      UPDATE "Route" 
      SET coordinates = ${conversion.numberArray2Wkt(data.coordinates)}
      WHERE id = ${id}::int
      RETURNING id, name, ST_AsText(coordinates) AS coordinates;`;
    }

    if (data.name && data.coordinates) {
      result = await this.prisma.$queryRaw`
      UPDATE "Route" 
      SET name = ${data.name}, coordinates = ${conversion.numberArray2Wkt(
        data.coordinates,
      )}
      WHERE id = ${id}::int
      RETURNING id, name, ST_AsText(coordinates) AS coordinates;`;
    }

    return Promise.resolve(conversion.dbRoute2dto(result[0]));
  }

  /**
   * Delete a route from the database.
   *
   * @param id - The ID of the route to delete.
   * @returns A Promise that resolves to a RouteDto object representing the deleted route.
   */
  async deleteRoute(id: number): Promise<number> {
    const deletedRows: number = await this.prisma.$queryRaw`
        DELETE FROM "Route" 
        WHERE id = ${id}::int;`;

    return Promise.resolve(deletedRows);
  }
}
