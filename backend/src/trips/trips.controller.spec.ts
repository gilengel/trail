/**
 * @file Public API for trips unit test cases.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { PrismaService } from '../prisma.service';
import * as testData from '../../test/data';
import { TripDto } from '../dto';

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

  it('should create a new trip and return its dto', async () => {
    jest
      .spyOn(service, 'createTrip')
      .mockReturnValue(Promise.resolve(testData.dbTrip));

    expect(await controller.create(testData.newTrip)).toBe(testData.dbTrip);
  });

  it('should throw "BadRequest" trying to create a trip if layout is invalid', async () => {
    jest.spyOn(service, 'createTrip').mockImplementation(() => {
      throw new Error();
    });

    const result = controller.create({
      name: testData.tripName,
      layout: {},
    });
    await expect(result).rejects.toThrow(
      new Error()
    );
  });

  it('should be returning all trips', async () => {
    jest
      .spyOn(service, 'trips')
      .mockReturnValue(Promise.resolve([testData.dbTrip]));

    expect(await controller.findAll()).toEqual([testData.dbTrip]);
  });

  it('should return "400" if the service produces an error', async () => {
    jest
      .spyOn(service, 'trips')
      .mockRejectedValue(new Error('Some error message'));

    const result = controller.findAll();
    await expect(result).rejects.toThrow(
      new HttpException('Some error message', HttpStatus.BAD_REQUEST),
    );
  });
  it('should be returning a single trip', async () => {
    jest
      .spyOn(service, 'trip')
      .mockReturnValue(Promise.resolve(testData.dbTrip));

    expect(await controller.findOne(0)).toEqual(testData.dbTrip);
  });

  it('should update a trip and return its dto', async () => {
    const result: TripDto = {
      id: 0,
      name: testData.tripName,
      layout: { test: "value"}
    };

    jest.spyOn(service, 'updateTrip').mockReturnValue(Promise.resolve(result));

    expect(
      await controller.update(0, { layout: { test: "value" } }),
    ).toStrictEqual(result);
  });

  it('should update a trip and return its dto', async () => {
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

  it('should delete a trip', async () => {
    jest.spyOn(service, 'deleteTrip').mockReturnValue(Promise.resolve(testData.dbTrip));

    const result = await controller.delete(0);
    expect(result).toBe(testData.dbTrip);
  });
});
