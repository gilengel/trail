/**
 * @file Routes service unit test cases.
 */
import { Test, TestingModule } from '@nestjs/testing';
import * as routeTestData from './__data__';
import * as routeSegmentTestData from '../segments/__data__';
import * as tripTestData from '../../trips/__data__';

import { RoutesService } from './routes.service';

import { RouteSegmentsService } from '../segments/route.segments.service';
import { Route } from './dto/route.dto';
import { RoutesDatabase } from './routes.database';
import { RouteSegmentsDatabase } from '../segments';
import { RoutesModule } from '../routes.module';

describe('RoutesService', () => {
  let service: RoutesService;
  let routeSegmentsService: RouteSegmentsService;
  let routesDatabase: RoutesDatabase;
  let routesSegmentDatabase: RouteSegmentsDatabase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RoutesModule],
    }).compile();

    service = module.get<RoutesService>(RoutesService);
    routeSegmentsService =
      module.get<RouteSegmentsService>(RouteSegmentsService);
    routesDatabase = module.get<RoutesDatabase>(RoutesDatabase);
    routesSegmentDatabase = module.get<RouteSegmentsDatabase>(
      RouteSegmentsDatabase,
    );
  });

  it('should return a route stored in the database by id', async () => {
    jest
      .spyOn(routesDatabase, 'getOneById')
      .mockResolvedValueOnce(routeTestData.Enties.Route);

    jest
      .spyOn(routeSegmentsService, 'findAllForRoute')
      .mockResolvedValueOnce(routeSegmentTestData.Entities.Segments);

    const result: Route = await service.route(0);
    expect(result).toStrictEqual(routeTestData.route);
  });

  it('should return null if a requested route does not exist', async () => {
    jest.spyOn(routesDatabase, 'getOneById').mockResolvedValueOnce(null);

    const result = await service.route(0);
    await expect(result).toBeNull();
  });

  it('should return all routes stored in the database', async () => {
    jest.spyOn(routesDatabase, 'getAll').mockResolvedValueOnce([]);

    const result = await service.routes();

    expect(result).toStrictEqual([]);
  });

  it('should return all routes of a trip stored in the database', async () => {
    jest.spyOn(routesDatabase, 'getAllByTripId').mockResolvedValueOnce([]);

    const result = await service.routesOfTrip(0);

    expect(result).toStrictEqual([]);
  });

  it('should store a route in the database and return it', async () => {
    const createdRoute = {
      id: routeTestData.routeId,
      name: routeTestData.route.name,
      description: routeTestData.route.description,
      tripId: 0,
      segments: routeSegmentTestData.segments,
    };

    jest.spyOn(routesDatabase, 'create').mockResolvedValueOnce(createdRoute);
    jest
      .spyOn(routesSegmentDatabase, 'createMultiple')
      .mockResolvedValue(routeSegmentTestData.Entities.Segments);

    const result: Route = await service.createRoute(
      routeTestData.newRoute,
      tripTestData.trip,
    );

    expect(result).toStrictEqual(createdRoute);
  });

  it('should store a route in the database without segments and return it', async () => {
    const expected = {
      id: routeTestData.routeId,
      name: routeTestData.route.name,
      description: routeTestData.route.description,
      segments: routeSegmentTestData.segments,
    };

    jest.spyOn(routesDatabase, 'create').mockResolvedValueOnce(expected);

    const result: Route = await service.createRoute(
      routeTestData.newRouteWithoutSegments,
      tripTestData.trip,
    );

    expect(result).toStrictEqual(expected);
  });

  /*
  it('should fail to create a new route if the db query does not return the newly created entity', async () => {
    jest.spyOn(prisma, '$queryRaw').mockRejectedValue(new Error()); // Mocks the database error thrown if trying to add an entry with empty name

    const result = service.createRoute(routeTestData.routeWithEmptyName);

    expect(result).rejects.toThrow();
  });
  */

  it('should update only the name of a route', async () => {
    jest
      .spyOn(routesDatabase, 'update')
      .mockResolvedValue(routeTestData.DB.RouteWithUpdatedName);

    const result = await service.updateRoute(0, {
      name: 'updated_test_route',
    });

    const expected = {
      id: routeTestData.routeId,
      tripId: routeTestData.routeId,
      name: 'updated_test_route',
      description: routeTestData.routeDescription,
    };

    expect(result).toStrictEqual(expected);
  });

  it('should update only the description of a route', async () => {
    jest
      .spyOn(routesDatabase, 'update')
      .mockResolvedValue(routeTestData.DB.RouteWithUpdatedDescription);

    const result = await service.updateRoute(0, {
      description: routeTestData.updatedRouteDescription,
    });

    const expected = {
      id: routeTestData.routeId,
      tripId: routeTestData.routeId,
      name: routeTestData.routeName,
      description: routeTestData.updatedRouteDescription,
    };

    expect(result).toStrictEqual(expected);
  });

  it('should update only the description and name of a route', async () => {
    jest
      .spyOn(routesDatabase, 'update')
      .mockResolvedValue(routeTestData.DB.RouteWithUpdatedNameAndDescription);

    const result = await service.updateRoute(0, {
      name: routeTestData.updatedRouteName,
      description: routeTestData.updatedRouteDescription,
    });

    const expected = {
      id: routeTestData.routeId,
      tripId: routeTestData.routeId,
      name: routeTestData.updatedRouteName,
      description: routeTestData.updatedRouteDescription,
    };

    expect(result).toStrictEqual(expected);
  });

  it('should reject trying to change a route without providing any values to change', async () => {
    await expect(service.updateRoute(0, {})).rejects.toThrow();
  });

  it('should reject changing a non existing route', async () => {
    jest.spyOn(routesDatabase, 'update').mockResolvedValue(null);

    const result = await service.updateRoute(0, {
      name: 'updated_test_route',
    });

    await expect(result).toBeNull();
  });

  it('should delete a route from the db and return it', async () => {
    jest.spyOn(routesDatabase, 'delete').mockResolvedValue(true);

    const result = await service.deleteRoute(0);

    expect(result).toBe(true);
  });
});
