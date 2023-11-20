import { Test, TestingModule } from '@nestjs/testing';
import { ImagesController } from './images.controller';
import { ImagesService, NoOrWrongGeoInformationError } from './images.service';
import { PrismaService } from '../prisma.service';
import * as testData from '../../test/data';
import { mockImageFromBuffer } from './test/test.helper';
import { readFileSync } from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ImageController', () => {
  let controller: ImagesController;
  let service: ImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [ImagesService, PrismaService],
    }).compile();

    controller = module.get<ImagesController>(ImagesController);
    service = module.get<ImagesService>(ImagesService);
  });

  it.each([
    'with_geo_information.jpg',
    'with_geo_information.jpeg',
    'with_geo_information.tif',
    'with_geo_information.png',
  ])('should save an image (%s) and return its dto', async (file) => {
    jest
      .spyOn(service, 'saveImages')
      .mockReturnValue(Promise.resolve(testData.dbImages));

    const buffer = readFileSync(`src/images/test/${file}`);

    const result = await controller.uploadFile([mockImageFromBuffer(buffer)]);
    expect(result).toStrictEqual(testData.images);
  });

  it('should fail to save an image without geo information (exif)', async () => {
    jest
      .spyOn(service, 'saveImages')
      .mockRejectedValue(new NoOrWrongGeoInformationError());

    const buffer = readFileSync('src/images/test/without_geo_information.jpg');

    const result = controller.uploadFile([mockImageFromBuffer(buffer)]);
    await expect(result).rejects.toThrow(
      new HttpException(
        'The provided image has no or wrong geo information.',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should return the image dtos for all images near a point', async () => {
    jest
      .spyOn(service, 'getImagesNearCoordinate')
      .mockReturnValue(Promise.resolve(testData.images));

    const result = await controller.getImages(1024, 1024, 0);
    expect(result).toStrictEqual(testData.images);
  });

  it('should fail with a "BadRequest" if parameters are invalid', async () => {
    jest
      .spyOn(service, 'getImagesNearCoordinate')
      .mockRejectedValue(new Error());

    const result = controller.getImages(1024, 1024, -1);

    await expect(result).rejects.toThrow(
      new HttpException('', HttpStatus.BAD_REQUEST),
    );
  });

  it('should fail with a "NotFound" if no images are near a point', async () => {
    jest.spyOn(service, 'getImagesNearCoordinate').mockResolvedValue([]);

    const result = controller.getImages(1024, 1024, 0);

    await expect(result).rejects.toThrow(
      new HttpException('', HttpStatus.NOT_FOUND),
    );
  });
});
