/**
 * @file Public API for images unit test cases.
 */
import { Test, TestingModule } from '@nestjs/testing';
import {
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { readFileSync } from 'fs';

import {
  ImagesController,
  NoOrWrongGeoInformationError,
} from './images.controller';
import { ImagesService } from './images.service';
import { mockFileFromBuffer } from './test/test.helper';
import * as imageTestData from './__data__';
import * as routeSegmentTestData from '../routes/segments/__data__';
import { ImagesModule } from './images.module';
import { RouteSegmentsService } from '../routes/segments/route.segments.service';

describe('ImageController', () => {
  let controller: ImagesController;
  let imageService: ImagesService;
  let routeSegmentService: RouteSegmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ImagesModule],
    }).compile();

    controller = module.get<ImagesController>(ImagesController);
    routeSegmentService =
      module.get<RouteSegmentsService>(RouteSegmentsService);
    imageService = module.get<ImagesService>(ImagesService);

    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each([
    'with_geo_information.jpg',
    'with_geo_information.jpeg',
    'with_geo_information.tif',
  ])('should save an image (%s) and return its dto', async (file) => {
    jest
      .spyOn(imageService, 'saveImages')
      .mockReturnValue(Promise.resolve(imageTestData.Entities.images));

    const buffer = readFileSync(`src/images/test/${file}`);

    const result = await controller.uploadFile([mockFileFromBuffer(buffer)]);
    expect(result).toStrictEqual(imageTestData.Entities.images);
  });

  it('should fail to save an image without geo information (exif)', async () => {
    jest
      .spyOn(imageService, 'saveImages')
      .mockRejectedValue(new NoOrWrongGeoInformationError());

    const buffer = readFileSync('src/images/test/without_geo_information.jpg');

    const result = controller.uploadFile([mockFileFromBuffer(buffer)]);
    await expect(result).rejects.toThrow(
      new BadRequestException(
        'The provided image has no or wrong geo information.',
      ),
    );
  });

  it('should return the image dtos for all images near a point', async () => {
    jest
      .spyOn(imageService, 'getImagesNearCoordinate')
      .mockReturnValue(Promise.resolve(imageTestData.Entities.images));

    const result = await controller.getImagesNearPoint(1024, 1024, 0);
    expect(result).toStrictEqual(imageTestData.Entities.images);
  });

  it('should fail with a "400" if parameters are invalid', async () => {
    jest
      .spyOn(imageService, 'getImagesNearCoordinate')
      .mockRejectedValue(new Error());

    const result = controller.getImagesNearPoint(1024, 1024, -1);

    await expect(result).rejects.toThrow(
      new BadRequestException(
        'The provided offset query parameter must be greater or equal to zero, got -1',
      ),
    );
  });

  it('should fail with a "400" if not provided with longitude', async () => {
    jest
      .spyOn(imageService, 'getImagesNearCoordinate')
      .mockRejectedValue(new BadRequestException());

    const result = controller.getImagesNearPoint(undefined, 1024, -1);

    await expect(result).rejects.toThrow(new BadRequestException());
  });

  it('should fail with a "400" if not provided with latitude', async () => {
    jest
      .spyOn(imageService, 'getImagesNearCoordinate')
      .mockRejectedValue(new BadRequestException());

    const result = controller.getImagesNearPoint(1024, undefined, -1);

    await expect(result).rejects.toThrow(new BadRequestException());
  });

  it('should fail with a "400" if not provided with longitude and latitude', async () => {
    jest
      .spyOn(imageService, 'getImagesNearCoordinate')
      .mockRejectedValue(new BadRequestException());

    const result = controller.getImagesNearPoint(undefined, undefined, -1);

    await expect(result).rejects.toThrow(new BadRequestException());
  });

  it('should return the image dtos for all images near a route segment', async () => {
    jest
      .spyOn(routeSegmentService, 'findOne')
      .mockReturnValue(Promise.resolve(routeSegmentTestData.routeSegment));
    jest
      .spyOn(imageService, 'getImagesNearRouteSegment')
      .mockReturnValue(Promise.resolve(imageTestData.Entities.images));

    const result = await controller.getImagesNearRouteSegment(
      routeSegmentTestData.routeSegment.id,
      0,
    );
    expect(result).toStrictEqual(imageTestData.Entities.images);
  });

  it('should return the number of images near a route segment', async () => {
    jest
      .spyOn(routeSegmentService, 'findOne')
      .mockReturnValue(Promise.resolve(routeSegmentTestData.routeSegment));
    jest
      .spyOn(imageService, 'getNumberOfImagesNearRouteSegment')
      .mockReturnValue(Promise.resolve(4));

    const result = await controller.getNumberOfImagesNearRouteSegment(
      routeSegmentTestData.routeSegment.id,
      0,
    );
    expect(result).toStrictEqual({ count: 4 });
  });

  it('should return "422" if the route segment was not found', async () => {
    jest
      .spyOn(routeSegmentService, 'findOne')
      .mockReturnValue(Promise.resolve(null));
    jest
      .spyOn(imageService, 'getNumberOfImagesNearRouteSegment')
      .mockReturnValue(Promise.resolve(4));

    const result = controller.getNumberOfImagesNearRouteSegment(
      routeSegmentTestData.routeSegment.id,
      0,
    );
    expect(result).rejects.toThrow(new UnprocessableEntityException());
  });

  it('should return the image dtos for all images near a route segment capped by the max parameter', async () => {
    jest
      .spyOn(routeSegmentService, 'findOne')
      .mockReturnValue(Promise.resolve(routeSegmentTestData.routeSegment));
    jest
      .spyOn(imageService, 'getImagesNearRouteSegment')
      .mockReturnValue(
        Promise.resolve(imageTestData.Entities.multipleImages.slice(0, 3)),
      );

    const result = await controller.getImagesNearRouteSegment(
      routeSegmentTestData.routeSegment.id,
      0,
      3,
    );
    expect(result.length).toEqual(3);
  });

  it('should fail with a "422" if the corresponding route segment does not exists', async () => {
    jest.spyOn(routeSegmentService, 'findOne').mockResolvedValue(null);
    jest
      .spyOn(imageService, 'getImagesNearRouteSegment')
      .mockRejectedValue(new Error());

    const result = controller.getImagesNearRouteSegment(
      routeSegmentTestData.routeSegment.id,
      0,
    );
    await expect(result).rejects.toThrow(new UnprocessableEntityException());
  });

  it('should fail with a "400" if parameters are invalid to get images for a route segment', async () => {
    jest
      .spyOn(routeSegmentService, 'findOne')
      .mockReturnValue(Promise.resolve(routeSegmentTestData.routeSegment));
    jest
      .spyOn(imageService, 'getImagesNearRouteSegment')
      .mockRejectedValue(new Error());

    const result = controller.getImagesNearRouteSegment(
      routeSegmentTestData.routeSegment.id,
      -1,
    );

    await expect(result).rejects.toThrow(
      new BadRequestException('Invalid offset: Must be >= 0'),
    );
  });

  /*
  it('should fail with a "NotFound" if no images are near a route segment', async () => {
    jest
      .spyOn(routeSegmentService, 'findOne')
      .mockReturnValue(Promise.resolve(testData.routeSegment));
    jest.spyOn(imageService, 'getImagesNearRouteSegment').mockResolvedValue([]);

    const result = controller.getImagesNearRouteSegment(
      testData.routeSegment.id,
      0,
    );

    await expect(result).rejects.toThrow(
      new HttpException('', HttpStatus.NOT_FOUND),
    );
  });
  */

  it('should fail with a 404 if the requested segment does not exist', async () => {
    jest
      .spyOn(routeSegmentService, 'findOne')
      .mockRejectedValue(new NotFoundException());

    jest.spyOn(imageService, 'getImagesNearRouteSegment').mockResolvedValue([]);

    const result = controller.getImagesNearRouteSegment(
      routeSegmentTestData.routeSegment.id,
      0,
    );

    await expect(result).rejects.toThrow(new NotFoundException());
  });

  it('should fail with a 400 if the requested segment id is greater than the allowed max integer from the database', async () => {
    const result = controller.getImagesNearRouteSegment(2147483647 + 1, 0);

    await expect(result).rejects.toThrow(
      new BadRequestException('Invalid route segment id'),
    );
  });
});
