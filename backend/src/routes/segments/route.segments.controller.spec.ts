/**
 * @file Public API for route segment unit test cases.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { RoutesSegmentsController } from './route.segments.controller';
import {
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  MixedCoordinatesError,
  NotEnoughCoordinatesError,
  RouteSegmentsService,
  TooManyCoordinatesError,
} from './route.segments.service';
import { NoAttributesProvidedError } from '../routes/routes.database';
import * as routeSegmentsTestData from './__data__';
import * as routeTestData from '../routes/__data__';
import { RoutesModule } from '../routes.module';
import { RoutesService } from '../routes/routes.service';

describe('RoutesSegmentsController', () => {
  let controller: RoutesSegmentsController;
  let routeSegmentService: RouteSegmentsService;
  let routeService: RoutesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RoutesModule],
    }).compile();

    controller = module.get<RoutesSegmentsController>(RoutesSegmentsController);
    routeSegmentService =
      module.get<RouteSegmentsService>(RouteSegmentsService);
    routeService = module.get<RoutesService>(RoutesService);
  });

  it('should be returning a single route segment', async () => {
    jest
      .spyOn(routeSegmentService, 'findOne')
      .mockReturnValue(Promise.resolve(routeSegmentsTestData.routeSegment));

    expect(await controller.findOne(0)).toEqual(
      routeSegmentsTestData.routeSegment,
    );
  });

  it('should return "404" if the segment could not be found', async () => {
    jest
      .spyOn(routeSegmentService, 'findOne')
      .mockReturnValue(Promise.resolve(null));

    expect(controller.findOne(0)).rejects.toThrow(new NotFoundException());
  });

  it('should be returning all route segments related to a route', async () => {
    jest
      .spyOn(routeService, 'route')
      .mockReturnValue(Promise.resolve(routeTestData.route));

    jest
      .spyOn(routeSegmentService, 'findAllForRoute')
      .mockReturnValue(Promise.resolve([routeSegmentsTestData.routeSegment]));

    expect(await controller.findAllForRoute(0)).toEqual([
      routeSegmentsTestData.routeSegment,
    ]);
  });

  it('should be returning the length of a single route segment', async () => {
    jest
      .spyOn(routeSegmentService, 'length')
      .mockReturnValue(Promise.resolve(42));

    expect(await controller.length({ id: 0 })).toEqual({ length: 42 });
  });

  it('should create a new route segment and return its dto', async () => {
    jest
      .spyOn(routeService, 'route')
      .mockReturnValue(Promise.resolve(routeTestData.route));

    jest
      .spyOn(routeSegmentService, 'create')
      .mockReturnValue(Promise.resolve(routeSegmentsTestData.routeSegment));

    expect(await controller.create(routeSegmentsTestData.newRouteSegment)).toBe(
      routeSegmentsTestData.routeSegment,
    );
  });

  it('should throw "422" if the corresponding route does not exist', async () => {
    jest.spyOn(routeService, 'route').mockReturnValue(Promise.resolve(null));

    const result = controller.create({
      name: routeSegmentsTestData.newRouteSegment.name,
      routeId: 0,
      coordinates: [],
    });
    await expect(result).rejects.toThrow(new UnprocessableEntityException());
  });

  it('should throw "400" if the route segment has invalid coordinates', async () => {
    jest
      .spyOn(routeService, 'route')
      .mockReturnValue(Promise.resolve(routeTestData.route));

    jest.spyOn(routeSegmentService, 'create').mockImplementation(() => {
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

  it('should throw "400" if the route segment has too many coordinates', async () => {
    const coordinates: Array<[number, number, number]> = Array.from(
      { length: 1000001 },
      (_, i) => [i, i, 0],
    );
    jest
      .spyOn(routeService, 'route')
      .mockReturnValue(Promise.resolve(routeTestData.route));

    jest.spyOn(routeSegmentService, 'create').mockImplementation(() => {
      throw new TooManyCoordinatesError();
    });

    const result = controller.create({
      name: routeSegmentsTestData.newRouteSegment.name,
      routeId: 0,
      coordinates,
    });
    await expect(result).rejects.toThrow(
      new BadRequestException(new TooManyCoordinatesError().message),
    );
  });

  it('should throw "400" if the route segment has mixed coordinates', async () => {
    jest
      .spyOn(routeService, 'route')
      .mockReturnValue(Promise.resolve(routeTestData.route));

    jest.spyOn(routeSegmentService, 'create').mockImplementation(() => {
      throw new MixedCoordinatesError();
    });

    const result = controller.create({
      name: routeSegmentsTestData.newRouteSegment.name,
      routeId: 0,
      coordinates: [
        [0, 0],
        [0, 0, 0],
      ],
    });
    await expect(result).rejects.toThrow(
      new BadRequestException(new MixedCoordinatesError().message),
    );
  });

  it('should throw "BadRequest" if no attributes for the route segment to be changed are provided', async () => {
    jest.spyOn(routeSegmentService, 'update').mockImplementation(() => {
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
    jest.spyOn(routeSegmentService, 'update').mockImplementation(() => {
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
      coordinates: routeSegmentsTestData.updatedCoordinates,
    };

    jest.spyOn(routeSegmentService, 'update').mockResolvedValue(expected);

    const result = await controller.update(routeSegmentsTestData.segmentId, {
      name: routeSegmentsTestData.updatedSegmentName,
      coordinates: routeSegmentsTestData.updatedCoordinates,
    });

    expect(result).toStrictEqual(expected);
  });
});
