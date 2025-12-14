/**
 * @file Public API for route segment unit test cases.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { RoutesSegmentsController } from './route.segments.controller';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RouteSegmentsService } from './route.segments.service';
import { NotEnoughCoordinatesError } from '../../dto/convert';
import { NoAttributesProvidedError } from '../routes/routes.database';
import * as routeSegmentsTestData from './__data__'
import * as routeTestData from '../routes/__data__'
import { RoutesModule } from '../routes.module';

describe('RoutesSegmentsController', () => {
  let controller: RoutesSegmentsController;
  let service: RouteSegmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RoutesModule],
    }).compile();

    controller = module.get<RoutesSegmentsController>(RoutesSegmentsController);
    service = module.get<RouteSegmentsService>(RouteSegmentsService);
  });

  it('should be returning a single route segment', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockReturnValue(Promise.resolve(routeSegmentsTestData.routeSegment));

    expect(await controller.findOne(0)).toEqual(routeSegmentsTestData.routeSegment);
  });

  it('should be returning all route segments related to a route', async () => {
    jest
      .spyOn(service, 'findAllForRoute')
      .mockReturnValue(Promise.resolve([routeSegmentsTestData.routeSegment]));

    expect(await controller.findAllForRoute(0)).toEqual([
      routeSegmentsTestData.routeSegment,
    ]);
  });

  it('should be returning the length of a single route segment', async () => {
    jest.spyOn(service, 'length').mockReturnValue(Promise.resolve(42));

    expect(await controller.length({ id: 0 })).toEqual({ length: 42 });
  });

  it('should create a new route segment and return its dto', async () => {
    jest
      .spyOn(service, 'create')
      .mockReturnValue(Promise.resolve(routeSegmentsTestData.routeSegment));

    expect(await controller.create(routeSegmentsTestData.newRouteSegment)).toBe(
      routeSegmentsTestData.routeSegment,
    );
  });

  it('should throw "BadRequest" if the route segment has invalid coordinates', async () => {
    jest.spyOn(service, 'create').mockImplementation(() => {
      throw new NotEnoughCoordinatesError();
    });

    const result = controller.create({
      name: routeSegmentsTestData.newRouteSegment.name,
      routeId: 0,
      coordinates: [],
    });
    await expect(result).rejects.toThrow(
      new HttpException(
        'Minimum number of coordinates for a route is two which was not met.',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should throw "BadRequest" if no attributes for the route segment to be changed are provided', async () => {
    jest.spyOn(service, 'update').mockImplementation(() => {
      throw new NoAttributesProvidedError();
    });

    const result = controller.update(0, {});
    await expect(result).rejects.toThrow(
      new HttpException(
        'No fields to be updated were provided.',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });
  it('should throw "404" if the route of the segment does not exists', async () => {
    jest.spyOn(service, 'update').mockImplementation(() => {
      throw new Error();
    });

    const result = controller.update(42, { name: 'irrelevant' });
    await expect(result).rejects.toThrow(
      new HttpException(
        'The requested route segment you want to update does not exist.',
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should update a route segment', async () => {
    const expected = {
      id: routeSegmentsTestData.segmentId,
      routeId: routeTestData.routeId,
      name: routeSegmentsTestData.updatedSegmentName,
      description: routeSegmentsTestData.segmentDescription,
      coordinates: routeSegmentsTestData.updatedCoordinates
    };

    jest
      .spyOn(service, 'update')
      .mockResolvedValue(expected);

    const result = await controller.update(routeSegmentsTestData.segmentId, {
      name: routeSegmentsTestData.updatedSegmentName,
      coordinates: routeSegmentsTestData.updatedCoordinates,
    });

    expect(result).toStrictEqual(expected);
  });
});
