/**
 * @file Route segments unit tests.
 */
import { Test, TestingModule } from '@nestjs/testing';
import {
  MixedCoordinatesError,
  NotEnoughCoordinatesError,
  RouteSegmentsService,
  TooManyCoordinatesError,
} from './route.segments.service';

import { RouteSegment } from './dto/route.segment.dto';

import * as routeSegmentTestData from './__data__';
import * as routeTestData from '../routes/__data__';
import * as DTO from '../../dto';
import { RoutesModule } from '../routes.module';
import { RouteSegmentsDatabase } from './route.segments.database';

describe('RouteSegmentsService', () => {
  let service: RouteSegmentsService;
  let database: RouteSegmentsDatabase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RoutesModule],
    }).compile();

    service = module.get<RouteSegmentsService>(RouteSegmentsService);
    database = module.get<RouteSegmentsDatabase>(RouteSegmentsDatabase);
  });

  it('should return a route segment stored in the database by id', async () => {
    jest
      .spyOn(database, 'getOneById')
      .mockResolvedValueOnce(routeSegmentTestData.Entities.segment);

    const result: RouteSegment = await service.findOne(0);
    const expected: RouteSegment = routeSegmentTestData.routeSegment;

    expect(result).toStrictEqual(expected);
  });

  it('should return the length of a route segment stored in the database by id', async () => {
    jest.spyOn(database, 'length').mockResolvedValueOnce(100);

    const result: number = await service.length(0);
    const expected: number = 100;

    expect(result).toBe(expected);
  });

  it('should return all route segments for a route', async () => {
    const expected = routeSegmentTestData.Entities.Segments;
    jest.spyOn(database, 'getAllForRoute').mockResolvedValueOnce(expected);

    const result: RouteSegment[] = await service.findAllForRoute(
      routeTestData.Entities.Route,
    );

    expect(result).toStrictEqual(expected);
  });

  it('should return null if a route segment was requested that does not exist', async () => {
    jest.spyOn(database, 'getOneById').mockResolvedValueOnce(null);

    const result = await service.findOne(0);
    expect(result).toBeNull();
  });

  it('should store a route segment in the database and return it', async () => {
    jest
      .spyOn(database, 'create')
      .mockResolvedValue(routeSegmentTestData.Entities.segment);

    const result: DTO.RouteSegment = await service.create(
      routeSegmentTestData.newRouteSegment,
      routeTestData.route,
    );
    const expected: DTO.RouteSegment = {
      id: routeSegmentTestData.routeSegment.id,
      description: routeSegmentTestData.segmentDescription,
      name: routeSegmentTestData.routeSegment.name,
      coordinates: routeSegmentTestData.routeSegment.coordinates,
    };

    expect(result).toStrictEqual(expected);
  });

  it('should update only the name of a route segment', async () => {
    jest
      .spyOn(database, 'update')
      .mockResolvedValue(routeSegmentTestData.Entities.segmentWithUpdatedName);

    const result = await service.update(routeTestData.routeId, {
      name: routeSegmentTestData.updatedSegmentName,
    });

    const expected: DTO.RouteSegment = {
      id: routeSegmentTestData.segmentId,
      name: routeSegmentTestData.updatedSegmentName,
      description: routeSegmentTestData.segmentDescription,
      coordinates: routeSegmentTestData.coordinates,
    };

    expect(result).toStrictEqual(expected);
  });

  it('should update only the coordinates of a route segment', async () => {
    jest
      .spyOn(database, 'update')
      .mockResolvedValue(
        routeSegmentTestData.Entities.segmentWithUpdatedCoordinates,
      );

    const result = await service.update(routeTestData.routeId, {
      coordinates: routeSegmentTestData.coordinates,
    });

    const expected: DTO.RouteSegment = {
      id: routeSegmentTestData.segmentId,
      name: routeSegmentTestData.segmentName,
      description: routeSegmentTestData.segmentDescription,
      coordinates: routeSegmentTestData.updatedCoordinates,
    };

    expect(result).toStrictEqual(expected);
  });

  it('should update only the description of a route segment', async () => {
    const expected = {
      id: routeSegmentTestData.segmentId,
      routeId: routeTestData.routeId,
      name: routeSegmentTestData.segmentName,
      description: routeSegmentTestData.updatedSegmentDescription,
      coordinates: routeSegmentTestData.coordinates,
    };

    jest.spyOn(database, 'update').mockResolvedValue(expected);

    const result = await service.update(routeTestData.routeId, {
      description: routeSegmentTestData.updatedSegmentDescription,
    });

    expect(result).toStrictEqual(expected);
  });

  it('should reject trying to change a route segment with less then two coordinates', async () => {
    await expect(service.update(0, { coordinates: [] })).rejects.toThrow(
      new NotEnoughCoordinatesError(),
    );
  });

  it('should reject trying to change a route segment with mixed coordinates', async () => {
    await expect(
      service.update(0, {
        coordinates: [
          [0, 0],
          [0, 0, 0],
        ],
      }),
    ).rejects.toThrow(new MixedCoordinatesError());
  });

  it('should reject trying to change a route segment with more then 1.000.000 coordinates', async () => {
    const coordinates: Array<[number, number, number]> = Array.from(
      { length: 1000001 },
      (_, i) => [i, i, 0],
    );
    await expect(service.update(0, { coordinates })).rejects.toThrow(
      new TooManyCoordinatesError(),
    );
  });

  it('should reject trying to change a route segment without providing any values to change', async () => {
    await expect(service.update(0, {})).rejects.toThrow();
  });
});
