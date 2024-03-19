import { Test, TestingModule } from '@nestjs/testing';
import * as testData from '../../test/data';

import { RoutesService } from './routes.service';
import { PrismaService } from '../prisma.service';

import * as conversion from '../conversion';
import { RouteDto } from './dto/route.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GPXRoute } from './routes.parser';
import { RoutesSegmentsService } from '../routes.segments/routes.segments.service';

jest.mock('@prisma/client', () => {
  const a = jest.fn();
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        $queryRaw: a,
      };
    }),

    Prisma: {
      join: a,
      sql: a,
    },
  };
});

describe('conversion', () => {
  describe('lineString', () => {
    it('should convert a 2D linestring from wkt in a number array', () => {
      const result = conversion.wkt2numberArray(testData.wkt);

      expect(result).toStrictEqual(testData.coordinates);
    });

    it('should convert 2D number array into a wkt string', () => {
      const result = conversion.numberArray2wkt(testData.coordinates);

      expect(result).toStrictEqual(testData.wkt);
    });
  });

  describe('route', () => {
    it('should convert from a db dto to a route dto', () => {
      const result = conversion.dbRoute2dto(testData.dbRoute);
      expect(result).toStrictEqual(testData.route);
    });
  });
});

describe('RoutesService', () => {
  let service: RoutesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoutesService, RoutesSegmentsService, PrismaService],
    }).compile();

    service = module.get<RoutesService>(RoutesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return a route stored in the database by id', async () => {
    jest
      .spyOn(prisma, '$queryRaw')
      .mockResolvedValueOnce([testData.dbRoute])
      .mockResolvedValueOnce([testData.dbRouteSegment]);

    const result: RouteDto = await service.route(0);
    const expected: RouteDto = testData.route;

    expect(result).toStrictEqual(expected);
  });

  it('should throw 404 if a route was requested that does not exist', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValueOnce([]);

    const result = service.route(0);
    await expect(result).rejects.toThrow(
      new HttpException(
        `Route with id 0 does not exist.`,
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should return all routes stored in the database', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValueOnce([]);

    const result = await service.routes();

    expect(result).toStrictEqual([]);
  });

  it('should store a route in the database and return it', async () => {
    jest
      .spyOn(prisma, '$queryRaw')
      .mockResolvedValue([{ id: testData.segmentId }])
      .mockResolvedValueOnce([{ id: testData.routeId }]);

    const result: RouteDto = await service.createRoute(testData.route);
    const expected: RouteDto = testData.route;

    expect(result).toStrictEqual(expected);
  });

  it('should fail to create a new route if the db query does not return the newly created entity', async () => {
    jest.spyOn(prisma, '$queryRaw').mockRejectedValue(new Error()); // Mocks the database error thrown if trying to add an entry with empty name

    const result = service.createRoute(testData.routeWithEmptyName);

    expect(result).rejects.toThrow();
  });

  it('should create a route from gpx', async () => {
    const route: GPXRoute = {
      name: 'gpx_route',
      segments: [
        {
          name: 'segment 1',
          coordinates: [
            [0, 0],
            [1, 1],
          ],
        },
        {
          name: 'segment 2',
          coordinates: [
            [2, 2],
            [3, 3],
          ],
        },
      ],
    };

    jest
      .spyOn(prisma, '$queryRaw')
      .mockResolvedValue([{ id: 1 }, { id: 2 }]) // segment ids
      .mockResolvedValueOnce([{ id: 0 }]); // route id

    const result = await service.createRouteFromGPX(route);

    expect(result).toStrictEqual({
      id: 0,
      name: 'gpx_route',
      segments: [
        {
          id: 1,
          name: 'segment 1',
          coordinates: [
            [0, 0],
            [1, 1],
          ],
        },
        {
          id: 2,
          name: 'segment 2',
          coordinates: [
            [2, 2],
            [3, 3],
          ],
        },
      ],
    });
  });

  it('should update only the name of a route', async () => {
    jest
      .spyOn(prisma, '$queryRaw')
      .mockResolvedValueOnce([testData.dbRouteWithUpdatedName])
      .mockResolvedValueOnce([testData.dbRouteSegment]);

    const result = await service.updateRoute(0, {
      name: 'updated_test_route',
    });

    const expected = {
      id: testData.routeId,
      name: 'updated_test_route',
      segments: [testData.routeSegment],
    };

    expect(result).toStrictEqual(expected);
  });

  it('should reject trying to change a route without providing any values to change', async () => {
    await expect(service.updateRoute(0, {})).rejects.toThrow();
  });

  it('should reject changing a non existing route', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValue(0);

    const result = service.updateRoute(0, {
      name: 'updated_test_route',
    });

    expect(result).rejects.toThrow();
  });

  it('should delete a route from the db and return it', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValue(1);

    const result = await service.deleteRoute(0);

    expect(result).toBe(1);
  });
});
