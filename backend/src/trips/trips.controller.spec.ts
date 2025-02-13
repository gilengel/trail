/**
 * @file Public API for routes unit test cases.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { PrismaService } from '../prisma.service';
import * as testData from '../../test/data';
import { NotEnoughCoordinatesError } from '../routes.segments/routes.segments.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TripDto } from './dto/trip.dto';

jest.mock('@prisma/client', () => {
  const a = jest.fn().mockResolvedValue([]);
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        $queryRaw: a,
      };
    }),

    // necessary as we use sql to convert the image coordinates to postgis see image.service.ts
    Prisma: {
      sql: () => '',
      join: () => '',
    },
  };
});

describe('TripsController', () => {
  let controller: TripsController;
  let service: TripsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [TripsService, PrismaService],
    }).compile();

    controller = module.get<TripsController>(TripsController);
    service = module.get<TripsService>(TripsService);
  });

  it('should create a new route and return its dto', async () => {
    jest
      .spyOn(service, 'createTrip')
      .mockReturnValue(Promise.resolve(testData.dbTrip));

    expect(await controller.create(testData.newTrip)).toBe(testData.dbTrip);
  });

  it('should throw "BadRequest" trying to create a trip if layout is invalid', async () => {
    jest.spyOn(service, 'createTrip').mockImplementation(() => {
      throw new NotEnoughCoordinatesError();
    });

    const result = controller.create({
      layout: {},
    });
    await expect(result).rejects.toThrow(
      new HttpException(
        'Minimum number of coordinates for a route is two which was not met.',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should be returning a single trip', async () => {
    jest
      .spyOn(service, 'trip')
      .mockReturnValue(Promise.resolve(testData.dbTrip));

    expect(await controller.findOne(0)).toEqual(testData.dbTrip);
  });

  it('should update a route and return its dto', async () => {
    const result: TripDto = {
      id: 0,
      layout: { test: "value"}
    };

    jest.spyOn(service, 'updateTrip').mockReturnValue(Promise.resolve(result));

    expect(
      await controller.update(0, { layout: { test: "value" } }),
    ).toStrictEqual(result);
  });

  it('should update a route and return its dto', async () => {
    jest.spyOn(service, 'updateTrip').mockImplementation(() => {
      throw new Error();
    });

    const result = controller.update(0, { layout: { test: "value" } });
    await expect(result).rejects.toThrow(
      new HttpException(
        'The requested trip you want to update does not exist.',
        HttpStatus.NOT_FOUND,
      ),
    );
  });
});
