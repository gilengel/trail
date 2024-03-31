/**
 * @file Public API for route segment unit test cases.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { RoutesSegmentsController } from './routes.segments.controller';
import {
  NotEnoughCoordinatesError,
  RoutesSegmentsService,
} from './routes.segments.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NoAttributesProvidedError } from '../routes/routes.service';
import * as testData from '../../test/data';
import { PrismaService } from '../prisma.service';

describe('RoutesSegmentsController', () => {
  let controller: RoutesSegmentsController;
  let service: RoutesSegmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoutesSegmentsController],
      providers: [RoutesSegmentsService, PrismaService],
    }).compile();

    controller = module.get<RoutesSegmentsController>(RoutesSegmentsController);
    service = module.get<RoutesSegmentsService>(RoutesSegmentsService);
  });

  it('should be returning a single route segment', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockReturnValue(Promise.resolve(testData.routeSegment));

    expect(await controller.findOne(0)).toEqual(testData.routeSegment);
  });

  it('should be returning the length of a single route segment', async () => {
    jest.spyOn(service, 'length').mockReturnValue(Promise.resolve(42));

    expect(await controller.length({ id: 0 })).toEqual({ length: 42 });
  });

  it('should create a new route segment and return its dto', async () => {
    jest
      .spyOn(service, 'create')
      .mockReturnValue(Promise.resolve(testData.routeSegment));

    expect(await controller.create(testData.newRouteSegment)).toBe(
      testData.routeSegment,
    );
  });

  it('should throw "BadRequest" if the route segment has invalid coordinates', async () => {
    jest.spyOn(service, 'create').mockImplementation(() => {
      throw new NotEnoughCoordinatesError();
    });

    const result = controller.create({
      routeId: testData.routeId,
      name: testData.newRouteSegment.name,
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
    jest
      .spyOn(service, 'update')
      .mockResolvedValue(testData.updatedRouteSegment);

    const result = await controller.update(testData.segmentId, {
      name: testData.updatedSegmentName,
      coordinates: testData.updatedCoordinates,
    });

    expect(result).toStrictEqual(testData.updatedRouteSegment);
  });
});
