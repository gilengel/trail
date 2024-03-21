/**
 * @file Route segments unit tests.
 */
import { Test, TestingModule } from '@nestjs/testing';
import {
  MixDimensionalityError,
  NotEnoughCoordinatesError,
  RoutesSegmentsService,
  TooManyCoordinatesError,
} from './routes.segments.service';

import * as testData from '../../test/data';

import { HttpException, HttpStatus } from '@nestjs/common';
import { RouteSegmentDto } from './dto/route.segment.dto';
import { PrismaService } from '../prisma.service';

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

describe('RoutesSegmentsService', () => {
  let service: RoutesSegmentsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoutesSegmentsService, PrismaService],
    }).compile();

    service = module.get<RoutesSegmentsService>(RoutesSegmentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return a route segment stored in the database by id', async () => {
    jest
      .spyOn(prisma, '$queryRaw')
      .mockResolvedValueOnce([testData.dbRouteSegment]);

    const result: RouteSegmentDto = await service.findOne(0);
    const expected: RouteSegmentDto = testData.routeSegment;

    expect(result).toStrictEqual(expected);
  });

  it('should return the length of a route segment stored in the database by id', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValueOnce([100]);

    const result: number = await service.length(0);
    const expected: number = 100;

    expect(result).toBe(expected);
  });

  it('should throw 404 if length of a route segment was requested that is not stored in the database', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValueOnce([]);

    const result = service.findOne(0);
    await expect(result).rejects.toThrow(
      new HttpException(
        `Route segment with id 0 does not exist.`,
        HttpStatus.NOT_FOUND,
      ),
    );
  });
  it('should throw 404 if a route segment was requested that does not exist', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValueOnce([]);

    const result = service.findOne(0);
    await expect(result).rejects.toThrow(
      new HttpException(
        `Route segment with id 0 does not exist.`,
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should store a route segment in the database and return it', async () => {
    jest
      .spyOn(prisma, '$queryRaw')
      .mockResolvedValue([{ id: testData.segmentId }]);

    const result: RouteSegmentDto = await service.create(
      testData.newRouteSegment,
    );
    const expected: RouteSegmentDto = testData.routeSegment;

    expect(result).toStrictEqual(expected);
  });

  it('should update only the name of a route segment', async () => {
    jest
      .spyOn(prisma, '$queryRaw')
      .mockResolvedValue([testData.dbRouteSegmentWithUpdatedName]);

    const result = await service.update(testData.routeId, {
      name: testData.updatedSegmentName,
    });

    expect(result).toStrictEqual({
      id: testData.segmentId,
      name: testData.updatedSegmentName,
      coordinates: testData.coordinates,
    });
  });

  it('should update only the coordinates of a route segment', async () => {
    jest
      .spyOn(prisma, '$queryRaw')
      .mockResolvedValue([testData.dbRouteSegmentWithUpdatedCoordinates]);

    const result = await service.update(testData.routeId, {
      coordinates: [
        [30, 10],
        [10, 30],
      ],
    });

    expect(result).toStrictEqual({
      id: testData.segmentId,
      name: testData.segmentName,
      coordinates: [
        [30, 10],
        [10, 30],
      ],
    });
  });

  it('should update name and coordinates of a route segment', async () => {
    jest
      .spyOn(prisma, '$queryRaw')
      .mockResolvedValueOnce([testData.dbRouteSegmentWithUpdatedCoordinates]);

    const result = await service.update(0, {
      name: 'updated_test_route',
      coordinates: testData.updatedCoordinates,
    });

    expect(result).toStrictEqual({
      id: testData.segmentId,
      name: testData.segmentName,
      coordinates: testData.updatedCoordinates,
    });
  });

  it('should reject trying to change a route segment with less then two coordinates', async () => {
    await expect(service.update(0, { coordinates: [] })).rejects.toThrow(
      new NotEnoughCoordinatesError(),
    );
  });

  it('should reject trying to change a route segment with more then 1.000.000 coordinates', async () => {
    const coordinates = Array.from({ length: 1000001 }, (_, i) => [i, i]);
    await expect(service.update(0, { coordinates })).rejects.toThrow(
      new TooManyCoordinatesError(),
    );
  });

  it('should reject trying to change a route segment with mixed dimensions', async () => {
    await expect(
      service.update(testData.routeId, {
        coordinates: [
          [0, 0],
          [10, 10, 10],
        ],
      }),
    ).rejects.toThrow(new MixDimensionalityError());
  });

  it('should reject trying to change a route segment without providing any values to change', async () => {
    await expect(service.update(0, {})).rejects.toThrow();
  });
});
