/**
 * @file Routes service unit test cases.
 */
import { Test, TestingModule } from '@nestjs/testing';
import * as testData from '../../test/data';

import { TripsService } from './trips.service';
import { PrismaService } from '../prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateTripDto, TripDto } from '../dto';

jest.mock('@prisma/client', () => {
  const a = jest.fn(() => 'MOCKED_QUERY');
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        $queryRaw: a,
        trip: {
          update: () => { return Promise.resolve(testData.dbTripWithUpdatedLayout)},
          create: jest.fn(),
          findUnique: jest.fn(),
          findMany: jest.fn(),
          delete: jest.fn()
        }
      };
    }),

    Prisma: {
      join: a,
      sql: a,
    },
  };
});

describe('TripsService', () => {
  let service: TripsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripsService, PrismaService],
    }).compile();

    service = module.get<TripsService>(TripsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create an empty trip', async () => {
    const trip: CreateTripDto = {
      name: testData.tripName,
      layout: {}
    };

    jest
      .spyOn(prisma.trip, 'create')
      .mockResolvedValueOnce({ id: 0, name: testData.tripName, layout: {} })


    const result = await service.createTrip(trip);

    expect(result).toStrictEqual({
      id: 0,
      name: testData.tripName,
      layout: {},
    });
  });

  it('should return a trip stored in the database by id', async () => {
    jest
      .spyOn(prisma.trip, 'findUnique')
      .mockResolvedValueOnce({
        id: testData.dbTrip.id,
        name: testData.dbTrip.name,
        layout: testData.dbTrip.layout as object
      });

    const result: TripDto = await service.trip(0);
    expect(result).toStrictEqual(testData.dbTrip);
  });

  it('should return all trips stored in the database', async () => {
    jest.spyOn(prisma.trip, 'findMany').mockResolvedValueOnce([]);

    const result = await service.trips();

    expect(result).toStrictEqual([]);
  });

  it('should return "404" if no trip is stored in the database by the given id', async () => {
    jest
      .spyOn(prisma.trip, 'findUnique')
      .mockResolvedValue(null);


    const result = service.trip(0);
    await expect(result).rejects.toThrow(
      new HttpException(
        `Trip with id 0 does not exist.`,
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should update the layout of a trip', async () => {
    jest
      .spyOn(prisma.trip, 'update')
      .mockResolvedValue({
        id: testData.dbTripWithUpdatedLayout.id,
        name: testData.dbTripWithUpdatedLayout.name,
        layout: testData.dbTripWithUpdatedLayout.layout as object
      });

    const result = await service.updateTrip(0, {
      layout: { test: "value" }
    });

    const expected = {
      id: testData.routeId,
      name: testData.routeName,
      layout: { test: "value" }
    };

    expect(result).toStrictEqual(expected);
  });

  it('should delete a trip from the db and return it', async () => {
    jest.spyOn(prisma.trip, 'delete').mockResolvedValue({
      id: testData.dbTrip.id,
      name: testData.dbTrip.name,
      layout: testData.dbTrip.layout as object
    });

    const result = await service.deleteTrip(0);
    expect(result).toStrictEqual(testData.dbTrip);
  });
});
