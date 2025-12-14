/**
 * @file Public API for routes unit test cases.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { NotEnoughCoordinatesError } from '../../dto/convert';
import { Route } from './dto/route.dto';
import { NoAttributesProvidedError } from './routes.database';
import * as routeTestData from './__data__'
import * as routeSegmentsTestData from '../segments/__data__'
import * as tripTestData from '../../trips/__data__'

import { RoutesModule } from '../routes.module';
import { TripsService } from '../../trips/trips.service';


describe('RoutesController', () => {
  let controller: RoutesController;
  let service: RoutesService;
  let tripService: TripsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RoutesModule],
    }).compile();

    controller = module.get<RoutesController>(RoutesController);
    service = module.get<RoutesService>(RoutesService);
    tripService = module.get<TripsService>(TripsService);

    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => { });
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  })

  it('should be returning a list of all routes', async () => {
    jest
      .spyOn(service, 'routes')
      .mockReturnValue(Promise.resolve([routeTestData.route]));

    expect(await controller.findAll()).toEqual([routeTestData.route]);
  });

  it('should be returning a list of all routes for one trip', async () => {
    jest
      .spyOn(service, 'routesOfTrip')
      .mockReturnValue(Promise.resolve([routeTestData.route]));

    expect(await controller.findAllOfTrip(routeTestData.route.id)).toEqual([
      routeTestData.route,
    ]);
  });

  it('should return "400" if the service produces an error', async () => {
    jest
      .spyOn(service, 'routes')
      .mockRejectedValue(new Error('Some error message'));

    const result = controller.findAll();
    await expect(result).rejects.toThrow(
      new HttpException('Some error message', HttpStatus.BAD_REQUEST),
    );
  });

  it('should be returning a single route', async () => {
    jest
      .spyOn(service, 'route')
      .mockReturnValue(Promise.resolve(routeTestData.route));

    expect(await controller.findOne({ id: 0 })).toEqual(routeTestData.route);
  });

  it('should create a new route and return its dto', async () => {
    jest
      .spyOn(tripService, 'trip')
      .mockReturnValue(Promise.resolve(tripTestData.trip));

    jest
      .spyOn(service, 'createRoute')
      .mockReturnValue(Promise.resolve(routeTestData.route));

    expect(await controller.create(routeTestData.newRoute)).toBe(routeTestData.route);
  });

  /*
  it('should create a new route based on a gpx file and return its dto', async () => {
    jest
      .spyOn(parser, 'extractCoordinatesFromGPX')
      .mockReturnValue(routeTestData.gpxRoute);
    jest
      .spyOn(service, 'createRouteFromGPX')
      .mockReturnValue(Promise.resolve(routeTestData.route));

    const buffer = readFileSync(`src/routes/test/short.gpx`);
    const files = [mockFileFromBuffer(buffer)];
    const result = await controller.createFromGPX(
      {
        name: '',
        tripId: 0,
        files,
      },
      files,
    );
    expect(result).toStrictEqual(routeTestData.route);
  });
  

  it('should return "404" if the requested route segment does not exist', async () => {
    jest.spyOn(parser, 'extractCoordinatesFromGPX').mockImplementation(() => {
      throw new HttpException(
        `Route segment with id 0 does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    });

    const buffer = readFileSync(`src/routes/test/invalid.gpx`);

    const files = [mockFileFromBuffer(buffer)];
    const result = controller.createFromGPX(
      {
        name: 'test_route',
        tripId: 0,
        files,
      },
      files,
    );
    await expect(result).rejects.toThrow(
      new HttpException(
        `Route segment with id 0 does not exist.`,
        HttpStatus.BAD_REQUEST,
      ),
    );
  });


  it('should fail to create a new route from a gpx file if the file is invalid', async () => {
    jest.spyOn(parser, 'extractCoordinatesFromGPX').mockImplementation(() => {
      throw new Error();
    });

    const buffer = readFileSync(`src/routes/test/invalid.gpx`);

    const files = [mockFileFromBuffer(buffer)];

    const result = controller.createFromGPX(
      {
        name: 'test_route',
        tripId: 0,
        files,
      },
      files,
    );
    await expect(result).rejects.toThrow(
      new HttpException('', HttpStatus.BAD_REQUEST),
    );
  });
  */
  it('should throw "BadRequest" trying to create a route if coordinates are wrong', async () => {
    jest
      .spyOn(tripService, 'trip')
      .mockReturnValue(Promise.resolve(tripTestData.trip));

    jest.spyOn(service, 'createRoute').mockImplementation(() => {
      throw new NotEnoughCoordinatesError();
    });

    const result = controller.create({
      name: 'invalid_route',
      tripId: 0,
      description: '',
      segments: [
        {
          name: 'invalid_segment',
          coordinates: [[0, 0, 0]],
        },
      ],
    });
    await expect(result).rejects.toThrow(
      new HttpException(
        'Minimum number of coordinates for a route is two which was not met.',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should update a route and return its dto', async () => {
    const result: Route = {
      id: 0,
      description: '',
      name: routeTestData.updatedRouteName,
      segments: routeSegmentsTestData.segments,
    };

    jest.spyOn(service, 'updateRoute').mockResolvedValue(result);

    expect(
      await controller.update(0, { name: routeTestData.updatedRouteName }),
    ).toStrictEqual(result);
  });

  it('should throw "BadRequest" if no attributes to be changed are provided', async () => {
    jest.spyOn(service, 'updateRoute').mockImplementation(() => {
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

  it('should throw "NotFound" if the route does not exist in the db', async () => {

    jest.spyOn(service, 'updateRoute').mockImplementation(() => {
      throw new NotFoundException('The requested route you want to update does not exist.');
    });

    const result = controller.update(0, { name: ''});
    await expect(result).rejects.toThrow(
      new HttpException(
        'The requested route you want to update does not exist.',
        HttpStatus.NOT_FOUND,
      ),
    );

  });

  it('should delete a route', async () => {
    jest.spyOn(service, 'deleteRoute').mockResolvedValue(true);

    const result = await controller.delete(0);
    expect(result).toBe(true);
  });
});