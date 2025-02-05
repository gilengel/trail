/**
 * @file Routes service unit test cases.
 */
import { Test, TestingModule } from '@nestjs/testing';
import * as testData from '../../test/data';

import { TripsService } from './trips.service';
import { PrismaService } from '../prisma.service';

import * as conversion from '../conversion';
import { CreateTripDto } from './dto/create.trip.dto';

jest.mock('@prisma/client', () => {
  const a = jest.fn(() => 'MOCKED_QUERY');
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

describe('conversion', () => {
  describe('lineString', () => {
    it('should convert a 2D linestring from wkt in a number array', () => {
      const result = conversion.wkt2numberArray(testData.wkt);

      expect(result).toStrictEqual(testData.coordinates);
    });

    it('should convert 2D number array into a wkt string', () => {
      const result = conversion.numberArray2wkt(testData.coordinates);

      expect(result).toStrictEqual(testData.wkt);
    });
  });

  describe('route', () => {
    it('should convert from a db dto to a route dto', () => {
      const result = conversion.dbRoute2dto(testData.dbRoute);

      expect(result).toStrictEqual(testData.route);
    });
  });
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

  it('should create a route from gpx', async () => {
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
});
