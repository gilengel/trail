/**
 * @file Public API for trips unit test cases.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { Trip } from '../dto';
import * as tripTestData from './__data__'
import { TripsModule } from './trips.module';

describe('TripsController', () => {
  let controller: TripsController;
  let service: TripsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TripsModule]
    }).compile();

    controller = module.get<TripsController>(TripsController);
    service = module.get<TripsService>(TripsService);

    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => { });
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  })

  it('should create a new trip and return its dto', async () => {
    jest
      .spyOn(service, 'createTrip')
      .mockReturnValue(Promise.resolve(tripTestData.trip));

    expect(await controller.create(tripTestData.newTrip)).toBe(tripTestData.trip);
  });

  it('should throw "BadRequest" trying to create a trip if layout is invalid', async () => {
    jest.spyOn(service, 'createTrip').mockImplementation(() => {
      throw new Error();
    });

    const result = controller.create({
      name: tripTestData.tripName,
      layout: {},
    });
    await expect(result).rejects.toThrow(new Error());
  });

  it('should be returning all trips', async () => {
    jest
      .spyOn(service, 'trips')
      .mockReturnValue(Promise.resolve([tripTestData.trip]));

    expect(await controller.findAll()).toEqual([tripTestData.trip]);
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
      .mockReturnValue(Promise.resolve(tripTestData.trip));

    expect(await controller.findOne(0)).toEqual(tripTestData.trip);
  });


  it('should return "404" if no trip is stored in the database by the given id', async () => {
    jest.spyOn(service, 'trip').mockResolvedValue(null);

    await expect(controller.findOne(0)).rejects.toThrow(
      new HttpException(`Trip with id 0 does not exist.`, HttpStatus.NOT_FOUND),
    );
  });

  it('should update a trip and return its dto', async () => {
    const result: Trip = {
      id: 0,
      name: tripTestData.tripName,
      layout: { test: 'value' },
    };

    jest.spyOn(service, 'updateTrip').mockReturnValue(Promise.resolve(result));

    expect(
      await controller.update(0, { layout: { test: 'value' } }),
    ).toStrictEqual(result);
  });

  it('should update a trip and return its dto', async () => {
    jest.spyOn(service, 'updateTrip').mockImplementation(() => {
      throw new Error();
    });

    const result = controller.update(0, { layout: { test: 'value' } });
    await expect(result).rejects.toThrow(
      new HttpException(
        'The requested trip you want to update does not exist.',
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should delete a trip', async () => {
    jest
      .spyOn(service, 'deleteTrip')
      .mockReturnValue(Promise.resolve(tripTestData.trip));

    const result = await controller.delete(0);
    expect(result).toBe(tripTestData.trip);
  });
});
