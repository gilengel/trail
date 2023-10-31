import { Test, TestingModule } from '@nestjs/testing';
import { RoutesController } from './routes.controller';
import {
  NoAttributesProvidedError,
  NotEnoughCoordinatesError,
  RoutesService,
} from './routes.service';
import { PrismaService } from '../prisma.service';
import * as testData from '../../test/data';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('RoutesController', () => {
  let controller: RoutesController;
  let service: RoutesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoutesController],
      providers: [RoutesService, PrismaService],
    }).compile();

    controller = module.get<RoutesController>(RoutesController);
    service = module.get<RoutesService>(RoutesService);
  });

  it('should be returning a list of all routes', async () => {
    jest
      .spyOn(service, 'routes')
      .mockReturnValue(Promise.resolve([testData.route]));

    expect(await controller.findAll()).toEqual([testData.route]);
  });

  it('should be returning a single route', async () => {
    jest
      .spyOn(service, 'route')
      .mockReturnValue(Promise.resolve(testData.route));

    expect(await controller.findOne({ id: 0 })).toEqual(testData.route);
  });

  it('should create a new route and return its dto', async () => {
    jest
      .spyOn(service, 'createRoute')
      .mockReturnValue(Promise.resolve(testData.route));

    expect(await controller.create(testData.route)).toBe(testData.route);
  });

  it('should throw "bad request" trying to create a route if coordinates are wrong', async () => {
    jest.spyOn(service, 'createRoute').mockImplementation(() => {
      throw new NotEnoughCoordinatesError();
    });

    const result = controller.create({
      name: 'invalid_route',
      coordinates: [[0, 0]],
    });
    await expect(result).rejects.toThrow(
      new HttpException(
        'Minimum number of coordinates for a route is two which was not met.',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should update a route and return its dto', async () => {
    jest.spyOn(service, 'updateRoute').mockReturnValue(
      Promise.resolve({
        id: 0,
        name: testData.updatedName,
        coordinates: testData.coordinates,
      }),
    );

    expect(
      await controller.update(0, { name: testData.updatedName }),
    ).toStrictEqual({
      id: 0,
      name: testData.updatedName,
      coordinates: testData.coordinates,
    });
  });

  it('should throw "bad request" if no attributes to be changed are provided', async () => {
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

  it('should throw "not found" if the route does not exist in the db', async () => {
    jest.spyOn(service, 'updateRoute').mockImplementation(() => {
      throw new Error();
    });

    const result = controller.update(0, {});
    await expect(result).rejects.toThrow(
      new HttpException(
        'The requested route you want to update does not exist.',
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should delete a route', async () => {
    jest.spyOn(service, 'deleteRoute').mockReturnValue(Promise.resolve(1));

    const result = await controller.delete(0);
    expect(result).toBe(1);
  });
});
