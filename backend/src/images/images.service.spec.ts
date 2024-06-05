/**
 * @file Image service unit tests.
 */
import { Test, TestingModule } from '@nestjs/testing';
import {
  ImagesService,
  InvalidCoordinates,
  InvalidOffsetError,
  NoOrWrongGeoInformationError,
} from './images.service';
import { PrismaService } from '../prisma.service';
import { readFileSync } from 'fs';
import * as testData from '../../test/data';
import {
  ensureExistanceOfStorageDirectory,
  mockFileFromBuffer,
} from './test/test.helper';

jest.mock('@prisma/client', () => {
  const a = jest.fn().mockResolvedValue([]);
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        $queryRaw: a,
      };
    }),

    // necessary as we use sql to convert the image coordinates to postgis see image.service.ts
    Prisma: {
      sql: () => '',
      join: () => '',
    },
  };
});

describe('ImageService', () => {
  let service: ImagesService;
  let prisma: PrismaService;

  beforeAll(() => {
    ensureExistanceOfStorageDirectory();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesService, PrismaService],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it.each(['image/jpeg', 'image/tiff'])(
    'should save a image with mimetype %s on the fileserver and database',
    async (mimetype) => {
      const buffer = readFileSync('src/images/test/with_geo_information.jpg');

      jest.spyOn(prisma, '$queryRaw').mockResolvedValue(testData.dbImages);
      const result = await service.saveImages([
        mockFileFromBuffer(buffer, mimetype),
      ]);

      expect(result).toStrictEqual(testData.dbImages);
    },
  );

  /*
  it('should fail to save a image with invalid mimetype on the fileserver and database', async () => {
    const buffer = readFileSync('src/images/test/with_geo_information.jpg');

    jest.spyOn(prisma, '$queryRaw').mockResolvedValue(testData.dbImages);

    await expect(
      service.saveImages([mockFileFromBuffer(buffer, '')]),
    ).rejects.toThrow(new Error('Invalid mime type'));
  });
  */

  it('should fail to retrieve images if the offset is < 0', async () => {
    await expect(service.getImagesNearCoordinate(0, 0, 0, -1)).rejects.toThrow(
      new InvalidOffsetError(-1),
    );
  });

  it('should fail to retrieve images if longitude or latitude are undefined', async () => {
    await expect(
      service.getImagesNearCoordinate(undefined, 0, 0, -1),
    ).rejects.toThrow(new InvalidCoordinates());
  });

  it('should fail to save an image without exif data', async () => {
    const buffer = readFileSync('src/images/test/without_geo_information.jpg');

    jest.spyOn(prisma, '$queryRaw').mockResolvedValue(testData.dbImages);

    await expect(
      service.saveImages([mockFileFromBuffer(buffer)]),
    ).rejects.toThrow(new NoOrWrongGeoInformationError());
  });

  it('should get all images near a coordinate', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValue(testData.dbImages);

    const result = await service.getImagesNearCoordinate(1024, 1024, 0, 10);

    expect(result).toStrictEqual(testData.images);
  });

  it('should get all images near a route', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValue(testData.dbImages);

    const result = await service.getImagesNearRouteSegment(
      testData.routeSegment,
      10,
    );

    expect(result).toStrictEqual(testData.images);
  });

  it('should get all images near a route limited by the max number of images', async () => {
    jest
      .spyOn(prisma, '$queryRaw')
      .mockResolvedValue(testData.multipleDbImages);

    const result = await service.getImagesNearRouteSegment(
      testData.routeSegment,
      10,
      3,
    );

    expect(result).toStrictEqual(testData.multipleImages);
  });

  it('should get the number of images near a route', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValue([4]);

    const result = await service.getNumberOfImagesNearRouteSegment(
      testData.routeSegment,
      10,
    );
    expect(result).toStrictEqual(4);
  });
});
