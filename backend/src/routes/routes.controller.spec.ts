/**
 * @file Public API for routes unit test cases.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { RoutesController } from './routes.controller';
import { NoAttributesProvidedError, RoutesService } from './routes.service';
import { PrismaService } from '../prisma.service';
import * as testData from '../../test/data';
import { HttpException, HttpStatus } from '@nestjs/common';
import { readFileSync } from 'fs';
import { mockFileFromBuffer } from '../images/test/test.helper';

import * as parser from './routes.parser';
import { RouteDto } from './dto/route.dto';
import {
  NotEnoughCoordinatesError,
  RoutesSegmentsService,
} from '../routes.segments/routes.segments.service';

describe('RoutesController', () => {
  let controller: RoutesController;
  let service: RoutesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoutesController],
      providers: [RoutesService, RoutesSegmentsService, PrismaService],
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
      .mockReturnValue(Promise.resolve(testData.route));

    expect(await controller.findOne({ id: 0 })).toEqual(testData.route);
  });

  it('should create a new route and return its dto', async () => {
    jest
      .spyOn(service, 'createRoute')
      .mockReturnValue(Promise.resolve(testData.route));

    expect(await controller.create(testData.newRoute)).toBe(testData.route);
  });

  it('should create a new route based on a gpx file and return its dto', async () => {
    jest
      .spyOn(parser, 'extractCoordinatesFromGPX')
      .mockReturnValue(testData.gpxRoute);
    jest
      .spyOn(service, 'createRouteFromGPX')
      .mockReturnValue(Promise.resolve(testData.route));

    const buffer = readFileSync(`src/routes/test/short.gpx`);

    const files = [mockFileFromBuffer(buffer)];
    const result = await controller.createFromGPX(
      {
        name: '',
        files,
      },
      files,
    );
    expect(result).toStrictEqual(testData.route);
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
        files,
      },
      files,
    );
    await expect(result).rejects.toThrow(
      new HttpException('', HttpStatus.BAD_REQUEST),
    );
  });

  it('should throw "BadRequest" trying to create a route if coordinates are wrong', async () => {
    jest.spyOn(service, 'createRoute').mockImplementation(() => {
      throw new NotEnoughCoordinatesError();
    });

    const result = controller.create({
      name: 'invalid_route',
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
    const result: RouteDto = {
      id: 0,
      description: '',
      name: testData.updatedName,
      segments: testData.segments,
    };

    jest.spyOn(service, 'updateRoute').mockReturnValue(Promise.resolve(result));

    expect(
      await controller.update(0, { name: testData.updatedName }),
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
