/**
 * @file Image service unit tests.
 */
import { Test, TestingModule } from '@nestjs/testing';
import {
  ImagesService,
  InvalidOffsetError,
} from './images.service';
import {
  ensureExistenceOfStorageDirectory,
} from './test/test.helper';
import * as imageTestData from './__data__'
import * as routeSegmentsTestData from '../routes/segments/__data__'
import { ImagesModule } from './images.module';
import { ImagesDatabase } from './images.database';

describe('ImageService', () => {
  let service: ImagesService;
  let database: ImagesDatabase;

  beforeAll(() => {
    ensureExistenceOfStorageDirectory();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ImagesModule]
    }).compile();

    service = module.get<ImagesService>(ImagesService);
    database = module.get<ImagesDatabase>(ImagesDatabase);
  });

  it('should save an image', async () => {
    const expected = imageTestData.Entities.images;
    jest.spyOn(database, 'create').mockResolvedValue(expected);

    const result = await service.saveImages([imageTestData.Entities.newImageWithoutData]);

    expect(result).toStrictEqual(expected);

  })

  it('should fail to retrieve images if the offset is < 0', async () => {
    try {
      await service.getImagesNearCoordinate([0, 0, 0], -1);
      fail('Expected getImagesNearCoordinate to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidOffsetError);
      expect(err.message).toBe(
        'The provided offset query parameter must be greater or equal to zero, got -1',
      );
    }
  });

  it('should get all images near a coordinate', async () => {
    jest.spyOn(database, 'getByCoordinate').mockResolvedValue(imageTestData.Entities.images);

    const result = await service.getImagesNearCoordinate([1024, 1024, 0], 10);

    expect(result).toStrictEqual(imageTestData.Entities.images);
  });

  it('should get all images near a route', async () => {
    jest.spyOn(database, 'getByGeometry').mockResolvedValue(imageTestData.Entities.images);

    const result = await service.getImagesNearRouteSegment(
      routeSegmentsTestData.routeSegment,
      10,
    );

    expect(result).toStrictEqual(imageTestData.Entities.images);
  });

  it('should get all images near a route limited by the max number of images', async () => {
    const expected = imageTestData.Entities.multipleImages;
    jest.spyOn(database, 'getByGeometry').mockResolvedValue(expected);


    const result = await service.getImagesNearRouteSegment(
      routeSegmentsTestData.routeSegment,
      10,
      3,
    );

    expect(result).toStrictEqual(expected);
  });

  it('should get the number of images near a route', async () => {
    const expected = 4;
    jest.spyOn(database, 'getCountByGeometry').mockResolvedValue(expected);

    const result = await service.getNumberOfImagesNearRouteSegment(
      routeSegmentsTestData.routeSegment,
      10,
    );
    expect(result).toStrictEqual(expected);
  });
});
