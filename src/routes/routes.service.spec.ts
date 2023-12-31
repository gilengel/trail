import { Test, TestingModule } from '@nestjs/testing';
import * as testData from '../../test/data';
import * as fs from 'fs';
import {
  MixDimensionalityError,
  NotEnoughCoordinatesError,
  RoutesService,
  TooManyCoordinatesError,
} from './routes.service';
import { PrismaService } from '../prisma.service';

import * as conversion from '../conversion';

jest.mock('@prisma/client', () => {
  const a = jest.fn().mockResolvedValue([]);
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        $queryRaw: a,
      };
    }),
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

  describe('routes', () => {
    it('should convert from db dtos to route dtos', () => {
      const result = conversion.dbRoutes2dto(testData.dbRoutes);
      expect(result).toStrictEqual(testData.routes);
    });
  });
});

describe('RoutesService', () => {
  let service: RoutesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoutesService, PrismaService],
    }).compile();

    service = module.get<RoutesService>(RoutesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return a route stored in the database by id', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValue([testData.dbRoute]);

    const result = await service.route(0);

    expect(result).toStrictEqual(testData.route);
  });

  it('should return all routes stored in the database', async () => {
    const result = await service.routes();

    expect(result).toStrictEqual([testData.route]);
  });

  it('should store a route in the database and return it', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValue([testData.dbRoute]);

    const result = await service.createRoute(testData.route);

    expect(result).toStrictEqual(testData.route);
  });

  it('should store a route from a gpx file in the database and return it', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValue([
      {
        id: 0,
        name: testData.name,
        coordinates:
          'LINESTRING(' +
          '47.3875638283789157867431640625 10.93997175805270671844482421875,' +
          '47.38756508566439151763916015625 10.9399969875812530517578125,' +
          '47.38756240345537662506103515625 10.94002456404268741607666015625)',
      },
    ]);

    const data = fs.readFileSync('src/routes/test/short.gpx');

    const result = await service.createRouteFromGPX(data);

    expect(result).toStrictEqual({
      id: 0,
      name: testData.name,
      coordinates: [
        [47.3875638283789157867431640625, 10.93997175805270671844482421875],
        [47.38756508566439151763916015625, 10.9399969875812530517578125],
        [47.38756240345537662506103515625, 10.94002456404268741607666015625],
      ],
    });
  });

  it('should fail to create a new route if the db query does not return the newly created entity', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValue([]);

    const result = service.createRoute(testData.routeWithEmptyName);

    expect(result).rejects.toThrow();
  });

  it('should update only the name of a route', async () => {
    jest
      .spyOn(prisma, '$queryRaw')
      .mockResolvedValue([testData.dbRouteWithUpdatedName]);

    const result = await service.updateRoute(0, {
      name: 'updated_test_route',
    });

    expect(result).toStrictEqual({
      id: 0,
      name: 'updated_test_route',
      coordinates: [
        [30, 10],
        [10, 30],
        [40, 40],
      ],
    });
  });

  it('should update only the coordinates of a route', async () => {
    jest
      .spyOn(prisma, '$queryRaw')
      .mockResolvedValue([testData.dbRouteWithUpdatedCoordinates]);

    const result = await service.updateRoute(0, {
      coordinates: [
        [30, 10],
        [10, 30],
      ],
    });

    expect(result).toStrictEqual({
      id: 0,
      name: 'test_route',
      coordinates: [
        [30, 10],
        [10, 30],
      ],
    });
  });

  it('should update name and coordinates of a route', async () => {
    jest
      .spyOn(prisma, '$queryRaw')
      .mockResolvedValue([testData.dbRouteWithUpdatedNameAndCoordinates]);

    const result = await service.updateRoute(0, {
      name: 'updated_test_route',
      coordinates: testData.updatedCoordinates,
    });

    expect(result).toStrictEqual({
      id: 0,
      name: 'updated_test_route',
      coordinates: [
        [30, 10],
        [10, 30],
      ],
    });
  });

  it('should reject trying to change a route with less then two coordinates', async () => {
    await expect(service.updateRoute(0, { coordinates: [] })).rejects.toThrow(
      new NotEnoughCoordinatesError(),
    );
  });

  it('should reject trying to change a route with more then 1.000.000 coordinates', async () => {
    const coordinates = Array.from({ length: 1000001 }, (_, i) => [i, i]);
    await expect(service.updateRoute(0, { coordinates })).rejects.toThrow(
      new TooManyCoordinatesError(),
    );
  });

  it('should reject trying to change a route with mixed dimensions', async () => {
    await expect(
      service.updateRoute(0, {
        coordinates: [
          [0, 0],
          [10, 10, 10],
        ],
      }),
    ).rejects.toThrow(new MixDimensionalityError());
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
