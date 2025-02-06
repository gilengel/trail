/**
 * @file Routes service unit test cases.
 */
import { Test, TestingModule } from '@nestjs/testing';
import * as testData from '../../test/data';

import { TripsService } from './trips.service';
import { PrismaService } from '../prisma.service';
import { CreateTripDto } from './dto/create.trip.dto';
import { TripDto } from './dto/trip.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('@prisma/client', () => {
  const a = jest.fn(() => 'MOCKED_QUERY');
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        $queryRaw: a,
        trip: {
          update: () => { return Promise.resolve(testData.dbTripWithUpdatedLayout)}
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
      layout: {},
    };

    jest.spyOn(prisma, '$queryRaw').mockResolvedValueOnce([{ id: 0 }]); // trip id

    const result = await service.createTrip(trip);

    expect(result).toStrictEqual({
      id: 0,
      layout: {},
    });
  });

  it('should return a route stored in the database by id', async () => {
    jest
      .spyOn(prisma, '$queryRaw')
      .mockResolvedValueOnce([testData.dbTrip]);

    const result: TripDto = await service.trip(0);
    expect(result).toStrictEqual(testData.dbTrip);
  });

  it('should return "404" if no trip is stored in the database by the given id', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValueOnce([]);

    const result = service.trip(0);
    await expect(result).rejects.toThrow(
      new HttpException(
        `Route with id 0 does not exist.`,
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should update the layout of a trip', async () => {
    jest
      .spyOn(prisma, '$queryRaw')
      .mockResolvedValue([testData.dbRouteWithUpdatedName]);

    const result = await service.updateTrip(0, {
      layout: { test: "value" }
    });

    const expected = {
      id: testData.routeId,
      layout: { test: "value" }
    };

    expect(result).toStrictEqual(expected);
  });
});
