/**
 * @file Routes service unit test cases.
 */
import { Test, TestingModule } from '@nestjs/testing';
import * as tripTestData from './__data__';
import * as routeTestData from '../routes/routes/__data__';

import { TripsService } from './trips.service';
import { CreateTrip, Trip } from '../dto';
import { TripsDatabase } from './trips.database';
import { TripsModule } from './trips.module';

describe('TripsService', () => {
  let service: TripsService;
  let database: TripsDatabase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TripsModule],
    }).compile();

    service = module.get<TripsService>(TripsService);
    database = module.get<TripsDatabase>(TripsDatabase);
  });

  it('should create an empty trip', async () => {
    const trip: CreateTrip = {
      name: tripTestData.tripName,
      layout: {},
    };

    jest.spyOn(database, 'create').mockResolvedValueOnce({
      id: 0,
      name: tripTestData.tripName,
      layout: {},
    });

    const result = await service.createTrip(trip);

    expect(result).toStrictEqual({
      id: 0,
      name: tripTestData.tripName,
      layout: {},
    });
  });

  it('should return a trip stored in the database by id', async () => {
    jest.spyOn(database, 'getOneById').mockResolvedValueOnce(tripTestData.trip);

    const result: Trip = await service.trip(0);
    expect(result).toStrictEqual(tripTestData.trip);
  });

  it('should return all trips stored in the database', async () => {
    jest.spyOn(database, 'getAll').mockResolvedValueOnce([]);

    const result = await service.trips();

    expect(result).toStrictEqual([]);
  });

  it('should update the layout of a trip', async () => {
    jest.spyOn(database, 'update').mockResolvedValue({
      id: tripTestData.dbTripWithUpdatedLayout.id,
      name: tripTestData.dbTripWithUpdatedLayout.name,
      layout: tripTestData.dbTripWithUpdatedLayout.layout,
    });

    const result = await service.updateTrip(0, {
      name: tripTestData.dbTripWithUpdatedLayout.name,
      layout: { test: 'value' },
    });

    const expected = {
      id: routeTestData.routeId,
      name: routeTestData.routeName,
      layout: { test: 'value' },
    };

    expect(result).toStrictEqual(expected);
  });

  it('should delete a trip from the db and return it', async () => {
    jest.spyOn(database, 'delete').mockResolvedValue(tripTestData.trip);

    const result = await service.deleteTrip(0);
    expect(result).toStrictEqual(tripTestData.trip);
  });
});
