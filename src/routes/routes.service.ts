import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRouteDto } from './dto/create.route.dto';
import { DbRouteDto, RouteDto } from './dto/route.dto';
import { UpdateRouteDto } from './dto/update.route.dto';

import * as conversion from '../conversion';
import { XMLParser } from 'fast-xml-parser';

export class NoAttributesProvidedError extends Error {}

// If the client tries to create/update routes with less then two coordinates
export class NotEnoughCoordinatesError extends Error {
  constructor() {
    super(
      'Minimum number of coordinates for a route is two which was not met.',
    );
  }
}

// If the client tries to create/update routes with more than one million points
export class TooManyCoordinatesError extends Error {
  constructor() {
    super(
      `Maximum number of coordinates for a route is 1'000'000 which was exceed.`,
    );
  }
}

export class MixDimensionalityError extends Error {
  constructor() {
    super('Not all provided coordinates have the same dimensionality.');
  }
}

// General note: Prisma currently does not support PostGIS, therefore we must use raw queries 🙁
@Injectable()
export class RoutesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Validates an array of coordinates to ensure they meet specific criteria.
   *
   * @param coordinates - An array of arrays representing coordinates.
   *
   * @throws {NotEnoughCoordinatesError} - If the array contains fewer than 2 coordinate sets.
   * @throws {TooManyCoordinatesError} - If the array contains more than 1,000,000 coordinate sets.
   * @throws {MixDimensionalityError} - If the array contains a mix of 2D and non-2D (3D or more) coordinates.
   */
  validateCoordinates(coordinates: Array<Array<number>>): void {
    // Check if there are at least 2 coordinates.
    if (coordinates.length < 2) {
      throw new NotEnoughCoordinatesError();
    }

    // Check if the array contains an excessive number of coordinates.
    if (coordinates.length > 1000000) {
      throw new TooManyCoordinatesError();
    }

    // Check if there is a mix of 2D and non-2D coordinates.
    const len2dCoordinates = coordinates.filter((e) => e.length === 2).length;
    if (len2dCoordinates !== 0 && len2dCoordinates !== coordinates.length) {
      throw new MixDimensionalityError();
    }
  }

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
    this.validateCoordinates(data.coordinates);

    const routeString = conversion.numberArray2wkt(data.coordinates);

    const routes: DbRouteDto = await this.prisma.$queryRaw`
        INSERT INTO "Route" (name, coordinates) 
        VALUES (${data.name}::text, ST_GeomFromText(${routeString}::text, 4326)) 
        RETURNING id, name, ST_AsText(coordinates) as coordinates`;

    const route = routes[0];
    return Promise.resolve(conversion.dbRoute2dto(route));
  }

  /**
   * Creates a new route in the database based on a gpx file.
   *
   * @param data - The content of the gpx file.
   * @returns A Promise that resolves to a RouteDto object.
   */
  async createRouteFromGPX(data: string | Buffer): Promise<RouteDto> {
    const parser = new XMLParser({
      ignoreAttributes: false,
    });
    const obj = parser.parse(data);

    const coordinates = obj.gpx.trk.trkseg.trkpt.map(
      (point): Array<number> => [point['@_lat'], point['@_lon']],
    );
    return this.createRoute({ name: 'new_test_route', coordinates });
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
      this.validateCoordinates(data.coordinates);

      result = await this.prisma.$queryRaw`
      UPDATE "Route" 
      SET coordinates = ${conversion.numberArray2wkt(data.coordinates)}
      WHERE id = ${id}::int
      RETURNING id, name, ST_AsText(coordinates) AS coordinates;`;
    }

    if (data.name && data.coordinates) {
      this.validateCoordinates(data.coordinates);

      result = await this.prisma.$queryRaw`
      UPDATE "Route" 
      SET name = ${data.name}, coordinates = ${conversion.numberArray2wkt(
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
